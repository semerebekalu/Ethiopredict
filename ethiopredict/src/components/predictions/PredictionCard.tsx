'use client';

import { useLanguage } from '@/context/LanguageContext';
import FormIndicator from '@/components/shared/FormIndicator';
import ShareButtons from '@/components/shared/ShareButtons';
import type { Prediction, TipType } from '@/types';

interface PredictionCardProps {
  prediction: Prediction;
}

// ─── Confidence colour helper ─────────────────────────────────────────────────
function confidenceColor(value: number): { bar: string; text: string; glow: string } {
  if (value >= 75) return { bar: 'from-[#00C853] to-[#00E676]', text: 'text-[#00E676]', glow: 'shadow-[0_0_12px_rgba(0,230,118,0.35)]' };
  if (value >= 55) return { bar: 'from-[#F9A825] to-[#FFD600]', text: 'text-[#FFD600]', glow: 'shadow-[0_0_12px_rgba(255,214,0,0.3)]' };
  return { bar: 'from-[#C62828] to-[#FF1744]', text: 'text-[#FF5252]', glow: 'shadow-[0_0_12px_rgba(255,23,68,0.3)]' };
}

// ─── Tip-type badge colour helper ─────────────────────────────────────────────
function tipTypeBadge(tipType: TipType): string {
  switch (tipType) {
    case '1X2':           return 'bg-[#1a2e1a] text-[#00E676] border-[#00E676]/30';
    case 'BTTS':          return 'bg-[#1a1a2e] text-[#7C83FD] border-[#7C83FD]/30';
    case 'Over 2.5':      return 'bg-[#2e1a1a] text-[#FF6B35] border-[#FF6B35]/30';
    case 'Under 2.5':     return 'bg-[#1a2a2e] text-[#29B6F6] border-[#29B6F6]/30';
    case 'Double Chance': return 'bg-[#2e2a1a] text-[#FFD600] border-[#FFD600]/30';
    case 'Draw No Bet':   return 'bg-[#2e1a2e] text-[#CE93D8] border-[#CE93D8]/30';
    default:              return 'bg-[#1a1a1a] text-[#aaaaaa] border-[#333333]';
  }
}

export default function PredictionCard({ prediction }: PredictionCardProps) {
  const { t } = useLanguage();
  const {
    leagueName, time, home, away,
    homeFlag, awayFlag,
    homeForm, awayForm,
    tipType, tip, odds, confidence, affiliate,
  } = prediction;

  const cc = confidenceColor(confidence);
  const clamped = Math.min(100, Math.max(0, confidence));

  return (
    <article className="group relative bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden hover:border-[#333333] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">

      {/* Top accent line — colour matches confidence */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${cc.bar}`} />

      <div className="p-5">

        {/* ── Header row: league + time ── */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[#888888] text-[0.68rem] font-semibold uppercase tracking-widest">
            {leagueName}
          </span>
          <span className="flex items-center gap-1.5 text-[#555555] text-[0.68rem]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            {time}
          </span>
        </div>

        {/* ── Teams row ── */}
        <div className="flex items-center gap-3 mb-4">
          {/* Home */}
          <div className="flex-1 flex flex-col items-center gap-2">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-2xl select-none">
              {homeFlag}
            </div>
            <p className="font-bold text-[#f0f0f0] text-sm text-center leading-tight">{home}</p>
            <FormIndicator form={homeForm} />
          </div>

          {/* VS divider */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <span className="font-[family-name:var(--font-bebas)] text-2xl text-[#333333] tracking-widest">VS</span>
            <span className="text-[#333333] text-[0.6rem] uppercase tracking-widest">form</span>
          </div>

          {/* Away */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-2xl select-none">
              {awayFlag}
            </div>
            <p className="font-bold text-[#f0f0f0] text-sm text-center leading-tight">{away}</p>
            <FormIndicator form={awayForm} />
          </div>
        </div>

        {/* ── Tip row ── */}
        <div className="bg-[#161616] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            {/* Tip-type badge */}
            <span className={`text-[0.6rem] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${tipTypeBadge(tipType)}`}>
              {tipType}
            </span>
            <div>
              <p className="text-[#555555] text-[0.6rem] uppercase tracking-wider leading-none mb-0.5">
                {t('card.ourTip')}
              </p>
              <p className="text-[#f0f0f0] font-bold text-sm leading-tight">{tip}</p>
            </div>
          </div>
          {/* Odds pill */}
          <div className="flex flex-col items-end">
            <p className="text-[#555555] text-[0.6rem] uppercase tracking-wider leading-none mb-0.5">
              {t('card.odds')}
            </p>
            <span className="font-[family-name:var(--font-bebas)] text-2xl text-[#FFD600] leading-none">
              {odds}
            </span>
          </div>
        </div>

        {/* ── Confidence row ── */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[#555555] text-[0.65rem] uppercase tracking-wider">
              {t('card.confidence')}
            </span>
            <span className={`text-xs font-extrabold ${cc.text} ${cc.glow} rounded px-1`}>
              {confidence}%
            </span>
          </div>
          {/* Bar */}
          <div className="w-full h-2 bg-[#1e1e1e] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${cc.bar} transition-all duration-500`}
              style={{ width: `${clamped}%` }}
              role="progressbar"
              aria-valuenow={clamped}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${confidence}% confidence`}
            />
          </div>
        </div>

        {/* ── Bet Now button ── */}
        <a
          href={affiliate}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#00C853] to-[#00E676] text-black font-extrabold text-sm py-3 rounded-xl uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(0,230,118,0.3)] hover:shadow-[0_6px_24px_rgba(0,230,118,0.45)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
          {t('card.betNow')}
        </a>

        {/* ── Share buttons ── */}
        <ShareButtons
          title={`${home} vs ${away} — ${tip}`}
          url="https://ethiopredict.vercel.app/predictions"
        />

      </div>
    </article>
  );
}
