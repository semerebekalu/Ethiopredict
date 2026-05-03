'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Lang = 'en' | 'am';

interface LanguageContextValue {
  lang: Lang;
  t: (key: string) => string;
  toggleLang: () => void;
}

// ─── Translations ─────────────────────────────────────────────────────────────

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.predictions': 'Predictions',
    'nav.standings': 'Standings',
    'nav.history': 'History',
    'nav.blog': 'Analysis',
    'nav.telegram': 'Join Telegram',
    'nav.langToggle': '🇪🇹 አማርኛ',

    // Hero
    'hero.badge': '🔥 FREE DAILY PREDICTIONS',
    'hero.headline': "Ethiopia's #1",
    'hero.headlineSub': 'Football Tips',
    'hero.subtext':
      'Expert predictions for EPL, Champions League & Ethiopian Premier League. Free daily tips in Amharic & English.',
    'hero.telegramCta': '✈️ Join Telegram Channel',

    // Stats bar
    'stats.winRate': 'Win Rate',
    'stats.followers': 'Followers',
    'stats.tipsToday': 'Tips Today',
    'stats.based': 'Ethiopia Based',

    // Sections
    'section.todaysPredictions': "Today's Predictions",
    'section.upcomingMatches': 'Live & Upcoming',
    'section.standings': 'EPL Standings',
    'section.telegram': 'Telegram Channel',
    'section.betNow': '🎯 Bet Now & Win!',
    'section.history': 'Tips History',
    'section.blog': 'Football Analysis',

    // Tabs / filters
    'filter.all': 'All',
    'filter.epl': '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL',
    'filter.ucl': '⭐ UCL',
    'filter.eth': '🇪🇹 Ethiopia',
    'filter.laliga': '🇪🇸 La Liga',

    // Prediction card
    'card.ourTip': 'Our Tip',
    'card.confidence': 'Confidence',
    'card.betNow': '🎯 Bet Now — Get Bonus',
    'card.noPredictions': 'No predictions available for this league.',
    'card.odds': 'Odds',

    // Match list
    'match.live': 'LIVE',
    'match.upcoming': 'Upcoming',
    'match.kickoff': 'Kick-off',
    'match.noMatches': 'No matches scheduled.',

    // Standings table
    'table.pos': 'Pos',
    'table.team': 'Team',
    'table.p': 'P',
    'table.w': 'W',
    'table.d': 'D',
    'table.l': 'L',
    'table.gd': 'GD',
    'table.pts': 'Pts',
    'table.epl': 'Premier League',
    'table.eth': 'Ethiopian Premier League',

    // History page
    'history.total': 'Total Tips',
    'history.wins': 'Wins',
    'history.losses': 'Losses',
    'history.winRate': 'Win Rate',
    'history.win': 'WIN',
    'history.loss': 'LOSS',
    'history.void': 'VOID',
    'history.noResults': 'No results found.',

    // Affiliate
    'affiliate.headline': '🎯 Bet Now & Win!',
    'affiliate.subtext':
      "Use our predictions on Ethiopia's top betting sites. Best odds guaranteed.",
    'affiliate.onexbet': '🏆 1xBet — Get Bonus',
    'affiliate.melbet': 'Melbet Ethiopia →',
    'affiliate.bannerHeadline': '🎯 Ready to Bet? Get Your Bonus Now',
    'affiliate.bannerSubtext':
      "Use our predictions on Ethiopia's top rated betting platforms. New users get exclusive welcome bonuses.",
    'affiliate.disclaimer': '18+ | Bet Responsibly | Gambling can be addictive.',

    // Telegram card
    'telegram.headline': '📱 Telegram Channel',
    'telegram.subtext': 'Get predictions instantly on your phone. Free forever.',
    'telegram.join': '✈️ Join Free Channel',

    // Blog
    'blog.headline': 'Football Analysis',
    'blog.subtext':
      'In-depth match previews, team form, and betting insights — in Amharic & English',
    'blog.readMore': 'Read More →',

    // Footer
    'footer.tagline': "Ethiopia's #1 Football Prediction Platform",
    'footer.disclaimer':
      '⚠️ EthioPredict is for entertainment purposes only. We do not encourage gambling. Please bet responsibly. 18+ only. Gambling can be addictive.',

    // Predictions page
    'predictions.headline': "Today's Predictions",
    'predictions.subtext':
      'Expert tips with confidence ratings. Updated daily.',
  },

  am: {
    // Nav
    'nav.home': 'መነሻ',
    'nav.predictions': 'ትንበያ',
    'nav.standings': 'ሰንጠረዥ',
    'nav.history': 'ታሪክ',
    'nav.blog': 'ትንተና',
    'nav.telegram': 'ቴሌግራም ይቀላቀሉ',
    'nav.langToggle': '🇬🇧 English',

    // Hero
    'hero.badge': '🔥 ነፃ ዕለታዊ ትንበያ',
    'hero.headline': 'ኢትዮጵያ #1',
    'hero.headlineSub': 'የኳስ ምክር',
    'hero.subtext':
      'ለEPL፣ ቻምፒዮንስ ሊግ እና ኢትዮጵያ ፕሪሚየር ሊግ የባለሙያ ትንበያዎች። ነፃ ዕለታዊ ምክሮች።',
    'hero.telegramCta': '✈️ ቴሌግራም ቻናል ይቀላቀሉ',

    // Stats bar
    'stats.winRate': 'የድል መጠን',
    'stats.followers': 'ተከታዮች',
    'stats.tipsToday': 'ዛሬ ምክሮች',
    'stats.based': 'ኢትዮጵያ',

    // Sections
    'section.todaysPredictions': 'የዛሬ ትንበያዎች',
    'section.upcomingMatches': 'ቀጥታ እና መጪ',
    'section.standings': 'EPL ሰንጠረዥ',
    'section.telegram': 'ቴሌግራም ቻናል',
    'section.betNow': '🎯 አሁን ይወርቁ!',
    'section.history': 'የምክር ታሪክ',
    'section.blog': 'የእግር ኳስ ትንተና',

    // Tabs / filters
    'filter.all': 'ሁሉም',
    'filter.epl': '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL',
    'filter.ucl': '⭐ UCL',
    'filter.eth': '🇪🇹 ኢትዮጵያ',
    'filter.laliga': '🇪🇸 La Liga',

    // Prediction card
    'card.ourTip': 'ምክር',
    'card.confidence': 'እምነት',
    'card.betNow': '🎯 አሁን ይወርቁ',
    'card.noPredictions': 'ለዚህ ሊግ ምንም ትንበያ የለም።',
    'card.odds': 'ኦድስ',

    // Match list
    'match.live': 'ቀጥታ',
    'match.upcoming': 'መጪ',
    'match.kickoff': 'መጀመሪያ',
    'match.noMatches': 'ምንም ጨዋታ አልተያዘም።',

    // Standings table
    'table.pos': 'ደረጃ',
    'table.team': 'ቡድን',
    'table.p': 'ጨ',
    'table.w': 'አ',
    'table.d': 'አ',
    'table.l': 'ተ',
    'table.gd': 'ጎ.ል',
    'table.pts': 'ነጥ',
    'table.epl': 'ፕሪሚየር ሊግ',
    'table.eth': 'ኢትዮጵያ ፕሪሚየር ሊግ',

    // History page
    'history.total': 'ጠቅላላ ምክሮች',
    'history.wins': 'ድሎች',
    'history.losses': 'ሽንፈቶች',
    'history.winRate': 'የድል መጠን',
    'history.win': 'አሸነፈ',
    'history.loss': 'ተሸነፈ',
    'history.void': 'ተሰረዘ',
    'history.noResults': 'ምንም ውጤት አልተገኘም።',

    // Affiliate
    'affiliate.headline': '🎯 አሁን ይወርቁ!',
    'affiliate.subtext':
      'ምክሮቻችንን በኢትዮጵያ ምርጥ የቁማር ድረ-ገጾች ላይ ይጠቀሙ።',
    'affiliate.onexbet': '🏆 1xBet — ቦነስ ያግኙ',
    'affiliate.melbet': 'Melbet ኢትዮጵያ →',
    'affiliate.bannerHeadline': '🎯 ለመወርወር ዝግጁ ነዎት?',
    'affiliate.bannerSubtext':
      'ምክሮቻችንን በኢትዮጵያ ምርጥ የቁማር ድረ-ገጾች ላይ ይጠቀሙ። አዲስ ተጠቃሚዎች ልዩ የእንኳን ደህና መጡ ቦነስ ያገኛሉ።',
    'affiliate.disclaimer': '18+ | በኃላፊነት ይወርቁ | ቁማር ሱስ ሊያስይዝ ይችላል።',

    // Telegram card
    'telegram.headline': '📱 ቴሌግራም ቻናል',
    'telegram.subtext': 'ትንበያዎቹን ወዲያውኑ ይቀበሉ። ሁልጊዜ ነፃ።',
    'telegram.join': '✈️ ነፃ ቻናል ይቀላቀሉ',

    // Blog
    'blog.headline': 'የእግር ኳስ ትንተና',
    'blog.subtext': 'ጥልቅ የጨዋታ ቅድመ-ዕይታዎች፣ የቡድን ቅርፅ እና የቁማር ምክሮች',
    'blog.readMore': 'ተጨማሪ ያንብቡ →',

    // Footer
    'footer.tagline': 'ኢትዮጵያ #1 የእግር ኳስ ትንበያ መድረክ',
    'footer.disclaimer':
      '⚠️ EthioPredict ለመዝናኛ ዓላማ ብቻ ነው። ቁማርን አናበረታታም። እባክዎ በኃላፊነት ይወርቁ። 18+ ብቻ።',

    // Predictions page
    'predictions.headline': 'የዛሬ ትንበያዎች',
    'predictions.subtext': 'የእምነት ደረጃዎች ያሏቸው የባለሙያ ምክሮች። ዕለት ዕለት ይዘምናሉ።',
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'ethiopredict_lang';

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  // Restore preference from localStorage on mount (task 3.4)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === 'en' || stored === 'am') {
      setLang(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  // Toggle language, persist to localStorage, update <html lang> (task 3.3)
  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'en' ? 'am' : 'en';
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  // Translation lookup with key fallback (task 3.2)
  const t = useCallback(
    (key: string): string => {
      return translations[lang][key] ?? key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside <LanguageProvider>');
  }
  return ctx;
}
