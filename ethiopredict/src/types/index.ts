export type FormResult = 'w' | 'd' | 'l';
export type Outcome = 'win' | 'loss' | 'void';
export type MatchStatus = 'live' | 'upcoming';
export type LeagueKey = 'epl' | 'ucl' | 'eth' | 'laliga' | 'all';

export interface Prediction {
  id: string;
  league: LeagueKey;
  leagueName: string;
  time: string;
  home: string;
  away: string;
  homeForm: FormResult[];
  awayForm: FormResult[];
  tip: string;
  odds: string;
  confidence: number; // 0–100
  affiliate: string;
}

export interface Result {
  id: string;
  date: string; // ISO date string e.g. "2026-05-01"
  home: string;
  away: string;
  tip: string;
  odds: string;
  outcome: Outcome;
  league: LeagueKey;
}

export interface Match {
  id: string;
  league: string;
  home: string;
  away: string;
  kickoff: string; // display string e.g. "20:00"
  status: MatchStatus;
}

export interface LeagueTableRow {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: number;
  points: number;
}

export interface BlogPost {
  id: string;
  tag: string;
  titleEn: string;
  titleAm: string;
  excerptEn: string;
  excerptAm: string;
  date: string;
  readTime: string;
  thumbEmoji: string;
  thumbClass: string; // Tailwind gradient class
}

export interface AffiliateConfig {
  onexbet: string;
  melbet: string;
}
