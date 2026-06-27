import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kfte.kr'

interface ContentMetaOptions {
  title: string
  description?: string
  slug: string
  basePath: string
  type?: 'article' | 'website'
  thumbnailUrl?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
}

export function buildContentMetadata({
  title,
  description,
  slug,
  basePath,
  type = 'article',
  thumbnailUrl,
}: ContentMetaOptions): Metadata {
  const canonical = `${basePath}/${slug}`
  const resolvedDescription = description ?? `${title} — 한국기술창업진흥재단(KFTE)`
  const images = thumbnailUrl
    ? [{ url: thumbnailUrl, width: 1200, height: 630, alt: title }]
    : [{ url: '/og-default.jpg', width: 1200, height: 630, alt: title }]

  return {
    title,
    description: resolvedDescription,
    alternates: { canonical },
    openGraph: {
      title,
      description: resolvedDescription,
      url: `${siteUrl}${canonical}`,
      type,
      locale: 'ko_KR',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: resolvedDescription,
      images: images.map((img) => img.url),
    },
  }
}
