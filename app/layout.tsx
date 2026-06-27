import React from "react"
import type { Metadata, Viewport } from 'next'

import { SiteChrome } from '@/components/site-chrome'
import { paperlogy } from '@/lib/fonts'

import './globals.css'

export const metadata: Metadata = {
  title: '한국기술창업진흥재단(KFTE) — 청소년·청년 기술창업 생태계',
  description:
    'KFTE는 청소년과 청년이 기술로 창업하고, 연결되고, 성장하도록 돕는 민간 중심 기술창업 생태계 재단입니다.',
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
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
