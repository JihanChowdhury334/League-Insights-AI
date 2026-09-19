#!/usr/bin/env python3
"""Verify a Riot API key and find which routing cluster serves an account.

Answers the questions you cannot answer by reading code:

  * Is the key live, or expired/typo'd?
  * Which endpoints does *this* key actually have access to? Personal keys are
    granted a narrower set than development keys, and the Account-V1 region
    endpoint is a common omission.
  * Which of the four clusters actually holds a given player's matches?

Usage
-----
    python scripts/check_riot_key.py                      # key check only
    python scripts/check_riot_key.py Faker KR1            # plus a Riot ID
    python scripts/check_riot_key.py "Hide on bush" KR1

Run from the backend/ directory (or anywhere -- .env is located relative to
the source tree, not the working directory).
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import riot  # noqa: E402

GREEN, RED, YELLOW, DIM, RESET = "\033[32m", "\033[31m", "\033[33m", "\033[2m", "\033[0m"
OK, FAIL, WARN = f"{GREEN}PASS{RESET}", f"{RED}FAIL{RESET}", f"{YELLOW}WARN{RESET}"


def explain(status: int) -> str:
    return {
        200: "OK",
        401: "no key sent (check X-Riot-Token / .env parsing)",
        403: "key rejected, expired, or endpoint not granted to this key",
        404: "not found on this cluster",
        429: "rate limited",
        599: "could not reach Riot (network or proxy)",
    }.get(status, f"HTTP {status}")


async def main() -> int:
    print(f"\n{DIM}Riot API key check{RESET}")
    print("=" * 62)

    try:
        riot.validate_api_key()
    except riot.RiotConfigError as exc:
        print(f"{FAIL}  {exc}")
        return 1

    print(f"{OK}  Key present and well-formed: {riot.masked_api_key()}")

    game_name = sys.argv[1] if len(sys.argv) > 2 else None
    tag_line = sys.argv[2] if len(sys.argv) > 2 else None

    async with riot.new_session() as session:
        # ---- 1. Account-V1 reachability ---------------------------------
        # Account-V1 is global: any supported routing value resolves any Riot
        # ID, so a healthy key answers on all of them. Note this iterates
        # ACCOUNT_CLUSTERS, not CLUSTERS -- 'sea' is valid for Match-V5 only,
        # and probing account-v1 there reports a failure that is not real.
        probe_name, probe_tag = (game_name, tag_line) if game_name else ("Faker", "KR1")
        print(f"\n{DIM}Account-V1 by-riot-id, probing {probe_name}#{probe_tag}{RESET}")

        reachable = []
        for cluster in riot.ACCOUNT_CLUSTERS:
            url = (
                f"https://{cluster}.api.riotgames.com"
                f"/riot/account/v1/accounts/by-riot-id/{probe_name}/{probe_tag}"
            )
            res = await riot.riot_get(session, url, max_retries=0)
            mark = OK if res.status in (200, 404) else FAIL
            if res.status in (200, 404):
                reachable.append(cluster)
            print(f"  {mark}  {cluster:<9} {explain(res.status)}")

        if not reachable:
            print(f"\n{FAIL}  No cluster accepted the key. It is expired, revoked,")
            print("        or outbound HTTPS to api.riotgames.com is blocked.")
            return 1

        if not game_name:
            print(
                f"\n{DIM}Pass a Riot ID to test cluster resolution:"
                f"\n  python scripts/check_riot_key.py <gameName> <tagLine>{RESET}\n"
            )
            return 0

        # ---- 2. Resolve the real account --------------------------------
        print(f"\n{DIM}Resolving {game_name}#{tag_line}{RESET}")
        account = await riot.fetch_account(session, game_name, tag_line)
        if not account.ok:
            print(f"  {FAIL}  {explain(account.status)}")
            return 1

        puuid = account.data["puuid"]
        print(f"  {OK}  PUUID {puuid[:12]}...")

        # ---- 3. Is the region endpoint granted to this key? -------------
        print(f"\n{DIM}Account-V1 region endpoint (authoritative when granted){RESET}")
        platform = await riot.fetch_active_platform(session, puuid)
        if platform:
            print(f"  {OK}  Riot reports platform: {platform}")
        else:
            print(f"  {WARN}  Unavailable to this key -- the probe below covers it.")

        # ---- 4. Which cluster actually has the matches? ------------------
        print(f"\n{DIM}Match-V5 per cluster (the ground truth){RESET}")
        found = None
        for cluster in riot.CLUSTERS:
            url = (
                f"https://{cluster}.api.riotgames.com"
                f"/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=1"
            )
            res = await riot.riot_get(session, url, max_retries=0)
            if res.ok and res.data:
                found = found or cluster
                print(f"  {OK}  {cluster:<9} {len(res.data)} match(es) -- serves this player")
            elif res.ok:
                print(f"  {DIM}  ....{RESET} {cluster:<9} reachable, no matches")
            else:
                print(f"  {FAIL}  {cluster:<9} {explain(res.status)}")

        # ---- 5. What the app will actually choose -----------------------
        riot.clear_cluster_cache()
        resolved = await riot.resolve_cluster(session, puuid, tag_line=tag_line)
        print(f"\n{DIM}{'=' * 62}{RESET}")
        print(f"App resolves to: {GREEN}{resolved}{RESET}")

        if found and resolved != found:
            print(f"{FAIL}  Mismatch -- matches actually live on '{found}'.")
            return 1
        if not found:
            print(f"{WARN}  No matches on any cluster: either a fresh account,")
            print("        or no games in the period Riot retains.")
        else:
            print(f"{OK}  Resolution matches where the data lives.\n")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
