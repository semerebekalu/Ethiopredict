'use client';

import { useLanguage } from '@/context/LanguageContext';
import ConfidenceBar from '@/components/shared/ConfidenceBar';
import FormIndicator from '@/components/shared/FormIndicator';
import type { Prediction } from '@/types';

interface PredictionCardProps {
  prediction: Prediction;
}

export default function PredictionCard({ prediction }: PredictionCardProps) {
  const { t } = useLanguage();
  const { leagueName, time, home, away, homeForm, awayForm, tip, odds, confidence, affiliate } = prediction;

  return (
    <article className="bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-[#00E676] transition-colors duration-200">
      {/* Meta row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#666666] text-[0.7rem] font-bold uppercase tracking-wider">{leagueName}</span>
        <span className="text-[#666666] text-[0.7rem]">⏰ {time}</span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex-1 text-center">
          <p className="font-bold text-[#f0f0f0] text-sm mb-1.5">{home}</p>
          <FormIndicator form={homeForm} />
        </div>
        <span className="font-[family-name:var(--font-bebas)] text-xl text-[#444444] shrink-0">VS</span>
        <div className="flex-1 text-center">
          <p className="font-bold text-[#f0f0f0] text-sm mb-1.5">{away}</p>
          <FormIndicator form={awayForm} />
        </div>
      </div>

      {/* Tip + Odds */}
      <div className="bg-[#1a1a1a] rounded-lg px-4 py-3 flex items-center justify-between mb-3">
        <div>
          <p className="text-[#666666] text-[0.65rem] uppercase tracking-wider mb-0.5">{t('card.ourTip')}</p>
          <p className="text-[#00E676] font-bold text-sm">{tip}</p>
        </div>
        <span className="font-[family-name:var(--font-bebas)] text-2xl text-[#FFD600]">{odds}</span>
      </div>

      {/* Confidence */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[#666666] text-[0.7rem] uppercase tracking-wider shrink-0 w-20">{t('card.confidence')}</span>
        <ConfidenceBar value={confidence} />
        <span className="text-[#00E676] text-[0.7rem] font-bold shrink-0 w-8 text-right">{confidence}%</span>
      </div>

      {/* Bet button */}
      <a
        href={affiliate}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-gradient-to-r from-[#00C853] to-[#00E676] text-black font-extrabold text-sm py-3 rounded-lg uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(0,230,118,0.25)]"
      >
        {t('card.betNow')}
      </a>
    </article>
  );
}
