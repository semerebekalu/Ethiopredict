# Design Document — EthioPredict Next.js 15 Rebuild

## Overview

Rebuild the two-file static HTML site (`index.html`, `blog.html`) into a full Next.js 15 App Router application. The app is a football prediction platform targeting Ethiopian users, with bilingual English/Amharic support, dark theme, and affiliate monetisation via 1xBet and Melbet.

All data is static (TypeScript data files) for the initial build. The architecture is designed so that data files can later be swapped for API calls without touching component code.

---

## Architecture

```
Next.js 15 App Router
├── Static data layer  (src/data/*.ts)
├── Type definitions   (src/types/index.ts)
├── Config             (src/config/affiliates.ts)
├── Language context   (src/context/LanguageContext.tsx)
├── Shared components  (src/components/*)
└── App routes         (src/app/*)
```

**Rendering strategy**: All pages use React Server Components by default. The language toggle and any interactive filtering (tabs, hamburger menu) are isolated in small `"use client"` components. This keeps the bundle small and pages fast.

**State**: Only one piece of global state — the selected language. Managed via React Context + `localStorage` persistence. Everything else is local component state (active tab, menu open/closed).

---

## File / Folder Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, LanguageProvider, Nav, Footer
│   ├── page.tsx                # Homepage: Hero, StatsBar, Predictions, Matches, Sidebar
│   ├── predictions/
│   │   └── page.tsx            # Full predictions list + affiliate banner
│   ├── standings/
│   │   └── page.tsx            # League tables with tab switcher
│   ├── history/
│   │   └── page.tsx            # Results history with summary row + filter
│   └── blog/
│       └── page.tsx            # Blog grid + affiliate banner
│
├── components/
│   ├── layout/
│   │   ├── Nav.tsx             # Sticky nav — "use client" (hamburger, active link)
│   │   └── Footer.tsx          # Static footer
│   ├── home/
│   │   ├── Hero.tsx            # Hero section
│   │   └── StatsBar.tsx        # Stats strip
│   ├── predictions/
│   │   ├── PredictionCard.tsx  # Single prediction card
│   │   ├── PredictionList.tsx  # "use client" — holds filter tabs + filtered list
│   │   └── LeagueFilterTabs.tsx # Tab row component
│   ├── matches/
│   │   └── MatchList.tsx       # Live/upcoming match entries
│   ├── standings/
│   │   ├── LeagueTable.tsx     # Full table component
│   │   └── StandingsWidget.tsx # Compact 6-row sidebar widget
│   ├── history/
│   │   ├── ResultRow.tsx       # Single result row
│   │   └── ResultsSummary.tsx  # Win/loss/rate summary bar
│   ├── blog/
│   │   └── BlogCard.tsx        # Article card
│   ├── sidebar/
│   │   ├── AffiliateWidget.tsx # Sidebar affiliate box
│   │   └── TelegramCard.tsx    # Sidebar Telegram CTA
│   ├── shared/
│   │   ├── AffiliateBanner.tsx # Full-width affiliate banner (blog, predictions pages)
│   │   ├── ConfidenceBar.tsx   # Reusable progress bar
│   │   ├── FormIndicator.tsx   # 5-dot form row
│   │   └── TelegramButton.tsx  # Reusable Telegram CTA button
│   └── providers/
│       └── LanguageProvider.tsx # Context provider wrapper ("use client")
│
├── context/
│   └── LanguageContext.tsx     # createContext, useLanguage hook, translations map
│
├── config/
│   └── affiliates.ts           # Affiliate URLs in one place
│
├── data/
│   ├── predictions.ts          # Prediction[] seed data
│   ├── results.ts              # Result[] seed data
│   ├── matches.ts              # Match[] seed data
│   ├── standings.ts            # EPL + ETH LeagueTableRow[] seed data
│   └── blog.ts                 # BlogPost[] seed data
│
└── types/
    └── index.ts                # All shared TypeScript interfaces
```

---

## Page Routes and Their Components

### `/` — Homepage
```
RootLayout
└── page.tsx
    ├── Hero
    ├── StatsBar
    ├── <div class="container grid">
    │   ├── (main column)
    │   │   ├── PredictionList  ("use client" — tabs + filtered cards)
    │   │   └── MatchList
    │   └── (sidebar column)
    │       ├── AffiliateWidget
    │       ├── StandingsWidget
    │       └── TelegramCard
    └── (no extra banner needed)
```

### `/predictions`
```
└── page.tsx
    ├── PredictionList  (full list, same component as homepage)
    └── AffiliateBanner
```

### `/standings`
```
└── page.tsx
    └── StandingsPage  ("use client" — tab switcher between EPL / ETH)
        ├── LeagueTable (EPL)
        └── LeagueTable (ETH)
```

### `/history`
```
└── page.tsx
    ├── ResultsSummary
    ├── LeagueFilterTabs  (reused, "use client")
    └── ResultRow[]
```

### `/blog`
```
└── page.tsx
    ├── BlogCard[]  (grid)
    └── AffiliateBanner
```

---

## Data Models

All interfaces live in `src/types/index.ts`.

```typescript
export type FormResult = 'w' | 'd' | 'l';
export type Outcome = 'win' | 'loss' | 'void';
export type MatchStatus = 'live' | 'upcoming';
export type LeagueKey = 'epl' | 'ucl' | 'eth' | 'laliga' | 'all';

export interface Prediction {
  id: string;
  league: LeagueKey;
  leagueName: string;       // e.g. "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League"
  time: string;             // e.g. "Today 20:00"
  home: string;
  away: string;
  homeForm: FormResult[];   // last 5 results
  awayForm: FormResult[];
  tip: string;
  odds: string;
  confidence: number;       // 0–100
  affiliate: string;        // URL
}

export interface Result {
  id: string;
  date: string;             // ISO date string
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
  kickoff: string;          // display string e.g. "20:00"
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
  thumbClass: string;       // Tailwind gradient class name
}

export interface AffiliateConfig {
  onexbet: string;
  melbet: string;
}
```

---

## Components and Interfaces

### LanguageContext

```typescript
// src/context/LanguageContext.tsx
type Lang = 'en' | 'am';

interface LanguageContextValue {
  lang: Lang;
  t: (key: string) => string;
  toggleLang: () => void;
}
```

The `t()` function looks up a key in a flat translations object. All static UI strings are keyed (e.g. `"nav.predictions"`, `"hero.headline"`, `"footer.disclaimer"`). The translations object is defined in the same file.

On mount, the provider reads `localStorage.getItem('ethiopredict_lang')` and sets initial state. It also updates the `<html lang>` attribute when the language changes.

### Nav

`"use client"` — needs `usePathname()` for active link highlighting and local state for mobile menu open/closed.

Props: none (reads language from context).

### PredictionList

`"use client"` — manages `activeLeague` state for tab filtering.

```typescript
interface PredictionListProps {
  predictions: Prediction[];
}
```

Renders `LeagueFilterTabs` and a mapped list of `PredictionCard`. Filtering is pure client-side array filter — no server round-trip needed.

### PredictionCard

Server component (no interactivity needed).

```typescript
interface PredictionCardProps {
  prediction: Prediction;
}
```

### ConfidenceBar

```typescript
interface ConfidenceBarProps {
  value: number; // 0–100
}
```

Uses an inline `style={{ width: `${value}%` }}` — the only justified use of inline styles per requirements.

### LeagueTable

```typescript
interface LeagueTableProps {
  rows: LeagueTableRow[];
  highlightTop?: number;    // default 4 — green border
  highlightBottom?: number; // default 3 — red border
}
```

### AffiliateBanner / AffiliateWidget

Both accept:
```typescript
interface AffiliateProps {
  config: AffiliateConfig;
}
```

Config is imported from `src/config/affiliates.ts` at the page level and passed down.

---

## State Management Approach

**Language (global)**: React Context via `LanguageProvider` wrapping the root layout. Persisted to `localStorage`. No external state library needed.

**League filter (local)**: `useState` inside `PredictionList` and the history page component. Scoped to the component, no need to lift.

**Mobile menu (local)**: `useState` inside `Nav`.

**Standings tab (local)**: `useState` inside the standings page component.

No Redux, Zustand, or other state library is needed. The app's state surface is small.

---

## Tailwind Theme Extension

In `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      green: '#00E676',
      'green-dark': '#00C853',
      gold: '#FFD600',
      'red-accent': '#FF1744',
      'bg-2': '#111111',
      'bg-3': '#1a1a1a',
      'border-subtle': '#222222',
      'text-muted': '#666666',
    },
    fontFamily: {
      bebas: ['var(--font-bebas)', 'sans-serif'],
      outfit: ['var(--font-outfit)', 'Noto Sans Ethiopic', 'sans-serif'],
    },
  },
}
```

Fonts loaded via `next/font/google` in `layout.tsx` and exposed as CSS variables.

---

## Affiliate Configuration

```typescript
// src/config/affiliates.ts
import type { AffiliateConfig } from '@/types';

export const affiliates: AffiliateConfig = {
  onexbet: 'https://1xbet.com',   // replace with tracked affiliate URL
  melbet: 'https://melbet.com',   // replace with tracked affiliate URL
};
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: League filter shows only matching predictions

*For any* array of predictions and any active league filter (other than "all"), every prediction card rendered by `PredictionList` SHALL have a `league` value equal to the selected filter.

**Validates: Requirements 7.5**

### Property 2: Empty filter produces empty list

*For any* array of predictions filtered by a league key that matches no prediction, the rendered list SHALL be empty and the "no predictions" message SHALL be shown.

**Validates: Requirements 7.7**

### Property 3: Results are sorted reverse-chronologically

*For any* array of Result records, the rendered order on `/history` SHALL have each record's date greater than or equal to the date of the record that follows it.

**Validates: Requirements 8.6**

### Property 4: Win rate calculation is consistent

*For any* array of Result records, the displayed win rate percentage SHALL equal `(wins / (wins + losses)) * 100`, rounded to the nearest integer, where `wins` is the count of records with `outcome === 'win'` and `losses` is the count with `outcome === 'loss'`.

**Validates: Requirements 8.4**

### Property 5: Language toggle round-trip

*For any* initial language state, toggling the language twice SHALL return the app to the original language state.

**Validates: Requirements 4.2**

### Property 6: Language preference persists across sessions

*For any* language selection, after the selection is made, reading `localStorage.getItem('ethiopredict_lang')` SHALL return the selected language key.

**Validates: Requirements 4.4**

---

## Error Handling

- **Empty data arrays**: All list components check for empty arrays and render a translated "no items" message rather than an empty container.
- **Missing translations**: The `t()` function falls back to the key string if a translation is not found, so missing keys are visible during development but never crash the app.
- **Invalid confidence values**: `ConfidenceBar` clamps its `value` prop to `[0, 100]` before applying the inline width style.
- **Affiliate links**: All affiliate `<a>` tags include `rel="noopener noreferrer"` to prevent tab-napping.

---

## Testing Strategy

**Unit / component tests** (Vitest + React Testing Library):
- `ConfidenceBar` renders correct width for boundary values (0, 50, 100)
- `FormIndicator` renders correct dot colors for W/D/L
- `PredictionList` filters correctly when a league tab is activated
- `ResultsSummary` calculates win rate correctly for known arrays
- `LanguageContext` `t()` returns correct strings for both languages; falls back to key for unknown keys

**Property-based tests** (fast-check):
- Property 1: League filter correctness — generate random prediction arrays and random league keys, assert all rendered items match the filter
- Property 2: Empty filter message — generate prediction arrays with no items matching a given league, assert empty state is shown
- Property 3: Results sort order — generate random Result arrays, assert rendered order is reverse-chronological
- Property 4: Win rate formula — generate random Result arrays, assert displayed percentage matches the formula
- Property 5: Language toggle round-trip — assert toggling twice returns to original state
- Property 6: localStorage persistence — assert localStorage value matches selected language after toggle

Each property test runs a minimum of 100 iterations.

**Integration / smoke tests**:
- All 5 routes (`/`, `/predictions`, `/standings`, `/history`, `/blog`) render without errors
- Nav active link highlights the correct route on each page
- Affiliate links have correct `target="_blank"` and `rel` attributes
