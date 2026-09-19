"""Tests for Riot routing resolution.

These run offline: the routing table is a pure function, and the resolution
chain is exercised against a fake session. That matters because the failure
mode being guarded here is silent -- querying the wrong cluster returns an
empty match list rather than an error, so a regression looks like "this player
has no games" instead of like a bug.

    cd backend && python -m pytest tests/ -v
"""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import riot  # noqa: E402


@pytest.fixture(autouse=True)
def _clear_cache():
    riot.clear_cluster_cache()
    yield
    riot.clear_cluster_cache()


# --------------------------------------------------------------------------
# Platform -> cluster table
# --------------------------------------------------------------------------

@pytest.mark.parametrize("platform,expected", [
    # Americas
    ("NA1", "americas"), ("NA", "americas"), ("BR1", "americas"),
    ("LA1", "americas"), ("LA2", "americas"), ("LAN", "americas"),
    ("LAS", "americas"),
    # Europe -- RU and ME1 route to europe, a common source of bugs
    ("EUW1", "europe"), ("EUW", "europe"), ("EUN1", "europe"),
    ("EUNE", "europe"), ("TR1", "europe"), ("RU", "europe"),
    ("ME1", "europe"),
    # Asia is only Korea and Japan
    ("KR", "asia"), ("JP1", "asia"),
    # Oceania moved into the SEA cluster
    ("OC1", "sea"), ("OCE", "sea"), ("SG2", "sea"), ("PH2", "sea"),
    ("TH2", "sea"), ("TW2", "sea"), ("VN2", "sea"),
])
def test_known_platforms_map_to_their_cluster(platform, expected):
    assert riot.cluster_for_platform(platform) == expected


@pytest.mark.parametrize("value", ["na1", "Euw1", " kr ", "oCe"])
def test_platform_lookup_is_case_and_whitespace_insensitive(value):
    assert riot.cluster_for_platform(value) is not None


@pytest.mark.parametrize("cluster", riot.CLUSTERS)
def test_cluster_names_pass_through(cluster):
    """A caller may pass a cluster directly rather than a platform."""
    assert riot.cluster_for_platform(cluster) == cluster
    assert riot.cluster_for_platform(cluster.upper()) == cluster


@pytest.mark.parametrize("value", [None, "", "   ", "Jihan", "1234", "xQc", "ZZ9"])
def test_unrecognised_values_return_none_not_a_guess(value):
    """Returning None is what lets the caller fall through to the probe.

    A tagLine is free text -- '#Jihan' is as valid as '#NA1'. Defaulting an
    unknown tag to 'americas' here is what previously sent EU and KR players
    to the wrong cluster.
    """
    assert riot.cluster_for_platform(value) is None


def test_every_table_entry_names_a_real_cluster():
    assert set(riot.PLATFORM_TO_CLUSTER.values()) <= set(riot.CLUSTERS)


# --------------------------------------------------------------------------
# Key validation
# --------------------------------------------------------------------------

@pytest.mark.parametrize("key", ["", None])
def test_missing_key_is_rejected(key):
    with pytest.raises(riot.RiotConfigError, match="not set"):
        riot.validate_api_key("" if key is None else key)


def test_malformed_key_is_rejected():
    with pytest.raises(riot.RiotConfigError, match="RGAPI-"):
        riot.validate_api_key("not-a-riot-key")


def test_valid_key_shape_is_accepted():
    riot.validate_api_key("RGAPI-00000000-1111-2222-3333-444444444444")


def test_masked_key_never_exposes_the_secret():
    key = "RGAPI-613794ec-838b-460e-9e58-ad94e54fc036"
    masked = riot.masked_api_key(key)
    assert masked.startswith("RGAPI-")
    assert key not in masked
    assert "838b" not in masked
    assert masked.endswith("c036")   # enough to tell two keys apart


def test_masked_key_handles_unset():
    assert riot.masked_api_key("") == "<unset>"


# --------------------------------------------------------------------------
# Retry-After parsing
# --------------------------------------------------------------------------

@pytest.mark.parametrize("raw,expected", [
    ("5", 5),
    ("0", 1),          # never sleep zero and hot-loop
    ("99999", 130),    # clamped, so a bad header cannot stall the request
    (None, 10),        # Riot omits the header sometimes
    ("garbage", 10),
])
def test_retry_after_is_clamped(raw, expected):
    assert riot._parse_retry_after(raw, 130) == expected


# --------------------------------------------------------------------------
# Resolution chain
# --------------------------------------------------------------------------

class FakeSession:
    """Minimal stand-in for aiohttp.ClientSession.

    Maps a URL substring to the ``(status, body)`` it should answer with, and
    records every URL requested so tests can assert on the number of calls --
    which is how the cache and the short-circuits are verified.
    """

    def __init__(self, routes):
        self.routes = routes
        self.calls = []

    def get(self, url, headers=None):
        self.calls.append(url)
        status, body = 404, None
        for fragment, response in self.routes.items():
            if fragment in url:
                status, body = response
                break
        return _FakeCtx(status, body)


class _FakeCtx:
    def __init__(self, status, body):
        self.status = status
        self._body = body
        self.headers = {}

    async def __aenter__(self):
        return self

    async def __aexit__(self, *exc):
        return False

    async def json(self):
        return self._body


PUUID = "test-puuid-0000000000"


@pytest.mark.asyncio
async def test_explicit_region_wins_and_costs_no_requests():
    session = FakeSession({})
    cluster = await riot.resolve_cluster(
        session, PUUID, tag_line="NA1", requested_region="euw1"
    )
    assert cluster == "europe"
    assert session.calls == []


@pytest.mark.asyncio
async def test_riot_region_endpoint_is_preferred_over_tagline():
    """A vanity tagLine must not override what Riot itself reports."""
    session = FakeSession({
        "/region/by-game/lol": (200, {"region": "KR"}),
    })
    cluster = await riot.resolve_cluster(session, PUUID, tag_line="NA1")
    assert cluster == "asia"


@pytest.mark.asyncio
async def test_tagline_used_when_region_endpoint_is_forbidden():
    """403 on the region endpoint is normal for personal keys, not fatal."""
    session = FakeSession({
        "/region/by-game/lol": (403, None),
    })
    cluster = await riot.resolve_cluster(session, PUUID, tag_line="EUW")
    assert cluster == "europe"


@pytest.mark.asyncio
async def test_probe_finds_the_cluster_when_tagline_is_a_vanity_tag():
    """The regression this whole module exists to prevent.

    Key lacks the region endpoint AND the tagLine is not a region -- the old
    code defaulted to americas and returned an empty match list.
    """
    session = FakeSession({
        "/region/by-game/lol": (403, None),
        "europe.api.riotgames.com/lol/match/v5": (200, ["EUW1_123"]),
        "americas.api.riotgames.com/lol/match/v5": (200, []),
    })
    cluster = await riot.resolve_cluster(session, PUUID, tag_line="Jihan")
    assert cluster == "europe"


@pytest.mark.asyncio
async def test_probe_ignores_clusters_that_answer_empty():
    session = FakeSession({
        "/region/by-game/lol": (403, None),
        "americas.api.riotgames.com/lol/match/v5": (200, []),
        "europe.api.riotgames.com/lol/match/v5": (200, []),
        "asia.api.riotgames.com/lol/match/v5": (200, []),
        "sea.api.riotgames.com/lol/match/v5": (200, ["OC1_9"]),
    })
    assert await riot.resolve_cluster(session, PUUID, tag_line="???") == "sea"


@pytest.mark.asyncio
async def test_falls_back_to_americas_when_everything_is_unknown():
    session = FakeSession({"/region/by-game/lol": (403, None)})
    assert await riot.resolve_cluster(session, PUUID, tag_line=None) == "americas"


@pytest.mark.asyncio
async def test_resolution_is_cached_so_the_probe_runs_once():
    session = FakeSession({
        "/region/by-game/lol": (403, None),
        "asia.api.riotgames.com/lol/match/v5": (200, ["KR_1"]),
    })
    first = await riot.resolve_cluster(session, PUUID, tag_line="mystery")
    calls_after_first = len(session.calls)

    second = await riot.resolve_cluster(session, PUUID, tag_line="mystery")

    assert first == second == "asia"
    assert len(session.calls) == calls_after_first, "cached lookup should not re-probe"


@pytest.mark.asyncio
async def test_fatal_status_is_not_retried():
    session = FakeSession({"/lol/match/v5": (404, None)})
    response = await riot.riot_get(session, "https://americas.api.riotgames.com/lol/match/v5/x")
    assert response.status == 404
    assert len(session.calls) == 1, "404 will never succeed on retry"


@pytest.mark.asyncio
async def test_server_error_is_retried_then_surfaced():
    """The pre-refactor code had its backoff after a `return`, so 5xx failed
    permanently on the first attempt. Guard against that regressing."""
    session = FakeSession({"/lol/match/v5": (503, None)})
    response = await riot.riot_get(
        session, "https://americas.api.riotgames.com/lol/match/v5/x", max_retries=2
    )
    assert response.status == 503
    assert len(session.calls) == 3, "should be 1 initial attempt + 2 retries"


# --------------------------------------------------------------------------
# Routing-value sets are not interchangeable
# --------------------------------------------------------------------------

def test_sea_is_valid_for_match_v5():
    """OCE/SEA servers are served by the 'sea' Match-V5 cluster."""
    assert "sea" in riot.CLUSTERS


def test_sea_is_not_valid_for_account_v1():
    """Account-V1's routing values are americas/europe/asia (+esports).

    'sea' is Match-V5 only. Querying account-v1 there fails in a way that
    looks like a rejected key, so the two sets must stay distinct.
    """
    assert "sea" not in riot.ACCOUNT_CLUSTERS
    assert set(riot.ACCOUNT_CLUSTERS) < set(riot.CLUSTERS)


def test_account_cluster_default_is_valid_for_account_v1():
    assert riot.ACCOUNT_CLUSTER in riot.ACCOUNT_CLUSTERS


@pytest.mark.asyncio
async def test_account_lookup_uses_a_single_global_host():
    """Account data is global -- one host resolves any region's Riot ID.

    Guards against reintroducing a per-region account lookup, which is both
    unnecessary and wrong for 'sea'.
    """
    session = FakeSession({"/accounts/by-riot-id/": (200, {"puuid": PUUID})})
    res = await riot.fetch_account(session, "Player", "OC1")
    assert res.ok
    assert len(session.calls) == 1
    assert f"{riot.ACCOUNT_CLUSTER}.api.riotgames.com" in session.calls[0]


@pytest.mark.asyncio
async def test_riot_id_is_url_encoded():
    """Riot IDs allow spaces and unicode; they must not break the URL."""
    session = FakeSession({"/accounts/by-riot-id/": (200, {"puuid": PUUID})})
    await riot.fetch_account(session, "Hide on bush", "KR1")
    assert " " not in session.calls[0]
    assert "Hide%20on%20bush" in session.calls[0]
