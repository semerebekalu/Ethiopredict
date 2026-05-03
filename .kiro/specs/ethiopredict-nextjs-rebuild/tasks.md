# Tasks — EthioPredict Next.js 15 Rebuild

## Task List

- [x] 1. Project scaffolding and configuration
  - [x] 1.1 Bootstrap Next.js 15 project with App Router and TypeScript (`npx create-next-app@latest`)
  - [x] 1.2 Install and configure Tailwind CSS with custom theme tokens (colors, fonts)
  - [x] 1.3 Install shadcn/ui and initialise with dark theme
  - [x] 1.4 Install lucide-react
  - [x] 1.5 Configure `next/font` to load Outfit and Bebas Neue; expose as CSS variables
  - [x] 1.6 Create `src/types/index.ts` with all TypeScript interfaces: `Prediction`, `Result`, `Match`, `LeagueTableRow`, `BlogPost`, `AffiliateConfig`, `FormResult`, `Outcome`, `MatchStatus`, `LeagueKey`
  - [x] 1.7 Create `src/config/affiliates.ts` with placeholder 1xBet and Melbet URLs
  - [x] 1.8 Extend `tailwind.config.ts` with custom color tokens and font families per design

- [x] 2. Seed data files
  - [x] 2.1 Create `src/data/predictions.ts` — export typed `Prediction[]` with 5+ sample predictions across EPL, UCL, ETH, LaLiga
  - [x] 2.2 Create `src/data/results.ts` — export typed `Result[]` with 10+ historical results (mix of win/loss/void)
  - [x] 2.3 Create `src/data/matches.ts` — export typed `Match[]` with 4+ entries (mix of live and upcoming)
  - [x] 2.4 Create `src/data/standings.ts` — export typed EPL and Ethiopian Premier League `LeagueTableRow[]` arrays (20 EPL rows, 10+ ETH rows)
  - [x] 2.5 Create `src/data/blog.ts` — export typed `BlogPost[]` with 6 sample articles matching the existing blog.html content

- [x] 3. Language context and translations
  - [x] 3.1 Create `src/context/LanguageContext.tsx` — define `Lang` type, context value interface, `useLanguage` hook
  - [x] 3.2 Add full translations map for all static UI strings (nav labels, hero text, stats bar labels, section headings, button labels, footer text) in both `en` and `am`
  - [x] 3.3 Implement `toggleLang` function that flips language, persists to `localStorage` under key `ethiopredict_lang`, and updates `<html lang>` attribute
  - [x] 3.4 Implement `localStorage` read on mount to restore language preference before first render
  - [x] 3.5 Create `src/components/providers/LanguageProvider.tsx` — `"use client"` wrapper component

- [x] 4. Root layout and global structure
  - [x] 4.1 Create `src/app/layout.tsx` — wrap with `LanguageProvider`, apply fonts, set default `<html lang="en">`, include `<Nav>` and `<Footer>`
  - [x] 4.2 Create `src/components/layout/Footer.tsx` — disclaimer text, EthioPredict branding, translated via `useLanguage`
  - [x] 4.3 Create `src/components/layout/Nav.tsx` (`"use client"`) — sticky header, logo, nav links with active route highlight via `usePathname`, language toggle button with `aria-label`, Telegram CTA button, hamburger menu for mobile with dropdown panel

- [ ] 5. Shared / reusable components
  - [ ] 5.1 Create `src/components/shared/ConfidenceBar.tsx` — accepts `value: number`, clamps to [0,100], renders progress bar with inline width style and green gradient fill
  - [ ] 5.2 Create `src/components/shared/FormIndicator.tsx` — accepts `form: FormResult[]`, renders 5 colored dots (green=W, gold=D, red=L)
  - [ ] 5.3 Create `src/components/shared/TelegramButton.tsx` — reusable Telegram CTA button with blue (#229ED9) background, `target="_blank"`, translated label
  - [ ] 5.4 Create `src/components/shared/AffiliateBanner.tsx` — full-width banner with 1xBet primary button and Melbet secondary button, responsible gambling disclaimer

- [ ] 6. Homepage sections
  - [ ] 6.1 Create `src/components/home/Hero.tsx` — badge, headline (Bebas Neue, clamp), paragraph, football emoji watermark, radial gradient, Telegram CTA button; all text via `useLanguage`
  - [ ] 6.2 Create `src/components/home/StatsBar.tsx` — four stat items (Win Rate, Followers, Tips Today, Ethiopia Based) with Bebas Neue numbers and translated labels; horizontally scrollable on mobile

- [ ] 7. Prediction components
  - [ ] 7.1 Create `src/components/predictions/LeagueFilterTabs.tsx` (`"use client"`) — tab row for All / EPL / UCL / Ethiopia / La Liga; accepts `activeLeague` and `onSelect` props
  - [ ] 7.2 Create `src/components/predictions/PredictionCard.tsx` — displays league, time, teams, form indicators, tip, odds, confidence bar, and affiliate bet button
  - [ ] 7.3 Create `src/components/predictions/PredictionList.tsx` (`"use client"`) — manages `activeLeague` state, renders `LeagueFilterTabs` + filtered `PredictionCard` list; shows translated empty message when list is empty

- [ ] 8. Sidebar components
  - [ ] 8.1 Create `src/components/sidebar/AffiliateWidget.tsx` — sidebar affiliate box with headline, description, 1xBet primary button, Melbet secondary button
  - [ ] 8.2 Create `src/components/sidebar/TelegramCard.tsx` — sidebar Telegram card with blue border, headline, description, join button
  - [ ] 8.3 Create `src/components/standings/StandingsWidget.tsx` — compact top-6 EPL table for sidebar

- [ ] 9. Homepage (`/`)
  - [ ] 9.1 Create `src/app/page.tsx` — compose Hero, StatsBar, two-column grid (PredictionList + MatchList in main; AffiliateWidget + StandingsWidget + TelegramCard in sidebar)
  - [ ] 9.2 Create `src/components/matches/MatchList.tsx` — renders live matches (with pulsing LIVE badge) before upcoming matches; sourced from `src/data/matches.ts`

- [ ] 10. Predictions page (`/predictions`)
  - [ ] 10.1 Create `src/app/predictions/page.tsx` — full-width PredictionList + AffiliateBanner below

- [ ] 11. Standings page (`/standings`)
  - [ ] 11.1 Create `src/components/standings/LeagueTable.tsx` — full table with position, team, P/W/D/L/GD/Pts columns; accepts `highlightTop` and `highlightBottom` props for colored left borders
  - [ ] 11.2 Create `src/app/standings/page.tsx` (`"use client"`) — tab switcher between EPL and Ethiopian Premier League; renders `LeagueTable` for selected league

- [ ] 12. History page (`/history`)
  - [ ] 12.1 Create `src/components/history/ResultsSummary.tsx` — displays total predictions, wins, losses, win rate percentage computed from Result array
  - [ ] 12.2 Create `src/components/history/ResultRow.tsx` — single result row with date, teams, tip, odds, and outcome badge (green=Win, red=Loss, muted=Void)
  - [ ] 12.3 Create `src/app/history/page.tsx` — ResultsSummary + league filter tabs + ResultRow list sorted reverse-chronologically

- [ ] 13. Blog page (`/blog`)
  - [ ] 13.1 Create `src/components/blog/BlogCard.tsx` — themed thumbnail area, category tag, title, excerpt, date, read time; hover state with green border; titles/excerpts via Language_Context
  - [ ] 13.2 Create `src/app/blog/page.tsx` — grid of BlogCards + AffiliateBanner below

- [ ] 14. Tests
  - [ ] 14.1 Set up Vitest and React Testing Library; configure `vitest.config.ts` and test setup file
  - [ ] 14.2 Install fast-check for property-based testing
  - [ ] 14.3 Write unit test: `ConfidenceBar` renders correct width for values 0, 50, 100 and clamps out-of-range values
  - [ ] 14.4 Write unit test: `FormIndicator` renders correct dot colors for W, D, L inputs
  - [ ] 14.5 Write unit test: `Nav` hamburger button and language toggle have `aria-label` attributes
  - [ ] 14.6 Write unit test: `LanguageContext` `t()` returns correct strings for both languages and falls back to key for unknown keys
  - [ ] 14.7 Write property test: League filter correctness — for any Prediction[] and any LeagueKey (not 'all'), all items returned by the filter function have `league === selectedLeague` (Property 1)
  - [ ] 14.8 Write property test: Empty filter — for any Prediction[] where no item matches a given league key, the filtered array is empty (Property 2)
  - [ ] 14.9 Write property test: Results sort order — for any Result[], the sort function produces an array where each date is >= the next date (Property 3)
  - [ ] 14.10 Write property test: Win rate formula — for any Result[], `computeWinRate(results)` equals `Math.round((wins / (wins + losses)) * 100)` (Property 4)
  - [ ] 14.11 Write property test: Language toggle round-trip — toggling language twice returns to original state (Property 5)
  - [ ] 14.12 Write property test: localStorage persistence — after setting language to any valid value, `localStorage.getItem('ethiopredict_lang')` returns that value (Property 6)

- [ ] 15. Final polish and accessibility
  - [ ] 15.1 Audit all icon-only buttons for `aria-label` attributes
  - [ ] 15.2 Verify semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<h1>`–`<h3>`) is used throughout all pages
  - [ ] 15.3 Ensure all affiliate links have `target="_blank"` and `rel="noopener noreferrer"`
  - [ ] 15.4 Verify `<html lang>` attribute updates correctly when language is toggled
  - [ ] 15.5 Run `next build` and confirm zero TypeScript errors and zero build warnings
