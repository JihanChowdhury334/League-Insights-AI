"""Riot Games API access layer.

Centralises three things that were previously duplicated across app.py:

1. Credential loading (``RIOT_API_KEY``) with fail-fast validation.
2. Regional routing resolution — turning a Riot ID into the correct
   ``americas`` / ``europe`` / ``asia`` / ``sea`` cluster.
3. A single HTTP GET helper with timeouts, 429 ``Retry-After`` handling and
   exponential backoff.

Routing background
------------------
Match-V5 is served from four *regional routing clusters*, not from platform
hosts. Querying the wrong cluster does not error usefully: it returns an empty
match list (or 404), which is indistinguishable from "this player has no
games". Resolving the cluster correctly is therefore the difference between the
app working and the app looking broken.
"""

from __future__ import annotations

import asyncio
import os
from pathlib import Path
from typing import Any, Optional

import aiohttp
from dotenv import load_dotenv

# --------------------------------------------------------------------------
# Credentials
# --------------------------------------------------------------------------

# Resolve .env relative to this file rather than the working directory, so the
# app boots the same way whether it is started from the repo root, from
# backend/, or by gunicorn under a process manager.
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

RIOT_API_KEY = os.getenv("RIOT_API_KEY", "").strip()

# Account-V1 is a global service: any cluster can resolve any Riot ID. We pin
# one for predictable latency and allow it to be overridden per deployment.
ACCOUNT_CLUSTER = os.getenv("RIOT_ACCOUNT_CLUSTER", "americas")

CLUSTERS = ("americas", "europe", "asia", "sea")

HTTP_TIMEOUT = aiohttp.ClientTimeout(total=30, connect=10)


class RiotConfigError(RuntimeError):
    """Raised when the Riot API credentials are missing or malformed."""


def validate_api_key(key: Optional[str] = None) -> None:
    """Fail fast on a missing or obviously malformed key.

    A truncated or absent key otherwise surfaces much later as a confusing
    403 on every request, which is easy to misdiagnose as a routing problem.
    """
    key = RIOT_API_KEY if key is None else key
    if not key:
        raise RiotConfigError(
            "RIOT_API_KEY is not set. Create backend/.env with "
            "RIOT_API_KEY=RGAPI-... (see backend/.env.example)."
        )
    if not key.startswith("RGAPI-"):
        raise RiotConfigError(
            "RIOT_API_KEY does not look like a Riot key (expected an "
            "'RGAPI-' prefix). Check for stray quotes or whitespace in .env."
        )


def masked_api_key(key: Optional[str] = None) -> str:
    """Render the key safely for logs: prefix + last 4 characters."""
    key = RIOT_API_KEY if key is None else key
    if not key:
        return "<unset>"
    if len(key) <= 14:
        return "RGAPI-****"
    return f"{key[:11]}...{key[-4:]}"


def auth_headers() -> dict:
    return {"X-Riot-Token": RIOT_API_KEY}


# --------------------------------------------------------------------------
# Platform -> regional routing cluster
# --------------------------------------------------------------------------

# Canonical platform IDs, plus the shorthand players actually type as a
# tagLine (``#EUW``, ``#OCE``, ``#NA``). A Riot ID tagLine is free text, so
# these are hints only -- never authoritative.
PLATFORM_TO_CLUSTER = {
    # Americas
    "NA1": "americas", "NA": "americas", "NA2": "americas",
    "BR1": "americas", "BR": "americas",
    "LA1": "americas", "LAN": "americas",
    "LA2": "americas", "LAS": "americas",
    "PBE1": "americas", "PBE": "americas",
    # Europe
    "EUW1": "europe", "EUW": "europe",
    "EUN1": "europe", "EUNE": "europe", "EUN": "europe",
    "TR1": "europe", "TR": "europe",
    "RU": "europe", "RU1": "europe", "RUS": "europe",
    "ME1": "europe", "ME": "europe", "MENA": "europe",
    # Asia
    "KR": "asia", "KR1": "asia",
    "JP1": "asia", "JP": "asia", "JPN": "asia",
    # Southeast Asia / Oceania
    "OC1": "sea", "OCE": "sea", "OC": "sea",
    "PH2": "sea", "PH": "sea",
    "SG2": "sea", "SG": "sea",
    "TH2": "sea", "TH": "sea",
    "TW2": "sea", "TW": "sea",
    "VN2": "sea", "VN": "sea",
    "SEA": "sea",
}


def cluster_for_platform(platform: Optional[str]) -> Optional[str]:
    """Map a platform ID or region shorthand to its routing cluster.

    Returns ``None`` when the value is not a recognised region, so callers can
    tell "unknown" apart from a real answer instead of silently defaulting.
    """
    if not platform:
        return None
    key = platform.strip().upper()
    if key in CLUSTERS or key in {c.upper() for c in CLUSTERS}:
        return key.lower()
    return PLATFORM_TO_CLUSTER.get(key)


# Resolved clusters are stable for a PUUID, so cache them for the process
# lifetime. This keeps the probe below to at most one occurrence per player.
_cluster_cache: dict[str, str] = {}


def cached_cluster(puuid: str) -> Optional[str]:
    return _cluster_cache.get(puuid)


def remember_cluster(puuid: str, cluster: str) -> None:
    _cluster_cache[puuid] = cluster


def clear_cluster_cache() -> None:
    _cluster_cache.clear()


# --------------------------------------------------------------------------
# HTTP helper
# --------------------------------------------------------------------------

# Statuses worth another attempt. 429 is handled separately via Retry-After.
RETRYABLE_STATUSES = {500, 502, 503, 504}

# Statuses that will never succeed on retry, so we surface them immediately.
FATAL_STATUSES = {400, 401, 403, 404, 405, 415}


class RiotResponse:
    """Outcome of a Riot API call: status plus decoded body (if any)."""

    __slots__ = ("status", "data")

    def __init__(self, status: int, data: Any = None):
        self.status = status
        self.data = data

    @property
    def ok(self) -> bool:
        return self.status == 200

    def __repr__(self) -> str:  # pragma: no cover - debugging aid
        return f"RiotResponse(status={self.status})"


async def riot_get(
    session: aiohttp.ClientSession,
    url: str,
    *,
    max_retries: int = 4,
    max_retry_after: int = 130,
    label: str = "",
) -> RiotResponse:
    """GET a Riot endpoint with rate-limit and transient-failure handling.

    Replaces the retry blocks that were copy-pasted across the endpoints. Those
    copies each had the backoff placed after a ``return``, making it dead code:
    a 503 failed permanently on the first attempt instead of being retried.

    Honours ``Retry-After`` on 429 (capped by ``max_retry_after`` so a hostile
    or mistaken header cannot stall a request indefinitely), retries 5xx with
    exponential backoff, and returns fatal statuses to the caller unretried.
    """
    tag = f"[{label}] " if label else ""

    for attempt in range(max_retries + 1):
        try:
            async with session.get(url, headers=auth_headers()) as response:
                status = response.status

                if status == 200:
                    return RiotResponse(200, await response.json())

                if status == 429:
                    retry_after = _parse_retry_after(
                        response.headers.get("Retry-After"), max_retry_after
                    )
                    if attempt == max_retries:
                        print(f"{tag}Rate limited and out of retries: {url}")
                        return RiotResponse(429)
                    print(f"{tag}Rate limited; sleeping {retry_after}s")
                    await asyncio.sleep(retry_after)
                    continue

                if status in FATAL_STATUSES:
                    return RiotResponse(status)

                if status in RETRYABLE_STATUSES and attempt < max_retries:
                    backoff = 2 ** attempt
                    print(f"{tag}HTTP {status}; retrying in {backoff}s")
                    await asyncio.sleep(backoff)
                    continue

                return RiotResponse(status)

        except asyncio.TimeoutError:
            if attempt == max_retries:
                print(f"{tag}Timed out after {max_retries + 1} attempts: {url}")
                return RiotResponse(599)
            await asyncio.sleep(2 ** attempt)
        except aiohttp.ClientError as exc:
            if attempt == max_retries:
                print(f"{tag}Transport error after {max_retries + 1} attempts: {exc}")
                return RiotResponse(599)
            await asyncio.sleep(2 ** attempt)

    return RiotResponse(599)


def _parse_retry_after(raw: Optional[str], cap: int) -> int:
    """Clamp Retry-After into a sane range; default to 10s when absent."""
    try:
        value = int(raw) if raw is not None else 10
    except (TypeError, ValueError):
        value = 10
    return max(1, min(value, cap))


def new_session() -> aiohttp.ClientSession:
    """A session with an explicit timeout and proxy awareness.

    ``trust_env=True`` lets aiohttp honour ``HTTPS_PROXY``/``NO_PROXY``, which
    it ignores by default -- required behind a corporate or sandboxed egress
    proxy. Without the timeout, a stalled Riot call hangs the request forever.
    """
    return aiohttp.ClientSession(timeout=HTTP_TIMEOUT, trust_env=True)


# --------------------------------------------------------------------------
# Account lookup and cluster resolution
# --------------------------------------------------------------------------

async def fetch_account(
    session: aiohttp.ClientSession, game_name: str, tag_line: str
) -> RiotResponse:
    """Resolve a Riot ID (``gameName#tagLine``) to an account record."""
    from urllib.parse import quote

    url = (
        f"https://{ACCOUNT_CLUSTER}.api.riotgames.com"
        f"/riot/account/v1/accounts/by-riot-id/{quote(game_name)}/{quote(tag_line)}"
    )
    return await riot_get(session, url, label="account")


async def fetch_active_platform(
    session: aiohttp.ClientSession, puuid: str
) -> Optional[str]:
    """Ask Riot which platform a PUUID plays LoL on.

    Authoritative when available, but this endpoint is not granted to every
    API key -- development and personal keys frequently answer 403. That is a
    permissions fact, not an error, so it is logged as a downgrade and the
    caller falls back to the other strategies rather than failing.
    """
    url = (
        f"https://{ACCOUNT_CLUSTER}.api.riotgames.com"
        f"/riot/account/v1/region/by-game/lol/by-puuid/{puuid}"
    )
    response = await riot_get(session, url, label="region")

    if response.ok:
        platform = (response.data or {}).get("region")
        if platform:
            return platform.upper()
        return None

    if response.status == 403:
        print(
            "[region] Account-V1 region endpoint not available to this API key "
            "(403); falling back to tagLine hint and cluster probe."
        )
    else:
        print(f"[region] Region lookup returned HTTP {response.status}.")
    return None


async def probe_cluster(session: aiohttp.ClientSession, puuid: str) -> Optional[str]:
    """Find the cluster that actually has this player's matches.

    Last-resort strategy, and the one that makes the app correct regardless of
    key permissions or tagLine. A Match-V5 query against the wrong cluster
    returns an empty list rather than an error, so we ask each cluster for a
    single match ID and keep the first that answers with one.

    Costs at most four requests, once per PUUID per process (see the cache).
    """
    for cluster in CLUSTERS:
        url = (
            f"https://{cluster}.api.riotgames.com"
            f"/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=1"
        )
        response = await riot_get(session, url, max_retries=1, label=f"probe:{cluster}")
        if response.ok and response.data:
            print(f"[region] Probe matched cluster '{cluster}' for {puuid[:8]}...")
            return cluster

    print(f"[region] Probe found no matches on any cluster for {puuid[:8]}...")
    return None


async def resolve_cluster(
    session: aiohttp.ClientSession,
    puuid: str,
    *,
    tag_line: Optional[str] = None,
    requested_region: Optional[str] = None,
) -> str:
    """Determine the routing cluster for a player, best source first.

    1. An explicit ``region`` from the caller, when it names a real region.
    2. The cached answer for this PUUID.
    3. Riot's own Account-V1 region endpoint (authoritative, key permitting).
    4. The tagLine, when it happens to look like a region.
    5. A probe across all four clusters.

    Falls back to ``americas`` only when every strategy is exhausted, and says
    so in the logs rather than defaulting silently.
    """
    explicit = cluster_for_platform(requested_region)
    if explicit:
        remember_cluster(puuid, explicit)
        return explicit

    cached = cached_cluster(puuid)
    if cached:
        return cached

    platform = await fetch_active_platform(session, puuid)
    resolved = cluster_for_platform(platform)
    if resolved:
        print(f"[region] Riot reports platform '{platform}' -> cluster '{resolved}'")
        remember_cluster(puuid, resolved)
        return resolved

    hinted = cluster_for_platform(tag_line)
    if hinted:
        print(f"[region] tagLine '{tag_line}' -> cluster '{hinted}'")
        remember_cluster(puuid, hinted)
        return hinted

    probed = await probe_cluster(session, puuid)
    if probed:
        remember_cluster(puuid, probed)
        return probed

    print("[region] Could not determine cluster; defaulting to 'americas'.")
    return "americas"
