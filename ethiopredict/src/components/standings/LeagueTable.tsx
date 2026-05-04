'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { LeagueTableRow } from '@/types';

interface LeagueTableProps {
  rows: LeagueTableRow[];
  highlightTop?: number;    // green left border (UCL spots)
  highlightBottom?: number; // red left border (relegation)
}

export default function LeagueTable({
  rows,
  highlightTop = 4,
  highlightBottom = 3,
}: LeagueTableProps) {
  const { t } = useLanguage();
  const total = rows.length;

  return (
    <div className="overflow-x-auto rounded-xl border border-[#222222]">
      <table className="w-full text-sm min-w-[480px]">
        <thead>
          <tr className="bg-[#1a1a1a] text-[#666666] text-[0.7rem] uppercase tracking-wider">
            <th className="text-left px-4 py-3 w-8">{t('table.pos')}</th>
            <th className="text-left px-4 py-3">{t('table.team')}</th>
            <th className="text-center px-2 py-3 w-8">{t('table.p')}</th>
            <th className="text-center px-2 py-3 w-8">{t('table.w')}</th>
            <th className="text-center px-2 py-3 w-8">{t('table.d')}</th>
            <th className="text-center px-2 py-3 w-8">{t('table.l')}</th>
            <th className="text-center px-2 py-3 w-10">{t('table.gd')}</th>
            <th className="text-center px-4 py-3 w-10">{t('table.pts')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#222222]">
          {rows.map((row) => {
            const isTop = row.position <= highlightTop;
            const isBottom = row.position > total - highlightBottom;
            const borderClass = isTop
              ? 'border-l-2 border-l-[#00E676]'
              : isBottom
              ? 'border-l-2 border-l-[#FF1744]'
              : 'border-l-2 border-l-transparent';

            return (
              <tr
                key={row.team}
                className={`bg-[#111111] hover:bg-[#1a1a1a] transition-colors ${borderClass}`}
              >
                <td className={`px-4 py-3 font-bold text-xs ${isTop ? 'text-[#00E676]' : 'text-[#666666]'}`}>
                  {row.position}
                </td>
                <td className="px-4 py-3 font-semibold text-[#f0f0f0]">{row.team}</td>
                <td className="text-center px-2 py-3 text-[#666666]">{row.played}</td>
                <td className="text-center px-2 py-3 text-[#666666]">{row.won}</td>
                <td className="text-center px-2 py-3 text-[#666666]">{row.drawn}</td>
                <td className="text-center px-2 py-3 text-[#666666]">{row.lost}</td>
                <td className="text-center px-2 py-3 text-[#666666]">
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                <td className="text-center px-4 py-3 font-[family-name:var(--font-bebas)] text-lg text-[#00E676]">
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
