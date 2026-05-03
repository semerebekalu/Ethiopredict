'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const TELEGRAM_URL = 'https://t.me/Hulusport_tips';

const navItems = [
  { href: '/',            labelKey: 'nav.home' },
  { href: '/predictions', labelKey: 'nav.predictions' },
  { href: '/standings',   labelKey: 'nav.standings' },
  { href: '/history',     labelKey: 'nav.history' },
  { href: '/blog',        labelKey: 'nav.blog' },
];

export default function Nav() {
  const { t, toggleLang } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#111111] border-b border-[#222222]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          className="font-[family-name:var(--font-bebas)] text-3xl tracking-widest text-[#00E676] shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          Ethio<span className="text-[#f0f0f0]">Predict</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map(({ href, labelKey }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'text-[#00E676]'
                    : 'text-[#666666] hover:text-[#f0f0f0]'
                }`}
              >
                {t(labelKey)}
              </Link>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            aria-label="Toggle language between English and Amharic"
            className="hidden sm:block bg-[#1a1a1a] border border-[#222222] text-[#f0f0f0] text-xs font-semibold px-3 py-1.5 rounded-full hover:border-[#00E676] hover:text-[#00E676] transition-colors"
          >
            {t('nav.langToggle')}
          </button>

          {/* Telegram CTA */}
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join our Telegram channel"
            className="hidden sm:flex items-center gap-1.5 bg-[#229ED9] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Send size={13} />
            <span>{t('nav.telegram')}</span>
          </a>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden p-1.5 text-[#f0f0f0] hover:text-[#00E676] transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#111111] border-t border-[#222222] px-4 py-4 flex flex-col gap-4">
          {navItems.map(({ href, labelKey }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'text-[#00E676]'
                    : 'text-[#666666] hover:text-[#f0f0f0]'
                }`}
              >
                {t(labelKey)}
              </Link>
            );
          })}

          {/* Mobile lang toggle + Telegram */}
          <div className="flex gap-2 pt-2 border-t border-[#222222]">
            <button
              onClick={() => { toggleLang(); setMenuOpen(false); }}
              aria-label="Toggle language between English and Amharic"
              className="flex-1 bg-[#1a1a1a] border border-[#222222] text-[#f0f0f0] text-xs font-semibold px-3 py-2 rounded-full hover:border-[#00E676] hover:text-[#00E676] transition-colors"
            >
              {t('nav.langToggle')}
            </button>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#229ED9] text-white text-xs font-bold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Send size={13} />
              <span>{t('nav.telegram')}</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
