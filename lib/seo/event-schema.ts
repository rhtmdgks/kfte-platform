import type { EventPost } from '@/lib/event-types'

import { toAbsoluteSiteMediaUrl } from "@/lib/site-media"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kfte.kr"

export function buildEventSchema(post: EventPost, basePath: string, isArchive = false) {
  const url = `${siteUrl}${basePath}/${post.id}`
  const imageUrl = toAbsoluteSiteMediaUrl(post.thumbnailUrl, siteUrl)

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: post.title,
    url,
    description: post.summary || post.content.slice(0, 160),
    startDate: post.eventDate,
    ...(post.eventEndDate ? { endDate: post.eventEndDate } : {}),
    eventStatus: isArchive
      ? 'https://schema.org/EventScheduled'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: post.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: post.location,
        addressCountry: 'KR',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: '한국기술창업진흥재단(KFTE)',
      url: siteUrl,
    },
    ...(imageUrl
      ? {
          image: {
            "@type": "ImageObject" as const,
            url: imageUrl,
            width: 1200,
            height: 630,
          },
        }
      : {}),
    ...(post.cost === '무료' || !post.cost
      ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW', availability: 'https://schema.org/InStock' } }
      : {}),
    inLanguage: 'ko',
  } as const
}
