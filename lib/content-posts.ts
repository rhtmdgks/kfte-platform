import { createClient } from "@/lib/supabase/server"
import { parseContentPostMetadata } from "@/lib/content-post-metadata"
import type { NewsPost } from "@/lib/news-types"
import type { Database } from "@/types/database"

type NewsContentType = Extract<
  Database["public"]["Enums"]["content_type"],
  "notice" | "press"
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
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Failed to fetch ${contentType} posts:`, error.message)
    return []
  }

  return (data ?? []).map((row) => mapContentPostToNewsPost(row, contentType))
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
  contentType: NewsContentType,
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

export function getPublicPathsForContentType(contentType: NewsContentType) {
  const map = {
    notice: "/news/notices",
    press: "/news/press",
  } as const

  return map[contentType]
}
