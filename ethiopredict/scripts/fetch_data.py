#!/usr/bin/env python3
"""
EthioPredict data fetcher — uses ESPN's free public API.

What it does:
  1. Fetches today's fixtures for EPL, UCL, La Liga
  2. Fetches recent completed results (last 14 days) for the history page
  3. Fetches live EPL standings
  4. Writes updated TypeScript data files to src/data/

Run manually:
  python scripts/fetch_data.py

Or automate with a cron job / GitHub Action (see README).

No API key required.
"""

import json
import re
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError

# ─── Config ───────────────────────────────────────────────────────────────────

LEAGUES = {
    "epl":    {"espn": "eng.1",  "name": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League",   "key": "epl"},
    "ucl":    {"espn": "uefa.champions", "name": "⭐ Champions League", "key": "ucl"},
    "laliga": {"espn": "esp.1",  "name": "🇪🇸 La Liga",               "key": "laliga"},
}

OUT_DIR = Path(__file__).parent.parent / "src" / "data"

# ─── HTTP helper ──────────────────────────────────────────────────────────────

def fetch(url: str) -> dict:
    req = Request(url, headers={"User-Agent": "EthioPredict/1.0"})
    with urlopen(req, timeout=10) as r:
        return json.loads(r.read())

# ─── Fixtures (today's matches) ───────────────────────────────────────────────

def fetch_fixtures() -> list[dict]:
    matches = []
    today = datetime.now(timezone.utc).strftime("%Y%m%d")

    for league_key, cfg in LEAGUES.items():
        try:
            url = f"https://site.api.espn.com/apis/site/v2/sports/soccer/{cfg['espn']}/scoreboard?dates={today}"
            data = fetch(url)
            events = data.get("events", [])

            for event in events:
                comp = event["competitions"][0]
                competitors = comp["competitors"]
                home = next((c for c in competitors if c["homeAway"] == "home"), competitors[0])
                away = next((c for c in competitors if c["homeAway"] == "away"), competitors[1])

                status = comp["status"]["type"]
                is_live = status["state"] == "in"
                is_completed = status["state"] == "post"

                # Parse kickoff time
                dt = datetime.fromisoformat(comp["date"].replace("Z", "+00:00"))
                local_time = dt.strftime("%H:%M")

                # Form string e.g. "WWDLL" → ['w','w','d','l','l']
                def parse_form(form_str: str) -> list[str]:
                    mapping = {"W": "w", "D": "d", "L": "l"}
                    return [mapping.get(c, "d") for c in (form_str or "")[-5:].upper()] or ["d","d","d","d","d"]

                home_form = parse_form(home.get("form", ""))
                away_form = parse_form(away.get("form", ""))

                # Pad to 5 if shorter
                while len(home_form) < 5: home_form.insert(0, "d")
                while len(away_form) < 5: away_form.insert(0, "d")

                match_status = "live" if is_live else "upcoming"

                matches.append({
                    "id": f"match-{event['id']}",
                    "league": cfg["key"],
                    "leagueName": cfg["name"],
                    "home": home["team"]["displayName"],
                    "away": away["team"]["displayName"],
                    "homeFlag": home["team"].get("abbreviation", "?"),
                    "awayFlag": away["team"].get("abbreviation", "?"),
                    "homeForm": home_form,
                    "awayForm": away_form,
                    "time": f"Today {local_time}" if not is_completed else f"FT {home.get('score','?')}-{away.get('score','?')}",
                    "status": match_status,
                    "kickoff": local_time,
                    "homeScore": home.get("score"),
                    "awayScore": away.get("score"),
                    "completed": is_completed,
                })
        except Exception as e:
            print(f"  ⚠ Fixtures error for {league_key}: {e}", file=sys.stderr)

    return matches

# ─── Results (last 14 days of completed matches) ──────────────────────────────

def fetch_results() -> list[dict]:
    results = []
    today = datetime.now(timezone.utc)

    for league_key, cfg in LEAGUES.items():
        try:
            # Fetch last 14 days
            date_from = (today - timedelta(days=14)).strftime("%Y%m%d")
            date_to = today.strftime("%Y%m%d")
            url = f"https://site.api.espn.com/apis/site/v2/sports/soccer/{cfg['espn']}/scoreboard?dates={date_from}-{date_to}&limit=50"
            data = fetch(url)
            events = data.get("events", [])

            for event in events:
                comp = event["competitions"][0]
                status = comp["status"]["type"]

                # Only completed matches
                if status["state"] != "post":
                    continue

                competitors = comp["competitors"]
                home = next((c for c in competitors if c["homeAway"] == "home"), competitors[0])
                away = next((c for c in competitors if c["homeAway"] == "away"), competitors[1])

                home_score = int(home.get("score", 0))
                away_score = int(away.get("score", 0))

                dt = datetime.fromisoformat(comp["date"].replace("Z", "+00:00"))
                date_str = dt.strftime("%Y-%m-%d")

                results.append({
                    "id": f"res-{event['id']}",
                    "date": date_str,
                    "home": home["team"]["displayName"],
                    "away": away["team"]["displayName"],
                    "homeScore": home_score,
                    "awayScore": away_score,
                    "league": cfg["key"],
                    # tip and outcome are left as placeholders — you fill these in
                    "tip": f"{home['team']['displayName']} vs {away['team']['displayName']}",
                    "odds": "—",
                    "outcome": "void",  # update manually after you post tips
                })
        except Exception as e:
            print(f"  ⚠ Results error for {league_key}: {e}", file=sys.stderr)

    # Sort newest first
    results.sort(key=lambda r: r["date"], reverse=True)
    return results[:30]  # keep last 30

# ─── Standings ────────────────────────────────────────────────────────────────

def fetch_standings() -> list[dict]:
    try:
        url = "https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings"
        data = fetch(url)
        entries = data["children"][0]["standings"]["entries"]

        rows = []
        for entry in entries:
            s = {}
            for stat in entry["stats"]:
                if "value" in stat:
                    s[stat["name"]] = stat["value"]
                elif "displayValue" in stat:
                    try:
                        s[stat["name"]] = float(stat["displayValue"])
                    except (ValueError, TypeError):
                        pass
            rows.append({
                "position": int(s.get("rank", 0)),
                "team": entry["team"]["displayName"],
                "played": int(s.get("gamesPlayed", 0)),
                "won": int(s.get("wins", 0)),
                "drawn": int(s.get("ties", 0)),
                "lost": int(s.get("losses", 0)),
                "gd": int(s.get("pointDifferential", 0)),
                "points": int(s.get("points", 0)),
            })
        return sorted(rows, key=lambda r: r["position"])
    except Exception as e:
        print(f"  ⚠ Standings error: {e}", file=sys.stderr)
        return []

# ─── TypeScript writers ───────────────────────────────────────────────────────

def write_matches(matches: list[dict]):
    lines = [
        "// AUTO-GENERATED by scripts/fetch_data.py — do not edit manually",
        f"// Last updated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        "import type { Match } from '@/types';",
        "",
        "export const matches: Match[] = [",
    ]
    for m in matches:
        lines.append(f"  {{")
        lines.append(f"    id: {json.dumps(m['id'])},")
        lines.append(f"    league: {json.dumps(m['league'])},")
        lines.append(f"    home: {json.dumps(m['home'])},")
        lines.append(f"    away: {json.dumps(m['away'])},")
        lines.append(f"    kickoff: {json.dumps(m['kickoff'])},")
        lines.append(f"    status: {json.dumps(m['status'])},")
        lines.append(f"  }},")
    lines.append("];")
    lines.append("")
    (OUT_DIR / "matches.ts").write_text("\n".join(lines), encoding="utf-8")
    print(f"  ✓ matches.ts — {len(matches)} fixtures")

def write_results(results: list[dict]):
    lines = [
        "// AUTO-GENERATED by scripts/fetch_data.py — do not edit manually",
        f"// Last updated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        "// NOTE: Update 'tip', 'odds', and 'outcome' fields manually after posting tips",
        "import type { Result } from '@/types';",
        "",
        "export const results: Result[] = [",
    ]
    for r in results:
        lines.append(f"  {{")
        lines.append(f"    id: {json.dumps(r['id'])},")
        lines.append(f"    date: {json.dumps(r['date'])},")
        lines.append(f"    home: {json.dumps(r['home'])},")
        lines.append(f"    away: {json.dumps(r['away'])},")
        lines.append(f"    tip: {json.dumps(r['tip'])},")
        lines.append(f"    odds: {json.dumps(r['odds'])},")
        lines.append(f"    outcome: {json.dumps(r['outcome'])},")
        lines.append(f"    league: {json.dumps(r['league'])},")
        lines.append(f"  }},")
    lines.append("];")
    lines.append("")
    # Keep the utility functions
    lines.append("""
export function computeWinRate(data: Result[]): number {
  const wins = data.filter((r) => r.outcome === 'win').length;
  const losses = data.filter((r) => r.outcome === 'loss').length;
  if (wins + losses === 0) return 0;
  return Math.round((wins / (wins + losses)) * 100);
}

export function sortResultsDesc(data: Result[]): Result[] {
  return [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
""")
    (OUT_DIR / "results.ts").write_text("\n".join(lines), encoding="utf-8")
    print(f"  ✓ results.ts — {len(results)} results")

def write_standings(rows: list[dict]):
    if not rows:
        print("  ⚠ No standings data — skipping standings.ts update")
        return

    lines = [
        "// AUTO-GENERATED by scripts/fetch_data.py — do not edit manually",
        f"// Last updated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        "import type { LeagueTableRow } from '@/types';",
        "",
        "export const eplStandings: LeagueTableRow[] = [",
    ]
    for r in rows:
        gd = f"+{r['gd']}" if r['gd'] > 0 else str(r['gd'])
        lines.append(
            f"  {{ position: {r['position']}, team: {json.dumps(r['team'])}, "
            f"played: {r['played']}, won: {r['won']}, drawn: {r['drawn']}, "
            f"lost: {r['lost']}, gd: {r['gd']}, points: {r['points']} }},"
        )
    lines.append("];")
    lines.append("")
    # Keep Ethiopian standings (static — ESPN doesn't cover it)
    eth_path = OUT_DIR / "standings.ts"
    existing = eth_path.read_text(encoding="utf-8") if eth_path.exists() else ""
    eth_match = re.search(r"(export const ethStandings.*)", existing, re.DOTALL)
    if eth_match:
        lines.append(eth_match.group(1))
    else:
        lines.append("""export const ethStandings: LeagueTableRow[] = [
  { position: 1,  team: 'Saint George',     played: 26, won: 17, drawn: 5, lost: 4,  gd: 28,  points: 56 },
  { position: 2,  team: 'Fasil Kenema',     played: 26, won: 15, drawn: 6, lost: 5,  gd: 22,  points: 51 },
  { position: 3,  team: 'Wolkite City',     played: 26, won: 14, drawn: 5, lost: 7,  gd: 15,  points: 47 },
  { position: 4,  team: 'Hawassa Ketema',   played: 26, won: 12, drawn: 7, lost: 7,  gd: 10,  points: 43 },
  { position: 5,  team: 'Adama City',       played: 26, won: 11, drawn: 6, lost: 9,  gd: 4,   points: 39 },
  { position: 6,  team: 'Jimma Aba Jifar',  played: 26, won: 10, drawn: 7, lost: 9,  gd: 2,   points: 37 },
  { position: 7,  team: 'Dedebit',          played: 26, won: 9,  drawn: 8, lost: 9,  gd: -1,  points: 35 },
  { position: 8,  team: 'Dire Dawa',        played: 26, won: 8,  drawn: 7, lost: 11, gd: -5,  points: 31 },
  { position: 9,  team: 'Bahir Dar Kenema', played: 26, won: 7,  drawn: 6, lost: 13, gd: -10, points: 27 },
  { position: 10, team: 'Arba Minch',       played: 26, won: 6,  drawn: 5, lost: 15, gd: -15, points: 23 },
  { position: 11, team: 'Sidama Bunna',     played: 26, won: 5,  drawn: 6, lost: 15, gd: -18, points: 21 },
  { position: 12, team: 'Wolaita Dicha',    played: 26, won: 4,  drawn: 4, lost: 18, gd: -32, points: 16 },
];
""")
    eth_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"  ✓ standings.ts — {len(rows)} EPL rows")

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print(f"\n🔄 EthioPredict data fetch — {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}\n")

    print("📅 Fetching fixtures...")
    matches = fetch_fixtures()
    write_matches(matches)

    print("\n📊 Fetching results...")
    results = fetch_results()
    write_results(results)

    print("\n🏆 Fetching EPL standings...")
    standings = fetch_standings()
    write_standings(standings)

    print("\n✅ Done! Commit and push to deploy:\n")
    print("   git add ethiopredict/src/data/")
    print("   git commit -m 'data: auto-update fixtures, results, standings'")
    print("   git push origin main\n")

if __name__ == "__main__":
    main()
