import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

// 반드시 NEXT_PUBLIC_SITE_URL=https://kfte.kr 설정 필요.
// localhost / vercel.app URL은 절대 포함하지 않는다.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kfte.kr'

// priority / changefreq 제외 — Google이 무시하는 필드
// noindex 페이지(/activities/programs, /members/interviews) 제외
// /privacy, /terms 포함
const staticRoutes: MetadataRoute.Sitemap = [
  { url: siteUrl, lastModified: new Date() },
  { url: `${siteUrl}/about` },
  { url: `${siteUrl}/about/what-we-do` },
  { url: `${siteUrl}/about/manifesto` },
  { url: `${siteUrl}/about/bylaws` },
  { url: `${siteUrl}/about/partners` },
  { url: `${siteUrl}/about/location` },
  { url: `${siteUrl}/about/ci` },
  { url: `${siteUrl}/activities/events` },
  { url: `${siteUrl}/activities/events/archive` },
  { url: `${siteUrl}/members` },
  { url: `${siteUrl}/members/join` },
  { url: `${siteUrl}/members/benefits` },
  { url: `${siteUrl}/news/notices` },
  { url: `${siteUrl}/news/press` },
  { url: `${siteUrl}/news/blog` },
  { url: `${siteUrl}/privacy` },
  { url: `${siteUrl}/terms` },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const [
    { data: notices },
    { data: press },
    { data: blogs },
    { data: events },
    { data: archives },
  ] = await Promise.all([
    supabase
      .from('content_posts')
      .select('slug, updated_at, published_at')
      .eq('content_type', 'notice')
      .eq('status', 'published'),
    supabase
      .from('content_posts')
      .select('slug, updated_at, published_at')
      .eq('content_type', 'press')
      .eq('status', 'published'),
    supabase
      .from('content_posts')
      .select('slug, updated_at, published_at')
      .eq('content_type', 'blog')
      .eq('status', 'published'),
    supabase
      .from('content_posts')
      .select('slug, updated_at, published_at')
      .eq('content_type', 'event')
      .eq('status', 'published'),
    supabase
      .from('content_posts')
      .select('slug, updated_at, published_at')
      .eq('content_type', 'event_archive')
      .eq('status', 'published'),
  ])

  function toEntries(
    rows: { slug: string; updated_at: string; published_at: string | null }[] | null,
    basePath: string,
  ): MetadataRoute.Sitemap {
    return (rows ?? []).map((row) => ({
      url: `${siteUrl}${basePath}/${row.slug}`,
      lastModified: new Date(row.updated_at ?? row.published_at ?? new Date()),
    }))
  }

  return [
    ...staticRoutes,
    ...toEntries(notices, '/news/notices'),
    ...toEntries(press, '/news/press'),
    ...toEntries(blogs, '/news/blog'),
    ...toEntries(events, '/activities/events'),
    ...toEntries(archives, '/activities/events/archive'),
  ]
}
