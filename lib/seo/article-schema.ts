import type { NewsPost } from '@/lib/news-types'

import { toAbsoluteSiteMediaUrl } from "@/lib/site-media"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kfte.kr"

export function buildNewsArticleSchema(post: NewsPost & { thumbnailUrl?: string | null }, basePath: string) {
  const url = `${siteUrl}${basePath}/${post.id}`
  const datePublished = post.createdAt
  const imageUrl = toAbsoluteSiteMediaUrl(post.thumbnailUrl, siteUrl)
  const images = imageUrl
    ? [{ "@type": "ImageObject", url: imageUrl, width: 1200, height: 630 }]
    : []

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    url,
    datePublished,
    dateModified: datePublished,
    author: {
      '@type': 'Organization',
      name: '한국기술창업진흥재단(KFTE)',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: '한국기술창업진흥재단(KFTE)',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/og-default.jpg` },
    },
    image: images,
    description: post.content.slice(0, 160),
    inLanguage: 'ko',
  } as const
}

export function buildBlogPostingSchema(post: NewsPost, basePath: string) {
  const base = buildNewsArticleSchema(post, basePath)
  return { ...base, '@type': 'BlogPosting' } as const
}
