'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LeagueFilterTabs from './LeagueFilterTabs';
import PredictionCard from './PredictionCard';
import type { Prediction, LeagueKey } from '@/types';

interface PredictionListProps {
  predictions: Prediction[];
}

export default function PredictionList({ predictions }: PredictionListProps) {
  const { t } = useLanguage();
  const [activeLeague, setActiveLeague] = useState<LeagueKey>('all');

  const filtered =
    activeLeague === 'all'
      ? predictions
      : predictions.filter((p) => p.league === activeLeague);

  return (
    <div>
      <LeagueFilterTabs activeLeague={activeLeague} onSelect={setActiveLeague} />

      {filtered.length === 0 ? (
        <p className="text-[#666666] text-sm text-center py-12">{t('card.noPredictions')}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((p) => (
            <PredictionCard key={p.id} prediction={p} />
          ))}
        </div>
      )}
    </div>
  );
}
