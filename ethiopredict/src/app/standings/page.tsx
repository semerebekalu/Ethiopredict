'use client';

import { useState } from 'react';
import LeagueTable from '@/components/standings/LeagueTable';
import { eplStandings, ethStandings } from '@/data/standings';
import { useLanguage } from '@/context/LanguageContext';

type LeagueTab = 'epl' | 'eth';

export default function StandingsPage() {
  const { t } = useLanguage();
  const [active, setActive] = useState<LeagueTab>('epl');

  const tabs: { key: LeagueTab; label: string }[] = [
    { key: 'epl', label: `🏴󠁧󠁢󠁥󠁮󠁧󠁿 ${t('table.epl')}` },
    { key: 'eth', label: `🇪🇹 ${t('table.eth')}` },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-[#f0f0f0] tracking-widest mb-6">
        League <span className="text-[#00E676]">Standings</span>
      </h1>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6" role="tablist">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={active === key}
            onClick={() => setActive(key)}
            className={`px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider border transition-all
              ${active === key
                ? 'bg-[#00E676] text-black border-[#00E676]'
                : 'bg-[#1a1a1a] text-[#666666] border-[#222222] hover:border-[#00E676] hover:text-[#f0f0f0]'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-xs text-[#666666]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#00E676]" /> Champions League
        </span>
        {active === 'epl' && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#FF1744]" /> Relegation
          </span>
        )}
      </div>

      {active === 'epl' ? (
        <LeagueTable rows={eplStandings} highlightTop={4} highlightBottom={3} />
      ) : (
        <LeagueTable rows={ethStandings} highlightTop={3} highlightBottom={2} />
      )}
    </section>
  );
}
