# Requirements Document

## Introduction

EthioPredict is Ethiopia's #1 football prediction platform, currently built as two static HTML/CSS files (`index.html` and `blog.html`). This project rebuilds EthioPredict as a full Next.js 15 App Router application using TypeScript, Tailwind CSS, shadcn/ui, and lucide-react. The rebuild preserves the existing dark theme with Ethiopian color accents, bilingual English/Amharic support, and Telegram channel integration, while adding dynamic prediction cards, a results history tracker, live/upcoming match listings, dynamic league tables, improved navigation, and a proper affiliate section for 1xBet and Melbet.

---

## Glossary

- **App**: The EthioPredict Next.js 15 application.
- **Prediction_Card**: A UI component displaying a single match prediction including teams, tip, confidence percentage, and odds.
- **Prediction**: A structured data record containing match details, a betting tip, confidence percentage, and odds for a specific fixture.
- **Result**: A historical Prediction record that has been resolved with a win, loss, or void outcome.
- **League_Table**: A ranked list of football clubs in a given league showing position, played, won, drawn, lost, goals, and points.
- **Match**: A scheduled or live football fixture between two teams.
- **Language_Context**: The application-level state that stores the user's selected language (English or Amharic).
- **Affiliate_Link**: A tracked URL pointing to a partner betting platform (1xBet or Melbet).
- **Blog_Post**: A structured content record representing a football analysis article with title, excerpt, tag, date, and read time.
- **Nav**: The sticky top navigation bar present on all pages.
- **Hero**: The full-width banner section at the top of the homepage.
- **Stats_Bar**: The horizontal strip below the Hero displaying key platform statistics.
- **Confidence_Bar**: A visual progress bar representing the percentage confidence of a Prediction.
- **Form_Indicator**: A row of colored dots representing a team's last five match results (W/D/L).
- **Telegram_CTA**: A call-to-action button or card linking to `https://t.me/Hulusport_tips`.
- **Sidebar**: The right-hand column on desktop layouts containing affiliate, standings, and Telegram widgets.
- **EPL**: English Premier League.
- **UCL**: UEFA Champions League.
- **ETH**: Ethiopian Premier League.
- **LaLiga**: Spanish La Liga.

---

## Requirements

### Requirement 1: Project Foundation and Tech Stack

**User Story:** As a developer, I want the project scaffolded with Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui, and lucide-react, so that the codebase is maintainable, type-safe, and consistent with modern React conventions.

#### Acceptance Criteria

1. THE App SHALL be bootstrapped as a Next.js 15 project using the App Router with TypeScript enabled.
2. THE App SHALL use Tailwind CSS for all styling, with no inline style attributes except where dynamically computed values (e.g., confidence bar width percentages) require them.
3. THE App SHALL integrate shadcn/ui as the component library, with components installed via the shadcn CLI.
4. THE App SHALL use lucide-react for all iconography.
5. THE App SHALL be deployable to Vercel with zero additional configuration beyond environment variables.
6. THE App SHALL define all shared TypeScript types (Prediction, Result, Match, LeagueTableRow, BlogPost) in a dedicated `src/types/index.ts` file.
7. THE App SHALL use the `next/font` module to load the Outfit and Bebas Neue Google Fonts, eliminating external font requests at runtime.

---

### Requirement 2: Global Design System and Theme

**User Story:** As a user, I want a consistent dark theme with Ethiopian color accents across all pages, so that the platform feels cohesive and culturally relevant.

#### Acceptance Criteria

1. THE App SHALL apply a dark background (`#0a0a0a`) as the default page background across all routes.
2. THE App SHALL define a Tailwind CSS theme extension with the following custom color tokens: `green` (#00E676), `green-dark` (#00C853), `gold` (#FFD600), `red-accent` (#FF1744), `bg-2` (#111111), `bg-3` (#1a1a1a), `border-subtle` (#222222), `text-muted` (#666666).
3. THE App SHALL use Ethiopian flag colors — green (#00E676), gold (#FFD600), and red (#FF1744) — as the primary accent palette throughout the UI.
4. THE App SHALL render all Amharic text using a font stack that includes `'Noto Sans Ethiopic'` as the first fallback after the primary Outfit font, ensuring correct glyph rendering.
5. THE App SHALL be fully responsive with a mobile-first layout, collapsing multi-column grids to single-column on viewports narrower than 768px.

---

### Requirement 3: Navigation

**User Story:** As a user, I want a clear, sticky navigation bar with links to all major sections, so that I can move between pages without losing my scroll position.

#### Acceptance Criteria

1. THE Nav SHALL be rendered as a sticky header at the top of every page with a z-index that keeps it above all page content.
2. THE Nav SHALL display the following links: Home (`/`), Predictions (`/predictions`), Standings (`/standings`), History (`/history`), Blog (`/blog`).
3. THE Nav SHALL highlight the active route link using a distinct color (the `green` accent token).
4. THE Nav SHALL display a language toggle button that switches the App between English and Amharic.
5. THE Nav SHALL display a Telegram_CTA button linking to `https://t.me/Hulusport_tips`.
6. WHEN the viewport width is less than 768px, THE Nav SHALL hide the link list and display a hamburger icon button instead.
7. WHEN the hamburger icon is activated, THE Nav SHALL render the navigation links in a dropdown panel below the header.

---

### Requirement 4: Language Toggle (Bilingual Support)

**User Story:** As an Ethiopian user, I want to switch the entire site between English and Amharic, so that I can read content in my preferred language.

#### Acceptance Criteria

1. THE App SHALL maintain a Language_Context using React Context that is accessible to all components without prop drilling.
2. WHEN the language toggle is activated, THE App SHALL re-render all translatable text strings in the selected language without a full page reload.
3. THE App SHALL provide English and Amharic translations for all static UI strings including navigation labels, section headings, button labels, hero text, stats bar labels, and footer text.
4. THE App SHALL persist the user's language preference in `localStorage` under the key `ethiopredict_lang` so that the preference is restored on subsequent visits.
5. WHEN the App initialises, THE App SHALL read the `ethiopredict_lang` value from `localStorage` and apply it before the first render to prevent a flash of untranslated content.

---

### Requirement 5: Homepage — Hero Section

**User Story:** As a visitor, I want a compelling hero section on the homepage that communicates the platform's value and drives me to join the Telegram channel, so that I understand what EthioPredict offers immediately.

#### Acceptance Criteria

1. THE Hero SHALL display a badge label, a headline, a supporting paragraph, and a primary Telegram_CTA button.
2. THE Hero SHALL render the headline using the Bebas Neue font at a fluid size between 2.5rem and 5rem using CSS `clamp`.
3. THE Hero SHALL display a decorative football emoji watermark at reduced opacity as a background element.
4. THE Hero SHALL apply a subtle radial gradient background using the `green` accent color at low opacity to reinforce the Ethiopian theme.
5. THE Telegram_CTA button in the Hero SHALL link to `https://t.me/Hulusport_tips` and open in a new browser tab.
6. THE Hero SHALL render all text content through the Language_Context so that it switches correctly when the language toggle is activated.

---

### Requirement 6: Homepage — Stats Bar

**User Story:** As a visitor, I want to see key platform statistics at a glance, so that I can quickly assess EthioPredict's credibility.

#### Acceptance Criteria

1. THE Stats_Bar SHALL display the following four statistics: Win Rate (78%), Followers (2.4K), Tips Today (count of today's predictions), and a "Ethiopia Based" indicator.
2. THE Stats_Bar SHALL render each statistic as a large number in Bebas Neue font with a smaller label below it.
3. THE Stats_Bar SHALL be horizontally scrollable on mobile viewports to prevent layout overflow.
4. THE Stats_Bar labels SHALL be rendered through the Language_Context.

---

### Requirement 7: Today's Predictions Section

**User Story:** As a user, I want to see today's football predictions displayed as cards with match details, tips, confidence levels, and odds, so that I can quickly identify the best bets for the day.

#### Acceptance Criteria

1. THE App SHALL render a list of Prediction_Cards on the homepage and on the `/predictions` route.
2. EACH Prediction_Card SHALL display: league name with flag emoji, match time, home team name, away team name, home team Form_Indicator, away team Form_Indicator, betting tip, odds, Confidence_Bar, and an affiliate bet button.
3. THE Confidence_Bar SHALL render as a horizontal progress bar whose filled width equals the Prediction's confidence percentage, using a green gradient fill.
4. THE App SHALL display league filter tabs above the Prediction_Card list with options: All, EPL, UCL, Ethiopia, La Liga.
5. WHEN a league filter tab is activated, THE App SHALL display only Prediction_Cards whose league matches the selected filter.
6. THE App SHALL source Prediction data from a typed data file at `src/data/predictions.ts` that exports an array of Prediction objects.
7. THE App SHALL display a "No predictions available" message in the active language WHEN the filtered Prediction list is empty.
8. THE Prediction_Card bet button SHALL link to the Affiliate_Link associated with the Prediction and open in a new browser tab.

---

### Requirement 8: Previous Tips / Results History

**User Story:** As a user, I want to see a history of past predictions with their outcomes (win/loss), so that I can evaluate EthioPredict's track record before trusting its tips.

#### Acceptance Criteria

1. THE App SHALL provide a `/history` route that displays a list of resolved Result records.
2. EACH Result record SHALL display: match date, home team, away team, the tip given, the odds, and the outcome (Win, Loss, or Void).
3. THE App SHALL render a Win outcome with a green accent indicator, a Loss outcome with a red accent indicator, and a Void outcome with a muted indicator.
4. THE App SHALL display a summary row at the top of the `/history` page showing total predictions, total wins, total losses, and the overall win rate percentage.
5. THE App SHALL source Result data from a typed data file at `src/data/results.ts` that exports an array of Result objects.
6. THE App SHALL display Result records in reverse chronological order (most recent first).
7. THE `/history` page SHALL include a league filter so users can view results for a specific competition.

---

### Requirement 9: Live / Upcoming Matches Section

**User Story:** As a user, I want to see a list of live and upcoming matches, so that I can plan which games to follow and bet on.

#### Acceptance Criteria

1. THE App SHALL render a Live / Upcoming Matches section on the homepage below the Today's Predictions section.
2. EACH Match entry SHALL display: league name, home team, away team, match status (Live or Upcoming), and scheduled kick-off time.
3. THE App SHALL visually distinguish Live matches from Upcoming matches using a pulsing red "LIVE" badge for live fixtures.
4. THE App SHALL source Match data from a typed data file at `src/data/matches.ts` that exports an array of Match objects.
5. THE App SHALL display Live matches before Upcoming matches in the rendered list.

---

### Requirement 10: Dynamic League Tables

**User Story:** As a user, I want to view current league standings for the EPL and Ethiopian Premier League, so that I can understand team form and context when reading predictions.

#### Acceptance Criteria

1. THE App SHALL provide a `/standings` route that displays league tables.
2. THE `/standings` page SHALL display a tab selector allowing the user to switch between EPL and Ethiopian Premier League tables.
3. EACH League_Table SHALL display rows with: position, team name, played (P), won (W), drawn (D), lost (L), goal difference (GD), and points (Pts).
4. THE App SHALL highlight the top 4 positions in the EPL table with a green left border to indicate Champions League qualification places.
5. THE App SHALL highlight the bottom 3 positions in the EPL table with a red left border to indicate relegation places.
6. THE App SHALL source League_Table data from a typed data file at `src/data/standings.ts` that exports EPL and Ethiopian Premier League table arrays.
7. THE App SHALL also render a compact League_Table widget in the Sidebar on the homepage showing the top 6 EPL positions.

---

### Requirement 11: Blog / Analysis Page

**User Story:** As a user, I want to read in-depth football analysis articles, so that I can make more informed betting decisions.

#### Acceptance Criteria

1. THE App SHALL provide a `/blog` route that displays a grid of Blog_Post cards.
2. EACH Blog_Post card SHALL display: a themed thumbnail area with an emoji, a category tag, a title, an excerpt, a publication date, and an estimated read time.
3. THE Blog_Post card SHALL apply a hover state that elevates the card and highlights its border with the `green` accent color.
4. THE App SHALL source Blog_Post data from a typed data file at `src/data/blog.ts` that exports an array of BlogPost objects.
5. THE `/blog` page SHALL display an affiliate banner below the article grid linking to 1xBet and Melbet.
6. THE Blog_Post card titles and excerpts SHALL be rendered through the Language_Context where translations are available.

---

### Requirement 12: Affiliate Links Section

**User Story:** As a platform operator, I want properly styled affiliate banners for 1xBet and Melbet displayed in prominent locations, so that users are directed to partner betting sites and the platform generates revenue.

#### Acceptance Criteria

1. THE App SHALL render an affiliate widget in the Sidebar on the homepage with buttons for both 1xBet and Melbet.
2. THE App SHALL render a full-width affiliate banner on the `/blog` page below the article grid.
3. THE App SHALL render an affiliate banner on the `/predictions` page below the Prediction_Card list.
4. EACH affiliate button SHALL accept an `href` prop sourced from a central `src/config/affiliates.ts` configuration file so that links can be updated in one place.
5. THE affiliate widget SHALL display a headline, a supporting description, a primary button for 1xBet, and a secondary button for Melbet.
6. ALL affiliate links SHALL open in a new browser tab using `target="_blank"` with `rel="noopener noreferrer"`.
7. THE affiliate section SHALL include a responsible gambling disclaimer stating that users must be 18+ and should bet responsibly.

---

### Requirement 13: Telegram CTA Integration

**User Story:** As a platform operator, I want Telegram channel CTAs placed in multiple high-visibility locations, so that users are consistently encouraged to join the free tips channel.

#### Acceptance Criteria

1. THE App SHALL render a Telegram_CTA button in the Hero section on the homepage.
2. THE App SHALL render a Telegram_CTA card in the Sidebar on the homepage.
3. THE App SHALL render a Telegram_CTA button in the Nav on all pages.
4. ALL Telegram_CTA elements SHALL link to `https://t.me/Hulusport_tips` and open in a new browser tab.
5. THE Telegram_CTA button SHALL use a blue background (#229ED9) consistent with Telegram's brand color.
6. THE Telegram_CTA labels SHALL be rendered through the Language_Context.

---

### Requirement 14: Performance and Accessibility

**User Story:** As a user on a mobile device in Ethiopia, I want the site to load quickly and be accessible, so that I can use it on a slower connection without frustration.

#### Acceptance Criteria

1. THE App SHALL use Next.js `Image` component for all images to enable automatic optimisation, lazy loading, and correct `width`/`height` attributes.
2. THE App SHALL achieve a Lighthouse Performance score of 90 or above on mobile when measured on the Vercel production deployment.
3. THE App SHALL provide `aria-label` attributes on all icon-only buttons (hamburger menu, language toggle) so that screen readers can identify their purpose.
4. THE App SHALL use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<h1>`–`<h3>`) throughout all page layouts.
5. THE App SHALL ensure a colour contrast ratio of at least 4.5:1 between body text and background colours to meet WCAG 2.1 AA standards.
6. THE App SHALL set the `lang` attribute on the `<html>` element to `"en"` by default and update it to `"am"` WHEN the Language_Context is set to Amharic.

---

### Requirement 15: Data Layer and Type Safety

**User Story:** As a developer, I want all data to be typed and sourced from structured files, so that the codebase is easy to maintain and extend when real API integrations are added later.

#### Acceptance Criteria

1. THE App SHALL define the following TypeScript interfaces in `src/types/index.ts`: `Prediction`, `Result`, `Match`, `LeagueTableRow`, `BlogPost`, `AffiliateConfig`.
2. THE `Prediction` interface SHALL include: `id`, `league`, `leagueName`, `time`, `home`, `away`, `homeForm`, `awayForm`, `tip`, `odds`, `confidence`, `affiliate`.
3. THE `Result` interface SHALL include: `id`, `date`, `home`, `away`, `tip`, `odds`, `outcome` (union type: `'win' | 'loss' | 'void'`), `league`.
4. THE `Match` interface SHALL include: `id`, `league`, `home`, `away`, `kickoff`, `status` (union type: `'live' | 'upcoming'`).
5. THE `LeagueTableRow` interface SHALL include: `position`, `team`, `played`, `won`, `drawn`, `lost`, `gd`, `points`.
6. THE `BlogPost` interface SHALL include: `id`, `tag`, `titleEn`, `titleAm`, `excerptEn`, `excerptAm`, `date`, `readTime`, `thumbEmoji`, `thumbClass`.
7. THE App SHALL export all seed data arrays with explicit TypeScript type annotations so that type errors surface at compile time rather than at runtime.
