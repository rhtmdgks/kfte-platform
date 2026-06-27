import { site } from '@/lib/kfte-content'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kfte.kr'

/** WebSite — 모든 페이지 root layout에 삽입 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: site.fullName,
  description: site.description,
  publisher: { '@id': `${siteUrl}/#organization` },
  inLanguage: 'ko',
} as const

/** WebPage — 홈페이지 전용 */
export const homepageWebPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/#webpage`,
  url: siteUrl,
  name: `${site.fullName} — 청소년·청년 기술창업 생태계`,
  description: site.description,
  isPartOf: { '@id': `${siteUrl}/#website` },
  about: { '@id': `${siteUrl}/#organization` },
  inLanguage: 'ko',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: site.fullName, item: siteUrl },
    ],
  },
} as const
