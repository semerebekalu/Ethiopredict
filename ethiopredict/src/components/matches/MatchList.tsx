'use client';

import { useLanguage } from '@/context/LanguageContext';
import { matches } from '@/data/matches';

export default function MatchList() {
  const { t } = useLanguage();

  // Live first, then upcoming
  const sorted = [...matches].sort((a, b) => {
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (a.status !== 'live' && b.status === 'live') return 1;
    return 0;
  });

  return (
    <section aria-label="Live and upcoming matches">
      <h2 className="font-[family-name:var(--font-bebas)] text-xl tracking-widest text-[#f0f0f0] mb-4 flex items-center gap-3">
        {t('section.upcomingMatches')}
        <span className="flex-1 h-px bg-[#222222]" />
      </h2>

      {sorted.length === 0 ? (
        <p className="text-[#666666] text-sm">{t('match.noMatches')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((match) => (
            <div
              key={match.id}
              className="bg-[#111111] border border-[#222222] rounded-xl px-4 py-3 flex items-center gap-3"
            >
              {/* Status badge */}
              {match.status === 'live' ? (
                <span className="shrink-0 bg-[#FF1744] text-white text-[0.6rem] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded animate-pulse">
                  {t('match.live')}
                </span>
              ) : (
                <span className="shrink-0 bg-[#1a1a1a] border border-[#222222] text-[#666666] text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  {t('match.upcoming')}
                </span>
              )}

              {/* Teams */}
              <div className="flex-1 min-w-0">
                <p className="text-[#f0f0f0] text-sm font-semibold truncate">
                  {match.home} <span className="text-[#444444]">vs</span> {match.away}
                </p>
                <p className="text-[#666666] text-[0.7rem] mt-0.5">{match.league}</p>
              </div>

              {/* Kickoff */}
              <span className="shrink-0 text-[#666666] text-xs font-mono">{match.kickoff}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
