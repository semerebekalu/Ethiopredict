import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AffiliateBanner from '@/components/shared/AffiliateBanner';
import ShareButtons from '@/components/shared/ShareButtons';
import { blogPosts } from '@/data/blog';
import { affiliates } from '@/config/affiliates';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);
  if (!post) return {};
  return {
    title: `${post.titleEn} | EthioPredict`,
    description: post.excerptEn,
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);
  if (!post) notFound();

  // Render body — split on double newlines into paragraphs
  const paragraphs = post.bodyEn
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="max-w-2xl mx-auto px-4 py-10">

      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-[#666666] text-sm hover:text-[#00E676] transition-colors mb-8"
      >
        ← Back to Analysis
      </Link>

      {/* Team logos header */}
      {(post.homeLogoUrl || post.awayLogoUrl) ? (
        <div className="flex items-center justify-center gap-6 mb-6">
          {post.homeLogoUrl && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 relative">
                <Image
                  src={post.homeLogoUrl}
                  alt={post.homeTeam ?? ''}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-[#f0f0f0] text-xs font-bold">{post.homeTeam}</span>
            </div>
          )}
          <span className="font-[family-name:var(--font-bebas)] text-3xl text-[#333333]">VS</span>
          {post.awayLogoUrl && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 relative">
                <Image
                  src={post.awayLogoUrl}
                  alt={post.awayTeam ?? ''}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-[#f0f0f0] text-xs font-bold">{post.awayTeam}</span>
            </div>
          )}
        </div>
      ) : (
        /* Fallback gradient thumbnail */
        <div className={`h-48 rounded-xl flex items-center justify-center text-6xl bg-gradient-to-br ${post.thumbClass} mb-6`}>
          {post.thumbEmoji}
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[#00E676] text-[0.65rem] font-extrabold uppercase tracking-widest">
          {post.tag}
        </span>
        <span className="text-[#333333]">·</span>
        <span className="text-[#555555] text-xs">{post.date}</span>
        <span className="text-[#333333]">·</span>
        <span className="text-[#555555] text-xs">{post.readTime}</span>
      </div>

      {/* Title */}
      <h1 className="font-[family-name:var(--font-bebas)] text-3xl sm:text-4xl text-[#f0f0f0] tracking-wide leading-tight mb-4">
        {post.titleEn}
      </h1>

      {/* Excerpt */}
      <p className="text-[#888888] text-base leading-relaxed mb-8 border-l-2 border-[#00E676] pl-4">
        {post.excerptEn}
      </p>

      {/* Body */}
      <div className="prose prose-invert prose-sm max-w-none space-y-4">
        {paragraphs.map((para, i) => (
          <p key={i} className="text-[#aaaaaa] leading-relaxed text-sm">
            {para}
          </p>
        ))}
      </div>

      {/* Affiliate banner */}
      <div className="mt-10">
        <AffiliateBanner config={affiliates} />
      </div>

      {/* Share buttons */}
      <ShareButtons
        title={post.titleEn}
        url={`https://ethiopredict.vercel.app/blog/${post.id}`}
      />
    </article>
  );
}
