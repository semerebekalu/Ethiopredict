import PredictionList from '@/components/predictions/PredictionList';
import AffiliateBanner from '@/components/shared/AffiliateBanner';
import { predictions } from '@/data/predictions';
import { affiliates } from '@/config/affiliates';

export const metadata = {
  title: 'Predictions | EthioPredict',
  description: 'Daily football predictions with confidence ratings for EPL, UCL, Ethiopian Premier League and more.',
};

export default function PredictionsPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-[#f0f0f0] tracking-widest mb-2">
        Today&apos;s <span className="text-[#00E676]">Predictions</span>
      </h1>
      <p className="text-[#666666] text-sm mb-8">
        Expert tips with confidence ratings. Updated daily.
      </p>

      <PredictionList predictions={predictions} />

      <div className="mt-10">
        <AffiliateBanner config={affiliates} />
      </div>
    </section>
  );
}
