import { site, footer } from '@/lib/kfte-content'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kfte.kr'

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'NGO'],
  '@id': `${siteUrl}/#organization`,
  name: site.name,
  alternateName: site.nameEn,
  url: siteUrl,
  logo: {
    '@type': 'ImageObject',
    '@id': `${siteUrl}/#logo`,
    url: `${siteUrl}/og-default.jpg`,
    contentUrl: `${siteUrl}/og-default.jpg`,
    width: 1200,
    height: 630,
    caption: site.fullName,
  },
  image: `${siteUrl}/og-default.jpg`,
  description: site.description,
  email: site.email,
  telephone: site.phone,
  faxNumber: site.fax,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '테헤란로 128 2층 126호 (역삼동, 성곡빌딩)',
    addressLocality: '강남구',
    addressRegion: '서울특별시',
    addressCountry: 'KR',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: site.phone,
    email: site.email,
    contactType: 'customer service',
    availableLanguage: 'Korean',
    areaServed: 'KR',
  },
  sameAs: footer.social.map((s) => s.href),
} as const
