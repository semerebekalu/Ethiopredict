'use client';

import { useLanguage } from '@/context/LanguageContext';
import { predictions } from '@/data/predictions';

export default function StatsBar() {
  const { t } = useLanguage();

  const stats = [
    { num: '78%',                        label: t('stats.winRate') },
    { num: '2.4K',                       label: t('stats.followers') },
    { num: `${predictions.length}+`,     label: t('stats.tipsToday') },
    { num: '🇪🇹',                         label: t('stats.based') },
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
