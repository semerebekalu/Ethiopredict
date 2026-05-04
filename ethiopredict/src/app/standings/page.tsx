/**
 * Standings page — Server Component.
 * Fetches live EPL + Ethiopian Premier League data from API-Football.
 * Falls back to static seed data if RAPIDAPI_KEY is not set or the request fails.
 */

import LeagueTable from '@/components/standings/LeagueTable';
import StandingsTabSwitcher from '@/components/standings/StandingsTabSwitcher';
import { fetchEplStandings, fetchEthStandings } from '@/lib/football-api';
import { eplStandings, ethStandings } from '@/data/standings';
import type { LeagueTableRow } from '@/types';

export const metadata = {
  title: 'Standings | EthioPredict',
  description: 'Live EPL and Ethiopian Premier League standings updated hourly.',
};

// Revalidate this page every hour (matches the API fetch cache)
export const revalidate = 3600;

export default async function StandingsPage() {
  // Fetch live data; fall back to static if unavailable
  const [liveEpl, liveEth] = await Promise.all([
    fetchEplStandings(),
    fetchEthStandings(),
  ]);

  const eplRows: LeagueTableRow[] = liveEpl ?? eplStandings;
  const ethRows: LeagueTableRow[] = liveEth ?? ethStandings;
  const isLive = liveEpl !== null || liveEth !== null;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-[#f0f0f0] tracking-widest">
          League <span className="text-[#00E676]">Standings</span>
        </h1>

        {/* Live / static badge */}
        {isLive ? (
          <span className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#00E676] bg-[#00E676]/10 border border-[#00E676]/30 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
            Live data
          </span>
        ) : (
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#555555] bg-[#1a1a1a] border border-[#222222] px-3 py-1 rounded-full">
            Static data — add API key for live
          </span>
        )}
      </div>

      {/* Client tab switcher receives pre-fetched rows as props */}
      <StandingsTabSwitcher eplRows={eplRows} ethRows={ethRows} />
    </section>
  );
}
