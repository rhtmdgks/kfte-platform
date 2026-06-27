"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

type ContentType = Database["public"]["Enums"]["content_type"]
type PostStatus = Database["public"]["Enums"]["post_status"]

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const contentType = formData.get("content_type") as ContentType
  const summary = (formData.get("summary") as string) || null
  const body = (formData.get("body") as string) || null
  const status = (formData.get("status") as PostStatus) || "draft"
  const externalUrl = (formData.get("external_url") as string) || null
  const publishedAt = status === "published" ? new Date().toISOString() : null

  // slug 중복 처리
  let slug = slugify(title) || `post-${Date.now()}`
  const { data: existing } = await supabase
    .from("content_posts")
    .select("slug")
    .eq("content_type", contentType)
    .eq("slug", slug)
    .single()

  if (existing) slug = `${slug}-${Date.now()}`

  const { error } = await supabase.from("content_posts").insert({
    title,
    slug,
    content_type: contentType,
    summary,
    body,
    status,
    external_url: externalUrl,
    published_at: publishedAt,
    author_id: user.id,
  })

  if (error) throw new Error(error.message)

  const adminPath = contentTypeToAdminPath(contentType)
  revalidatePath(adminPath)
  redirect(adminPath)
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const contentType = formData.get("content_type") as ContentType
  const summary = (formData.get("summary") as string) || null
  const body = (formData.get("body") as string) || null
  const status = (formData.get("status") as PostStatus) || "draft"
  const externalUrl = (formData.get("external_url") as string) || null

  const { data: current } = await supabase
    .from("content_posts")
    .select("status, published_at")
    .eq("id", id)
    .single()

  const publishedAt =
    status === "published" && current?.status !== "published"
      ? new Date().toISOString()
      : current?.published_at ?? null

  const { error } = await supabase
    .from("content_posts")
    .update({
      title,
      content_type: contentType,
      summary,
      body,
      status,
      external_url: externalUrl,
      published_at: publishedAt,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)

  const adminPath = contentTypeToAdminPath(contentType)
  revalidatePath(adminPath)
  redirect(adminPath)
}

export async function deletePost(id: string, contentType: ContentType) {
  const supabase = await createClient()
  const { error } = await supabase.from("content_posts").delete().eq("id", id)
  if (error) throw new Error(error.message)

  const adminPath = contentTypeToAdminPath(contentType)
  revalidatePath(adminPath)
}

function contentTypeToAdminPath(contentType: ContentType): string {
  const map: Record<ContentType, string> = {
    notice: "/admin/notices",
    press: "/admin/press",
    event: "/admin/events",
    event_archive: "/admin/event-archives",
    resource: "/admin/resources",
    blog: "/admin/blog",
  }
  return map[contentType]
}
