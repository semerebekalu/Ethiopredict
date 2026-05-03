import type { Result } from '@/types';

export const results: Result[] = [
  {
    id: 'res-001',
    date: '2026-05-01',
    home: 'Liverpool',
    away: 'Tottenham',
    tip: 'Liverpool Win',
    odds: '1.60',
    outcome: 'win',
    league: 'epl',
  },
  {
    id: 'res-002',
    date: '2026-05-01',
    home: 'Real Madrid',
    away: 'Dortmund',
    tip: 'Both Teams to Score',
    odds: '1.70',
    outcome: 'win',
    league: 'ucl',
  },
  {
    id: 'res-003',
    date: '2026-04-30',
    home: 'Saint George',
    away: 'Dire Dawa',
    tip: 'Saint George Win',
    odds: '1.90',
    outcome: 'win',
    league: 'eth',
  },
  {
    id: 'res-004',
    date: '2026-04-30',
    home: 'Man City',
    away: 'Newcastle',
    tip: 'Over 2.5 Goals',
    odds: '1.75',
    outcome: 'loss',
    league: 'epl',
  },
  {
    id: 'res-005',
    date: '2026-04-29',
    home: 'Barcelona',
    away: 'Sevilla',
    tip: 'Barcelona Win',
    odds: '1.45',
    outcome: 'win',
    league: 'laliga',
  },
  {
    id: 'res-006',
    date: '2026-04-29',
    home: 'Arsenal',
    away: 'Wolves',
    tip: 'Arsenal Win & Over 1.5',
    odds: '1.80',
    outcome: 'win',
    league: 'epl',
  },
  {
    id: 'res-007',
    date: '2026-04-28',
    home: 'Chelsea',
    away: 'Aston Villa',
    tip: 'Draw',
    odds: '3.20',
    outcome: 'loss',
    league: 'epl',
  },
  {
    id: 'res-008',
    date: '2026-04-28',
    home: 'Fasil Kenema',
    away: 'Hawassa Ketema',
    tip: 'Fasil Kenema Win',
    odds: '2.00',
    outcome: 'win',
    league: 'eth',
  },
  {
    id: 'res-009',
    date: '2026-04-27',
    home: 'Bayern Munich',
    away: 'Leverkusen',
    tip: 'Both Teams to Score',
    odds: '1.65',
    outcome: 'win',
    league: 'ucl',
  },
  {
    id: 'res-010',
    date: '2026-04-27',
    home: 'Man United',
    away: 'Brighton',
    tip: 'Man United Win',
    odds: '2.10',
    outcome: 'loss',
    league: 'epl',
  },
  {
    id: 'res-011',
    date: '2026-04-26',
    home: 'Atletico Madrid',
    away: 'Real Sociedad',
    tip: 'Atletico Win',
    odds: '1.70',
    outcome: 'win',
    league: 'laliga',
  },
  {
    id: 'res-012',
    date: '2026-04-26',
    home: 'Dedebit',
    away: 'Adama City',
    tip: 'Draw',
    odds: '3.00',
    outcome: 'void',
    league: 'eth',
  },
  {
    id: 'res-013',
    date: '2026-04-25',
    home: 'Tottenham',
    away: 'Brentford',
    tip: 'Over 2.5 Goals',
    odds: '1.85',
    outcome: 'win',
    league: 'epl',
  },
  {
    id: 'res-014',
    date: '2026-04-24',
    home: 'PSG',
    away: 'Monaco',
    tip: 'PSG Win',
    odds: '1.55',
    outcome: 'win',
    league: 'ucl',
  },
];

/**
 * Compute win rate from a results array.
 * Returns 0 if there are no wins or losses (avoids division by zero).
 */
export function computeWinRate(data: Result[]): number {
  const wins = data.filter((r) => r.outcome === 'win').length;
  const losses = data.filter((r) => r.outcome === 'loss').length;
  if (wins + losses === 0) return 0;
  return Math.round((wins / (wins + losses)) * 100);
}

/**
 * Sort results in reverse chronological order (most recent first).
 */
export function sortResultsDesc(data: Result[]): Result[] {
  return [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
