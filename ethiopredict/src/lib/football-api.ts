/**
 * ESPN public API integration for live EPL standings.
 *
 * No API key required — ESPN's public endpoints are free and open.
 * EPL data is revalidated every hour via Next.js ISR.
 * Ethiopian Premier League is not available on ESPN, so it uses static fallback.
 *
 * EPL league code: eng.1
 */

import type { LeagueTableRow } from '@/types';

const ESPN_STANDINGS_URL =
  'https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings';

// ─── Raw ESPN shape (only fields we use) ─────────────────────────────────────

interface EspnStat {
  name: string;
  value: number;
}

interface EspnEntry {
  team: { displayName: string };
  stats: EspnStat[];
}

interface EspnResponse {
  children: Array<{
    standings: {
      entries: EspnEntry[];
    };
  }>;
}

// ─── Helper: find a stat value by name ───────────────────────────────────────

function stat(stats: EspnStat[], name: string): number {
  return stats.find((s) => s.name === name)?.value ?? 0;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch live EPL standings from ESPN's free public API.
 * Returns null if the request fails — caller falls back to static data.
 */
export async function fetchEplStandings(): Promise<LeagueTableRow[] | null> {
  try {
    const res = await fetch(ESPN_STANDINGS_URL, {
      // Next.js ISR: revalidate every hour
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`[espn-api] HTTP ${res.status}`);
      return null;
    }

    const data: EspnResponse = await res.json();
    const entries: EspnEntry[] = data?.children?.[0]?.standings?.entries ?? [];

    if (entries.length === 0) {
      console.warn('[espn-api] Empty standings response');
      return null;
    }

    return entries.map((entry, index): LeagueTableRow => {
      const s = entry.stats;
      const gd = stat(s, 'pointDifferential');
      return {
        position: Math.round(stat(s, 'rank')) || index + 1,
        team:     entry.team.displayName,
        played:   Math.round(stat(s, 'gamesPlayed')),
        won:      Math.round(stat(s, 'wins')),
        drawn:    Math.round(stat(s, 'ties')),
        lost:     Math.round(stat(s, 'losses')),
        gd:       Math.round(gd),
        points:   Math.round(stat(s, 'points')),
      };
    });
  } catch (err) {
    console.error('[espn-api] Fetch error:', err);
    return null;
  }
}

/**
 * Ethiopian Premier League is not available on ESPN.
 * Always returns null so the caller uses static seed data.
 */
export async function fetchEthStandings(): Promise<LeagueTableRow[] | null> {
  return null;
}
