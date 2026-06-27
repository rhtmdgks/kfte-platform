import { createClient } from "@/lib/supabase/server"
import { parseContentPostMetadata } from "@/lib/content-post-metadata"
import { sortByPinnedThenDate } from "@/lib/content-post-pin"
import { parseEventPostMetadata } from "@/lib/event-metadata"
import type { EventPost } from "@/lib/event-types"
import type { BlogPost } from "@/lib/blog-types"
import type { NewsPost } from "@/lib/news-types"
import type { Database } from "@/types/database"

type NewsContentType = Extract<
  Database["public"]["Enums"]["content_type"],
  "notice" | "press"
>
type BlogContentType = Extract<
  Database["public"]["Enums"]["content_type"],
  "blog"
>
type EventContentType = Extract<
  Database["public"]["Enums"]["content_type"],
  "event"
>
type EventArchiveContentType = Extract<
  Database["public"]["Enums"]["content_type"],
  "event_archive"
>
type ContentPostRow = Database["public"]["Tables"]["content_posts"]["Row"]

const DEFAULT_CATEGORY: Record<NewsContentType, string> = {
  notice: "아티클",
  press: "보도자료",
}

const DEFAULT_AUTHOR: Record<NewsContentType, string> = {
  notice: "KFTE",
  press: "KFTE",
}

export function mapContentPostToNewsPost(
  row: ContentPostRow,
  contentType: NewsContentType,
): NewsPost {
  const meta = parseContentPostMetadata(row.metadata)

  return {
    id: row.slug,
    title: row.title,
    content: row.body ?? row.summary ?? "",
    author: meta.author ?? DEFAULT_AUTHOR[contentType],
    category: (meta.category ?? DEFAULT_CATEGORY[contentType]) as NewsPost["category"],
    createdAt: row.published_at ?? row.created_at,
    views: meta.views ?? 0,
    attachmentUrl: meta.attachmentUrl,
    attachmentName: meta.attachmentName,
    externalUrl: row.external_url ?? undefined,
    pinned: row.is_pinned,
  }
}

export async function getPublishedNewsPosts(
  contentType: NewsContentType,
): Promise<NewsPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_posts")
    .select("*")
    .eq("content_type", contentType)
    .eq("status", "published")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Failed to fetch ${contentType} posts:`, error.message)
    return []
  }

  return sortByPinnedThenDate(
    (data ?? []).map((row) => mapContentPostToNewsPost(row, contentType)),
  )
}

export async function getPublishedNewsPostBySlug(
  contentType: NewsContentType,
  slug: string,
): Promise<NewsPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_posts")
    .select("*")
    .eq("content_type", contentType)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return mapContentPostToNewsPost(data, contentType)
}

export async function recordContentPostView(
  contentType:
    | NewsContentType
    | BlogContentType
    | EventContentType
    | EventArchiveContentType,
  slug: string,
): Promise<number> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("record_content_post_view", {
    p_slug: slug,
    p_content_type: contentType,
  })

  if (error) {
    console.error("Failed to record view:", error.message)
    return 0
  }

  return data ?? 0
}

export async function getPublishedNewsPostWithView(
  contentType: NewsContentType,
  slug: string,
): Promise<NewsPost | null> {
  const views = await recordContentPostView(contentType, slug)
  const post = await getPublishedNewsPostBySlug(contentType, slug)

  if (!post) {
    return null
  }

  if (views > 0) {
    return { ...post, views }
  }

  return post
}

export function mapContentPostToBlogPost(row: ContentPostRow): BlogPost {
  const meta = parseContentPostMetadata(row.metadata)

  return {
    id: row.slug,
    title: row.title,
    summary: row.summary ?? row.body?.slice(0, 160) ?? "",
    content: row.body ?? row.summary ?? "",
    author: meta.author ?? "KFTE",
    category: meta.category ?? "아티클",
    createdAt: row.published_at ?? row.created_at,
    views: meta.views ?? 0,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    pinned: row.is_pinned,
  }
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_posts")
    .select("*")
    .eq("content_type", "blog")
    .eq("status", "published")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch blog posts:", error.message)
    return []
  }

  return sortByPinnedThenDate((data ?? []).map(mapContentPostToBlogPost))
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_posts")
    .select("*")
    .eq("content_type", "blog")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return mapContentPostToBlogPost(data)
}

export async function getPublishedBlogPostWithView(slug: string): Promise<BlogPost | null> {
  const views = await recordContentPostView("blog", slug)
  const post = await getPublishedBlogPostBySlug(slug)

  if (!post) {
    return null
  }

  if (views > 0) {
    return { ...post, views }
  }

  return post
}

function sortEventsByFeaturedThenDate(posts: EventPost[]) {
  return [...posts].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1
    }
    if (Boolean(a.pinned) !== Boolean(b.pinned)) {
      return a.pinned ? -1 : 1
    }
    return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  })
}

export function mapContentPostToEventPost(row: ContentPostRow): EventPost {
  const meta = parseEventPostMetadata(row.metadata)
  const eventDate = meta.eventDate ?? row.published_at ?? row.created_at

  return {
    id: row.slug,
    title: row.title,
    summary: row.summary ?? row.body?.slice(0, 160) ?? "",
    content: row.body ?? row.summary ?? "",
    category: meta.category ?? "프로그램",
    subcategory: meta.subcategory,
    eventDate,
    eventEndDate: meta.eventEndDate,
    location: meta.location ?? "추후 공지",
    locationDetail: meta.locationDetail,
    cost: meta.cost ?? "무료",
    registrationUrl: row.external_url ?? undefined,
    registrationStart: meta.registrationStart,
    registrationEnd: meta.registrationEnd,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    pinned: row.is_pinned,
    featured: meta.featured,
    views: meta.views ?? 0,
  }
}

export async function getPublishedEvents(): Promise<EventPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_posts")
    .select("*")
    .eq("content_type", "event")
    .eq("status", "published")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })

  if (error) {
    console.error("Failed to fetch events:", error.message)
    return []
  }

  return sortEventsByFeaturedThenDate((data ?? []).map(mapContentPostToEventPost))
}

export async function getPublishedEventBySlug(slug: string): Promise<EventPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_posts")
    .select("*")
    .eq("content_type", "event")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return mapContentPostToEventPost(data)
}

export async function getPublishedEventWithView(slug: string): Promise<EventPost | null> {
  const views = await recordContentPostView("event", slug)
  const post = await getPublishedEventBySlug(slug)

  if (!post) {
    return null
  }

  if (views > 0) {
    return { ...post, views }
  }

  return post
}

export const mapContentPostToEventArchivePost = mapContentPostToEventPost

export async function getPublishedEventArchives(): Promise<EventPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_posts")
    .select("*")
    .eq("content_type", "event_archive")
    .eq("status", "published")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })

  if (error) {
    console.error("Failed to fetch event archives:", error.message)
    return []
  }

  return (data ?? [])
    .map(mapContentPostToEventArchivePost)
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
}

export async function getPublishedEventArchiveBySlug(slug: string): Promise<EventPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_posts")
    .select("*")
    .eq("content_type", "event_archive")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return mapContentPostToEventArchivePost(data)
}

export async function getPublishedEventArchiveWithView(slug: string): Promise<EventPost | null> {
  const views = await recordContentPostView("event_archive", slug)
  const post = await getPublishedEventArchiveBySlug(slug)

  if (!post) {
    return null
  }

  if (views > 0) {
    return { ...post, views }
  }

  return post
}

export function getPublicPathsForContentType(
  contentType:
    | NewsContentType
    | BlogContentType
    | EventContentType
    | EventArchiveContentType,
) {
  const map = {
    notice: "/news/notices",
    press: "/news/press",
    blog: "/news/blog",
    event: "/activities/events",
    event_archive: "/activities/events/archive",
  } as const

  return map[contentType]
}
