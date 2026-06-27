import React from "react"
import type { Metadata, Viewport } from 'next'

import { SiteChrome } from '@/components/site-chrome'
import { paperlogy } from '@/lib/fonts'
import { JsonLd } from '@/components/seo/json-ld'
import { organizationSchema } from '@/lib/seo/organization-schema'
import { websiteSchema } from '@/lib/seo/website-schema'

import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kfte.kr'

const defaultOgImage = {
  url: '/og-default.jpg',
  width: 1200,
  height: 630,
  alt: '한국기술창업진흥재단(KFTE) — 청소년·청년 기술창업 생태계',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '한국기술창업진흥재단(KFTE) — 청소년·청년 기술창업 생태계',
    template: '%s | KFTE',
  },
  description:
    '한국기술창업진흥재단(KFTE)은 청소년과 청년이 기술로 창업에 도전할 수 있도록 교육·멘토링·네트워크·커뮤니티를 운영하는 민간 비영리 기술창업 생태계 재단입니다.',
  openGraph: {
    siteName: '한국기술창업진흥재단(KFTE)',
    locale: 'ko_KR',
    type: 'website',
    images: [defaultOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@kfte_official',
    images: ['/og-default.jpg'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  icons: {
    icon: '/icon.svg',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [{ rel: 'icon', url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#002065',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={paperlogy.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
