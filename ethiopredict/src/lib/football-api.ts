/**
 * API-Football (RapidAPI) integration for live standings.
 *
 * Setup:
 *   1. Sign up at https://rapidapi.com/api-sports/api/api-football
 *   2. Subscribe to the free Basic plan (100 req/day)
 *   3. Copy your X-RapidAPI-Key
 *   4. Add to ethiopredict/.env.local:
 *        RAPIDAPI_KEY=your_key_here
 *
 * League IDs used:
 *   39  — English Premier League
 *   383 — Ethiopian Premier League
 *
 * Data is revalidated every 3600 seconds (1 hour) via Next.js fetch cache.
 * If the key is missing or the request fails, functions return null and
 * callers fall back to the static seed data in src/data/standings.ts.
 */

import type { LeagueTableRow } from '@/types';

const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';
const API_KEY  = process.env.RAPIDAPI_KEY ?? '';

/** Current season year — update each August when the new season starts */
const CURRENT_SEASON = 2024;

// ─── Raw API shape (only the fields we use) ───────────────────────────────────

interface ApiTeam {
  name: string;
}

interface ApiGoals {
  for: number;
  against: number;
}

interface ApiAll {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: ApiGoals;
}

interface ApiStandingEntry {
  rank: number;
  team: ApiTeam;
  points: number;
  goalsDiff: number;
  all: ApiAll;
}

interface ApiStandingsResponse {
  response: Array<{
    league: {
      standings: ApiStandingEntry[][];
    };
  }>;
}

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function fetchStandings(leagueId: number): Promise<LeagueTableRow[] | null> {
  if (!API_KEY) {
    // No key configured — caller will use static fallback
    return null;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/standings?league=${leagueId}&season=${CURRENT_SEASON}`,
      {
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        },
        // Next.js ISR: revalidate every hour
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      console.error(`[football-api] HTTP ${res.status} for league ${leagueId}`);
      return null;
    }

    const data: ApiStandingsResponse = await res.json();
    const entries: ApiStandingEntry[] = data?.response?.[0]?.league?.standings?.[0] ?? [];

    if (entries.length === 0) {
      console.warn(`[football-api] Empty standings for league ${leagueId}`);
      return null;
    }

    return entries.map((entry): LeagueTableRow => ({
      position: entry.rank,
      team:     entry.team.name,
      played:   entry.all.played,
      won:      entry.all.win,
      drawn:    entry.all.draw,
      lost:     entry.all.lose,
      gd:       entry.goalsDiff,
      points:   entry.points,
    }));
  } catch (err) {
    console.error(`[football-api] Fetch error for league ${leagueId}:`, err);
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Fetch live EPL standings. Returns null if API key is missing or request fails. */
export async function fetchEplStandings(): Promise<LeagueTableRow[] | null> {
  return fetchStandings(39);
}

/** Fetch live Ethiopian Premier League standings. Returns null on failure. */
export async function fetchEthStandings(): Promise<LeagueTableRow[] | null> {
  return fetchStandings(383);
}
