'use client';

import { useLanguage } from '@/context/LanguageContext';
import { affiliates } from '@/config/affiliates';

export default function AffiliateWidget() {
  const { t } = useLanguage();

  return (
    <aside
      aria-label="Betting partners"
      className="bg-gradient-to-br from-[#1a2a1a] to-[#0d1a0d] border border-[#00E676] rounded-xl p-5 text-center"
    >
      <h3 className="font-[family-name:var(--font-bebas)] text-xl text-[#00E676] tracking-wide mb-2">
        {t('affiliate.headline')}
      </h3>
      <p className="text-[#666666] text-xs leading-relaxed mb-4">{t('affiliate.subtext')}</p>

      <a
        href={affiliates.onexbet}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-[#00E676] text-black font-extrabold text-sm py-3 rounded-lg mb-2 hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-wider"
      >
        {t('affiliate.onexbet')}
      </a>
      <a
        href={affiliates.melbet}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full border border-[#222222] text-[#f0f0f0] font-semibold text-sm py-2.5 rounded-lg hover:border-[#00E676] hover:text-[#00E676] transition-colors"
      >
        {t('affiliate.melbet')}
      </a>

      <p className="text-[#444444] text-[0.65rem] mt-3">{t('affiliate.disclaimer')}</p>
    </aside>
  );
}
