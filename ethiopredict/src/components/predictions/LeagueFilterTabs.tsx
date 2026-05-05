'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { LeagueKey } from '@/types';

interface Tab {
  key: LeagueKey;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { key: 'all',        label: 'All',         icon: '⚽' },
  { key: 'epl',        label: 'EPL',         icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { key: 'ucl',        label: 'UCL',         icon: '⭐' },
  { key: 'eth',        label: 'Ethiopia',    icon: '🇪🇹' },
  { key: 'laliga',     label: 'La Liga',     icon: '🇪🇸' },
  { key: 'bundesliga', label: 'Bundesliga',  icon: '🇩🇪' },
  { key: 'seriea',     label: 'Serie A',     icon: '🇮🇹' },
  { key: 'ligue1',     label: 'Ligue 1',     icon: '🇫🇷' },
  { key: 'uel',        label: 'Europa',      icon: '🟠' },
];

interface LeagueFilterTabsProps {
  activeLeague: LeagueKey;
  onSelect: (league: LeagueKey) => void;
}

export default function LeagueFilterTabs({ activeLeague, onSelect }: LeagueFilterTabsProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none"
      role="tablist"
      aria-label="Filter predictions by league"
    >
      {TABS.map(({ key, label, icon }) => {
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
            {label}
          </button>
        );
      })}
    </div>
  );
}
