'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import type { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const { lang } = useLanguage();
  const title   = lang === 'am' ? post.titleAm   : post.titleEn;
  const excerpt = lang === 'am' ? post.excerptAm : post.excerptEn;

  const hasLogos = post.homeLogoUrl || post.awayLogoUrl;

  return (
    <Link href={`/blog/${post.id}`}>
      <article className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden hover:border-[#00E676] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full flex flex-col">

        {/* Thumbnail — team logos or gradient fallback */}
        {hasLogos ? (
          <div className={`h-36 flex items-center justify-center gap-6 bg-gradient-to-br ${post.thumbClass}`}>
            {post.homeLogoUrl && (
              <div className="w-14 h-14 relative drop-shadow-lg">
                <Image
                  src={post.homeLogoUrl}
                  alt={post.homeTeam ?? ''}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <span className="font-[family-name:var(--font-bebas)] text-2xl text-white/40">VS</span>
            {post.awayLogoUrl && (
              <div className="w-14 h-14 relative drop-shadow-lg">
                <Image
                  src={post.awayLogoUrl}
                  alt={post.awayTeam ?? ''}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>
        ) : (
          <div className={`h-36 flex items-center justify-center text-5xl bg-gradient-to-br ${post.thumbClass}`}>
            {post.thumbEmoji}
          </div>
        )}

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-[#00E676] text-[0.65rem] font-extrabold uppercase tracking-widest mb-2">
            {post.tag}
          </p>
          <h3 className="text-[#f0f0f0] font-bold text-sm leading-snug mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-[#666666] text-xs leading-relaxed mb-3 line-clamp-3 flex-1">
            {excerpt}
          </p>
          <div className="flex justify-between text-[#444444] text-[0.65rem]">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </div>

      </article>
    </Link>
  );
}
