'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { AffiliateConfig } from '@/types';

interface AffiliateBannerProps {
  config: AffiliateConfig;
}

export default function AffiliateBanner({ config }: AffiliateBannerProps) {
  const { t } = useLanguage();

  return (
    <section
      aria-label="Betting affiliate partners"
      className="rounded-xl border border-[#00E676] bg-gradient-to-br from-[#1a2a1a] to-[#0d1a0d] p-6 text-center"
    >
      <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-[#00E676] tracking-wide mb-2">
        {t('affiliate.bannerHeadline')}
      </h2>
      <p className="text-[#666666] text-sm mb-5 max-w-md mx-auto leading-relaxed">
        {t('affiliate.bannerSubtext')}
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        {/* 1xBet — primary */}
        <a
          href={config.onexbet}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#00E676] text-black font-extrabold
            text-sm px-6 py-3 rounded-lg hover:scale-105 active:scale-95
            transition-transform shadow-[0_4px_15px_rgba(0,230,118,0.3)]"
        >
          {t('affiliate.onexbet')}
        </a>

        {/* Melbet — secondary */}
        <a
          href={config.melbet}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[#222222] text-[#f0f0f0] font-semibold
            text-sm px-6 py-3 rounded-lg hover:border-[#00E676] hover:text-[#00E676]
            transition-colors"
        >
          {t('affiliate.melbet')}
        </a>
      </div>

      <p className="text-[#444444] text-xs mt-4">{t('affiliate.disclaimer')}</p>
    </section>
  );
}
