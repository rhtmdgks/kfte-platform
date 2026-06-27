import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kfte.kr'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // trailing slash = 해당 경로 + 하위 전체 차단
        // 비-trailing-slash = 정확한 경로(redirect 없는 경우) 차단
        disallow: [
          '/admin/',
          '/admin',
          '/login/',
          '/login',
          '/signup/',
          '/signup',
          '/kfte-os/',
          '/kfte-os',
          '/partner/',
          '/partner',
          '/auth/',
          '/auth',
          '/api/',
        ],
      },
      // AI 검색 크롤러 명시 허용 — ChatGPT·Claude·Perplexity 검색 색인
      { userAgent: 'GPTBot', allow: ['/'] },
      { userAgent: 'OAI-SearchBot', allow: ['/'] },
      { userAgent: 'ChatGPT-User', allow: ['/'] },
      { userAgent: 'ClaudeBot', allow: ['/'] },
      { userAgent: 'PerplexityBot', allow: ['/'] },
      // AI 학습(training) 크롤러 차단 — 검색 색인과 별개
      { userAgent: 'Google-Extended', disallow: ['/'] },
      { userAgent: 'Bytespider', disallow: ['/'] },
      { userAgent: 'CCBot', disallow: ['/'] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
