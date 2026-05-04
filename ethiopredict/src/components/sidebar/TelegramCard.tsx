'use client';

import { Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const TELEGRAM_URL = 'https://t.me/Hulusport_tips';

export default function TelegramCard() {
  const { t } = useLanguage();

  return (
    <aside
      aria-label="Telegram channel"
      className="bg-gradient-to-br from-[#1a2333] to-[#0d1520] border border-[#229ED9] rounded-xl p-5 text-center"
    >
      <h3 className="font-[family-name:var(--font-bebas)] text-xl text-[#229ED9] tracking-wide mb-2">
        {t('telegram.headline')}
      </h3>
      <p className="text-[#666666] text-xs leading-relaxed mb-4">{t('telegram.subtext')}</p>

      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-[#229ED9] text-white font-bold text-sm py-3 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
      >
        <Send size={14} />
        {t('telegram.join')}
      </a>
    </aside>
  );
}
