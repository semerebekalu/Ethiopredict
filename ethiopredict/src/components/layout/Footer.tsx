'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const TELEGRAM_URL = 'https://t.me/Hulusport_tips';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#111111] border-t border-[#222222] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Branding */}
          <div className="text-center md:text-left">
            <p className="font-[family-name:var(--font-bebas)] text-2xl tracking-widest text-[#00E676]">
              Ethio<span className="text-[#f0f0f0]">Predict</span>
            </p>
            <p className="text-[#666666] text-sm mt-1">{t('footer.tagline')}</p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { href: '/',            label: t('nav.home') },
              { href: '/predictions', label: t('nav.predictions') },
              { href: '/standings',   label: t('nav.standings') },
              { href: '/history',     label: t('nav.history') },
              { href: '/blog',        label: t('nav.blog') },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#666666] hover:text-[#00E676] text-sm font-semibold uppercase tracking-wider transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Telegram */}
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#229ED9] text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Send size={15} />
            {t('telegram.join')}
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-[#444444] text-xs text-center mt-8 leading-relaxed max-w-2xl mx-auto">
          {t('footer.disclaimer')}
        </p>
      </div>
    </footer>
  );
}
