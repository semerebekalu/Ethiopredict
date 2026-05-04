/**
 * StandingsWidget — Server Component (no 'use client').
 * Fetches live EPL top-6 for the homepage sidebar.
 * Falls back to static data if API key is not configured.
 */

import { useLanguage } from '@/context/LanguageContext';
import { fetchEplStandings } from '@/lib/football-api';
import { eplStandings } from '@/data/standings';

export default async function StandingsWidget() {
  const liveRows = await fetchEplStandings();
  const rows = (liveRows ?? eplStandings).slice(0, 6);

  return (
    <aside aria-label="EPL standings widget" className="bg-[#111111] border border-[#222222] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-[family-name:var(--font-bebas)] text-lg text-[#f0f0f0] tracking-wide">
          EPL Standings
        </h3>
        {liveRows ? (
          <span className="flex items-center gap-1 text-[0.6rem] font-bold uppercase text-[#00E676]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
            Live
          </span>
        ) : null}
      </div>

      <div className="flex flex-col divide-y divide-[#222222]">
        {rows.map((row) => {
          const isTop4 = row.position <= 4;
          return (
            <div key={row.team} className="flex items-center gap-2 py-2 text-sm">
              <span className={`w-5 text-xs font-bold ${isTop4 ? 'text-[#00E676]' : 'text-[#666666]'}`}>
                {row.position}
              </span>
              <span className="flex-1 font-semibold text-[#f0f0f0] truncate">{row.team}</span>
              <span className="text-[#666666] text-xs w-8 text-right">
                {row.gd > 0 ? `+${row.gd}` : row.gd}
              </span>
              <span className="font-[family-name:var(--font-bebas)] text-lg text-[#00E676] w-8 text-right">
                {row.points}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
