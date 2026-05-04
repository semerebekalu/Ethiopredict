'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { LeagueKey } from '@/types';

interface Tab {
  key: LeagueKey;
  labelKey: string;
  icon: string;
}

const TABS: Tab[] = [
  { key: 'all',    labelKey: 'filter.all',    icon: '⚽' },
  { key: 'epl',    labelKey: 'filter.epl',    icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { key: 'ucl',    labelKey: 'filter.ucl',    icon: '⭐' },
  { key: 'eth',    labelKey: 'filter.eth',    icon: '🇪🇹' },
  { key: 'laliga', labelKey: 'filter.laliga', icon: '🇪🇸' },
];

interface LeagueFilterTabsProps {
  activeLeague: LeagueKey;
  onSelect: (league: LeagueKey) => void;
}

export default function LeagueFilterTabs({ activeLeague, onSelect }: LeagueFilterTabsProps) {
  const { t } = useLanguage();

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none"
      role="tablist"
      aria-label="Filter predictions by league"
    >
      {TABS.map(({ key, labelKey, icon }) => {
        const isActive = activeLeague === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(key)}
            className={`
              shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold
              uppercase tracking-wider border transition-all duration-150
              ${isActive
                ? 'bg-[#00E676] text-black border-[#00E676] shadow-[0_0_16px_rgba(0,230,118,0.35)]'
                : 'bg-[#161616] text-[#666666] border-[#252525] hover:border-[#00E676]/50 hover:text-[#cccccc]'
              }
            `}
          >
            <span aria-hidden="true">{icon}</span>
            {/* Strip the emoji from the translated label since we show it separately */}
            {t(labelKey).replace(/^\p{Emoji_Presentation}\s*/u, '')}
          </button>
        );
      })}
    </div>
  );
}
