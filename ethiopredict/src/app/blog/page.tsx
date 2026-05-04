import BlogCard from '@/components/blog/BlogCard';
import AffiliateBanner from '@/components/shared/AffiliateBanner';
import { blogPosts } from '@/data/blog';
import { affiliates } from '@/config/affiliates';

export const metadata = {
  title: 'Analysis | EthioPredict',
  description: 'In-depth football analysis, match previews, and betting insights in Amharic and English.',
};

export default function BlogPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-[#f0f0f0] tracking-widest mb-2">
        Football <span className="text-[#00E676]">Analysis</span>
      </h1>
      <p className="text-[#666666] text-sm mb-8">
        In-depth match previews, team form, and betting insights — in Amharic &amp; English
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      <AffiliateBanner config={affiliates} />
    </section>
  );
}
