import { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://ethiopredict.vercel.app'
  const blogRoutes = blogPosts.map(post => ({
    url: `${base}/blog/${post.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/predictions`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/standings`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/history`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    ...blogRoutes,
  ]
}
