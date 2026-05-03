'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Result } from '@/types';

interface ResultRowProps {
  result: Result;
}

const outcomeStyle = {
  win:  { bg: 'bg-[#00E676]/10 border-[#00E676]/30', badge: 'bg-[#00E676] text-black',  key: 'history.win'  },
  loss: { bg: 'bg-[#FF1744]/10 border-[#FF1744]/30', badge: 'bg-[#FF1744] text-white',  key: 'history.loss' },
  void: { bg: 'bg-[#1a1a1a] border-[#222222]',       badge: 'bg-[#333333] text-[#666]', key: 'history.void' },
};

export default function ResultRow({ result }: ResultRowProps) {
  const { t } = useLanguage();
  const style = outcomeStyle[result.outcome];

  return (
    <article className={`border rounded-xl px-4 py-3 flex items-center gap-3 ${style.bg}`}>
      {/* Date */}
      <span className="text-[#666666] text-xs font-mono shrink-0 w-20">{result.date}</span>

      {/* Match */}
      <div className="flex-1 min-w-0">
        <p className="text-[#f0f0f0] text-sm font-semibold truncate">
          {result.home} <span className="text-[#444444]">vs</span> {result.away}
        </p>
        <p className="text-[#666666] text-xs mt-0.5 truncate">
          {t('card.ourTip')}: <span className="text-[#f0f0f0]">{result.tip}</span>
          <span className="ml-2 text-[#FFD600] font-[family-name:var(--font-bebas)]">{result.odds}</span>
        </p>
      </div>

      {/* Outcome badge */}
      <span className={`shrink-0 text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded ${style.badge}`}>
        {t(style.key)}
      </span>
    </article>
  );
}
