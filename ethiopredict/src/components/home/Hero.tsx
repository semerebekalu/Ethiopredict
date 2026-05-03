'use client';

import { useLanguage } from '@/context/LanguageContext';
import TelegramButton from '@/components/shared/TelegramButton';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden border-b border-[#222222] bg-[#0a0a0a]"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,230,118,0.07) 0%, transparent 70%), #0a0a0a',
      }}
    >
      {/* Watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center text-[22rem] opacity-[0.025] leading-none"
      >
        ⚽
      </span>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 md:py-24 text-center">
        {/* Badge */}
        <span className="inline-block bg-[#00E676] text-black text-xs font-extrabold tracking-[2px] uppercase px-3 py-1 rounded-full mb-5">
          {t('hero.badge')}
        </span>

        {/* Headline */}
        <h1
          className="font-[family-name:var(--font-bebas)] leading-none text-[#f0f0f0] mb-4"
          style={{ fontSize: 'clamp(2.8rem, 9vw, 5.5rem)' }}
        >
          {t('hero.headline')}
          <br />
          <span className="text-[#00E676]">{t('hero.headlineSub')}</span>
        </h1>

        {/* Subtext */}
        <p className="text-[#666666] text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          {t('hero.subtext')}
        </p>

        {/* CTA */}
        <TelegramButton size="lg" />
      </div>
    </section>
  );
}
