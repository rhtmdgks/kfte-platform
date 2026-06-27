/**
 * Supabase content_posts 시드
 * npx tsx scripts/seed-news-posts.ts
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { createClient } from "@supabase/supabase-js"
import { blogSeedPosts, noticesSeedPosts, pressSeedPosts } from "../lib/news-seed-data"
import { eventsSeedPosts } from "../lib/events-content"
import { eventArchivesSeedPosts } from "../lib/event-archive-content"

function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), ".env.local")
    const content = readFileSync(envPath, "utf8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eq = trimmed.indexOf("=")
      if (eq === -1) continue
      const key = trimmed.slice(0, eq)
      const value = trimmed.slice(eq + 1)
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // ignore
  }
}

loadEnvFile()

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local")
    process.exit(1)
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: profile } = await supabase.from("profiles").select("id").limit(1).single()
  const authorId = profile?.id ?? null

  for (const post of noticesSeedPosts) {
    const { error } = await supabase.from("content_posts").upsert(
      {
        title: post.title,
        slug: post.slug,
        content_type: "notice",
        body: post.content,
        status: "published",
        published_at: post.createdAt,
        created_at: post.createdAt,
        author_id: authorId,
        metadata: {
          author: post.author,
          category: post.category,
          views: post.views,
          attachmentUrl: post.attachmentUrl,
          attachmentName: post.attachmentName,
        },
      },
      { onConflict: "content_type,slug" },
    )
    if (error) console.error("notice", post.slug, error.message)
    else console.log("Seeded notice:", post.slug)
  }

  for (const post of pressSeedPosts) {
    const { error } = await supabase.from("content_posts").upsert(
      {
        title: post.title,
        slug: post.slug,
        content_type: "press",
        body: post.content,
        status: "published",
        published_at: post.createdAt,
        created_at: post.createdAt,
        author_id: authorId,
        external_url: post.externalUrl ?? null,
        metadata: {
          author: post.author,
          category: post.category,
          views: post.views,
        },
      },
      { onConflict: "content_type,slug" },
    )
    if (error) console.error("press", post.slug, error.message)
    else console.log("Seeded press:", post.slug)
  }

  for (const post of blogSeedPosts) {
    const { error } = await supabase.from("content_posts").upsert(
      {
        title: post.title,
        slug: post.slug,
        content_type: "blog",
        summary: post.summary,
        body: post.content,
        status: "published",
        published_at: post.createdAt,
        created_at: post.createdAt,
        author_id: authorId,
        thumbnail_url: post.thumbnailUrl ?? null,
        metadata: {
          author: post.author,
          category: post.category,
          views: post.views,
        },
      },
      { onConflict: "content_type,slug" },
    )
    if (error) console.error("blog", post.slug, error.message)
    else console.log("Seeded blog:", post.slug)
  }

  for (const post of eventsSeedPosts) {
    const { error } = await supabase.from("content_posts").upsert(
      {
        title: post.title,
        slug: post.slug,
        content_type: "event",
        summary: post.summary,
        body: post.content,
        status: "published",
        published_at: post.eventDate,
        created_at: post.eventDate,
        author_id: authorId,
        external_url: post.registrationUrl ?? null,
        metadata: {
          category: post.category,
          views: post.views,
          eventDate: post.eventDate,
          eventEndDate: post.eventEndDate,
          location: post.location,
          locationDetail: post.locationDetail,
          cost: post.cost,
          registrationStart: post.registrationStart,
          registrationEnd: post.registrationEnd,
          subcategory: post.subcategory,
          featured: "featured" in post ? post.featured : undefined,
        },
      },
      { onConflict: "content_type,slug" },
    )
    if (error) console.error("event", post.slug, error.message)
    else console.log("Seeded event:", post.slug)
  }

  for (const post of eventArchivesSeedPosts) {
    const { error } = await supabase.from("content_posts").upsert(
      {
        title: post.title,
        slug: post.slug,
        content_type: "event_archive",
        summary: post.summary,
        body: post.content,
        status: "published",
        published_at: post.eventDate,
        created_at: post.eventDate,
        author_id: authorId,
        metadata: {
          category: post.category,
          views: post.views,
          eventDate: post.eventDate,
          eventEndDate: post.eventEndDate,
          location: post.location,
          locationDetail: post.locationDetail,
          subcategory: post.subcategory,
        },
      },
      { onConflict: "content_type,slug" },
    )
    if (error) console.error("event_archive", post.slug, error.message)
    else console.log("Seeded event archive:", post.slug)
  }
}

main()
