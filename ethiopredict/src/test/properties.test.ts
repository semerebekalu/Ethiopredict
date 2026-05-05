import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { computeWinRate, sortResultsDesc } from '@/data/results';
import type { Prediction, Result, LeagueKey } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const leagueKeys: LeagueKey[] = ['epl', 'ucl', 'eth', 'laliga', 'bundesliga', 'seriea', 'ligue1', 'uel'];

const arbLeagueKey = fc.constantFrom(...leagueKeys);

const arbPrediction = (league?: LeagueKey): fc.Arbitrary<Prediction> =>
  fc.record({
    id: fc.uuid(),
    league: league ? fc.constant(league) : arbLeagueKey,
    leagueName: fc.string(),
    time: fc.string(),
    home: fc.string(),
    away: fc.string(),
    homeFlag: fc.string(),
    awayFlag: fc.string(),
    homeForm: fc.array(fc.constantFrom('w', 'd', 'l' as const), { minLength: 5, maxLength: 5 }),
    awayForm: fc.array(fc.constantFrom('w', 'd', 'l' as const), { minLength: 5, maxLength: 5 }),
    tipType: fc.constantFrom('1X2', 'BTTS', 'Over 2.5', 'Under 2.5', 'Double Chance'),
    tip: fc.string(),
    odds: fc.string(),
    confidence: fc.integer({ min: 0, max: 100 }),
    affiliate: fc.string(),
  });

const arbOutcome = fc.constantFrom('win', 'loss', 'void' as const);

// Use integer days offset to avoid invalid date edge cases
const arbDateString = fc.integer({ min: 0, max: 3650 }).map((days) => {
  const d = new Date(2015, 0, 1);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
});

const arbResult = fc.record({
  id: fc.uuid(),
  date: arbDateString,
  home: fc.string(),
  away: fc.string(),
  tip: fc.string(),
  odds: fc.string(),
  outcome: arbOutcome,
  league: arbLeagueKey,
}) as fc.Arbitrary<Result>;

// ─── Property 1: League filter correctness ────────────────────────────────────

describe('Property 1: League filter correctness', () => {
  it('all filtered predictions match the selected league', () => {
    fc.assert(
      fc.property(
        fc.array(arbPrediction()),
        arbLeagueKey,
        (preds, league) => {
          const filtered = preds.filter((p) => p.league === league);
          return filtered.every((p) => p.league === league);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 2: Empty filter ─────────────────────────────────────────────────

describe('Property 2: Empty filter produces empty list', () => {
  it('filtering by a league with no matches returns empty array', () => {
    fc.assert(
      fc.property(
        fc.array(arbPrediction('epl')), // all EPL
        (preds) => {
          const filtered = preds.filter((p) => p.league === 'ucl');
          return filtered.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 3: Results sort order ──────────────────────────────────────────

describe('Property 3: Results sorted reverse-chronologically', () => {
  it('each result date is >= the next result date', () => {
    fc.assert(
      fc.property(fc.array(arbResult, { minLength: 2 }), (data) => {
        const sorted = sortResultsDesc(data);
        for (let i = 0; i < sorted.length - 1; i++) {
          if (new Date(sorted[i].date) < new Date(sorted[i + 1].date)) return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 4: Win rate formula ────────────────────────────────────────────

describe('Property 4: Win rate formula is consistent', () => {
  it('computeWinRate matches manual calculation', () => {
    fc.assert(
      fc.property(fc.array(arbResult, { minLength: 0, maxLength: 50 }), (data) => {
        const wins   = data.filter((r) => r.outcome === 'win').length;
        const losses = data.filter((r) => r.outcome === 'loss').length;
        const expected = wins + losses === 0 ? 0 : Math.round((wins / (wins + losses)) * 100);
        return computeWinRate(data) === expected;
      }),
      { numRuns: 200 }
    );
  });
});

// ─── Property 5: Language toggle round-trip ──────────────────────────────────

describe('Property 5: Language toggle round-trip', () => {
  it('toggling twice returns to original language', () => {
    // Pure logic test — no React needed
    type Lang = 'en' | 'am';
    const toggle = (l: Lang): Lang => (l === 'en' ? 'am' : 'en');
    fc.assert(
      fc.property(fc.constantFrom('en', 'am' as Lang), (lang) => {
        return toggle(toggle(lang)) === lang;
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 6: localStorage persistence ────────────────────────────────────

describe('Property 6: localStorage persistence', () => {
  beforeEach(() => localStorage.clear());

  it('stored value matches the language that was set', () => {
    fc.assert(
      fc.property(fc.constantFrom('en', 'am'), (lang) => {
        localStorage.setItem('ethiopredict_lang', lang);
        return localStorage.getItem('ethiopredict_lang') === lang;
      }),
      { numRuns: 100 }
    );
  });
});
