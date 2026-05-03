'use client';

import { useLanguage } from '@/context/LanguageContext';
import { computeWinRate } from '@/data/results';
import type { Result } from '@/types';

interface ResultsSummaryProps {
  results: Result[];
}

export default function ResultsSummary({ results }: ResultsSummaryProps) {
  const { t } = useLanguage();
  const wins   = results.filter((r) => r.outcome === 'win').length;
  const losses = results.filter((r) => r.outcome === 'loss').length;
  const winRate = computeWinRate(results);

  const stats = [
    { num: results.length, label: t('history.total') },
    { num: wins,           label: t('history.wins'),    color: 'text-[#00E676]' },
    { num: losses,         label: t('history.losses'),  color: 'text-[#FF1744]' },
    { num: `${winRate}%`,  label: t('history.winRate'), color: 'text-[#FFD600]' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {stats.map(({ num, label, color }) => (
        <div key={label} className="bg-[#111111] border border-[#222222] rounded-xl p-4 text-center">
          <p className={`font-[family-name:var(--font-bebas)] text-3xl ${color ?? 'text-[#f0f0f0]'}`}>
            {num}
          </p>
          <p className="text-[#666666] text-[0.7rem] uppercase tracking-wider mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
