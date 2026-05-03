'use client';

import { Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const TELEGRAM_URL = 'https://t.me/Hulusport_tips';

interface TelegramButtonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function TelegramButton({
  size = 'md',
  className = '',
}: TelegramButtonProps) {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  const iconSize = { sm: 13, md: 16, lg: 18 }[size];

  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join our Telegram channel for free football tips"
      className={`inline-flex items-center font-bold rounded-lg bg-[#229ED9] text-white
        hover:opacity-90 active:scale-95 transition-all duration-150
        shadow-[0_4px_20px_rgba(34,158,217,0.3)] hover:shadow-[0_6px_28px_rgba(34,158,217,0.45)]
        ${sizeClasses[size]} ${className}`}
    >
      <Send size={iconSize} />
      <span>{t('hero.telegramCta')}</span>
    </a>
  );
}
