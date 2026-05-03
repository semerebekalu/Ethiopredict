'use client';

import { useLanguage } from '@/context/LanguageContext';
import { eplStandings } from '@/data/standings';

export default function StandingsWidget() {
  const { t } = useLanguage();
  const top6 = eplStandings.slice(0, 6);

  return (
    <aside aria-label="EPL standings widget" className="bg-[#111111] border border-[#222222] rounded-xl p-5">
      <h3 className="font-[family-name:var(--font-bebas)] text-lg text-[#f0f0f0] tracking-wide mb-3">
        {t('section.standings')}
      </h3>

      <div className="flex flex-col divide-y divide-[#222222]">
        {top6.map((row) => {
          const isTop4 = row.position <= 4;
          return (
            <div key={row.team} className="flex items-center gap-2 py-2 text-sm">
              <span className={`w-5 text-xs font-bold ${isTop4 ? 'text-[#00E676]' : 'text-[#666666]'}`}>
                {row.position}
              </span>
              <span className="flex-1 font-semibold text-[#f0f0f0] truncate">{row.team}</span>
              <span className="text-[#666666] text-xs w-8 text-right">{row.gd > 0 ? `+${row.gd}` : row.gd}</span>
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
