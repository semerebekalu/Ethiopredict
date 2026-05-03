'use client';

import { useState } from 'react';
import ResultsSummary from '@/components/history/ResultsSummary';
import ResultRow from '@/components/history/ResultRow';
import LeagueFilterTabs from '@/components/predictions/LeagueFilterTabs';
import { results, sortResultsDesc } from '@/data/results';
import { useLanguage } from '@/context/LanguageContext';
import type { LeagueKey } from '@/types';

export default function HistoryPage() {
  const { t } = useLanguage();
  const [activeLeague, setActiveLeague] = useState<LeagueKey>('all');

  const sorted = sortResultsDesc(results);
  const filtered = activeLeague === 'all'
    ? sorted
    : sorted.filter((r) => r.league === activeLeague);

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-[#f0f0f0] tracking-widest mb-2">
        Tips <span className="text-[#00E676]">History</span>
      </h1>
      <p className="text-[#666666] text-sm mb-8">Track record of all past predictions.</p>

      <ResultsSummary results={results} />

      <LeagueFilterTabs activeLeague={activeLeague} onSelect={setActiveLeague} />

      {filtered.length === 0 ? (
        <p className="text-[#666666] text-sm text-center py-12">{t('history.noResults')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <ResultRow key={r.id} result={r} />
          ))}
        </div>
      )}
    </section>
  );
}
