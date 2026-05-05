import Hero from '@/components/home/Hero';
import StatsBar from '@/components/home/StatsBar';
import PredictionList from '@/components/predictions/PredictionList';
import MatchList from '@/components/matches/MatchList';
import LiveScoresWidget from '@/components/matches/LiveScoresWidget';
import AffiliateWidget from '@/components/sidebar/AffiliateWidget';
import StandingsWidget from '@/components/standings/StandingsWidget';
import TelegramCard from '@/components/sidebar/TelegramCard';
import { predictions } from '@/data/predictions';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />

      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Live scores widget */}
        <LiveScoresWidget />

        {/* Section heading */}
        <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-widest text-[#f0f0f0] mb-6 flex items-center gap-3">
          Today&apos;s Predictions
          <span className="bg-[#FF1744] text-white text-[0.55rem] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded animate-pulse">
            LIVE
          </span>
          <span className="flex-1 h-px bg-[#222222]" />
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main column */}
          <div className="flex flex-col gap-8">
            <PredictionList predictions={predictions} />
            <MatchList />
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-5">
            <AffiliateWidget />
            <StandingsWidget />
            <TelegramCard />
          </aside>
        </div>
      </section>
    </>
  );
}
