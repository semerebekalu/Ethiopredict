'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { LeagueKey } from '@/types';

interface Tab {
  key: LeagueKey;
  labelKey: string;
}

const TABS: Tab[] = [
  { key: 'all',    labelKey: 'filter.all' },
  { key: 'epl',    labelKey: 'filter.epl' },
  { key: 'ucl',    labelKey: 'filter.ucl' },
  { key: 'eth',    labelKey: 'filter.eth' },
  { key: 'laliga', labelKey: 'filter.laliga' },
];

interface LeagueFilterTabsProps {
  activeLeague: LeagueKey;
  onSelect: (league: LeagueKey) => void;
}

export default function LeagueFilterTabs({ activeLeague, onSelect }: LeagueFilterTabsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none" role="tablist" aria-label="Filter by league">
      {TABS.map(({ key, labelKey }) => {
        const isActive = activeLeague === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(key)}
            className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-150
              ${isActive
                ? 'bg-[#00E676] text-black border-[#00E676]'
                : 'bg-[#1a1a1a] text-[#666666] border-[#222222] hover:border-[#00E676] hover:text-[#f0f0f0]'
              }`}
          >
            {t(labelKey)}
          </button>
        );
      })}
    </div>
  );
}
