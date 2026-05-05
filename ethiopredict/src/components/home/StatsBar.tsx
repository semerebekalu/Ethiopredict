'use client';

import { useLanguage } from '@/context/LanguageContext';
import { predictions } from '@/data/predictions';
import { results } from '@/data/results';
import { computeStats } from '@/lib/stats';

export default function StatsBar() {
  const { t } = useLanguage();

  const { winRate, streak, streakType } = computeStats(results);

  // Count today's predictions (those with "Today" in the time field)
  const tipsToday = predictions.filter(p => p.time.includes('Today')).length || predictions.length;

  // Streak badge: show if win streak >= 3
  const streakLabel = streakType === 'win' && streak >= 3
    ? `🔥 ${streak} Win Streak`
    : '🇪🇹';

  const streakStatLabel = streakType === 'win' && streak >= 3
    ? 'Win Streak'
    : t('stats.based');

  const stats = [
    { num: `${winRate}%`,        label: t('stats.winRate') },
    { num: '12K+',               label: t('stats.followers') },
    { num: `${tipsToday}+`,      label: t('stats.tipsToday') },
    { num: streakLabel,          label: streakStatLabel },
  ];

  return (
    <div className="bg-[#111111] border-b border-[#222222] overflow-x-auto">
      <div className="flex min-w-max mx-auto divide-x divide-[#222222]">
        {stats.map(({ num, label }) => (
          <div key={label} className="flex-1 min-w-[120px] px-8 py-4 text-center">
            <div
              className="font-[family-name:var(--font-bebas)] text-3xl text-[#00E676] leading-none"
            >
              {num}
            </div>
            <div className="text-[#666666] text-[0.7rem] uppercase tracking-widest mt-1">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
