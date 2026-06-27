"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  buildContentPostMetadata,
  parseContentPostMetadata,
} from "@/lib/content-post-metadata"
import { getPublicPathsForContentType } from "@/lib/content-posts"
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

function parseMetadataFromFormData(
  formData: FormData,
  existingMetadata?: ReturnType<typeof parseContentPostMetadata>,
) {
  const author = ((formData.get("metadata_author") as string) || "").trim()
  const category = ((formData.get("metadata_category") as string) || "").trim()
  const attachmentUrl = ((formData.get("metadata_attachment_url") as string) || "").trim()
  const attachmentName = ((formData.get("metadata_attachment_name") as string) || "").trim()

  return buildContentPostMetadata(
    {
      author: author || undefined,
      category: category || undefined,
      attachmentUrl: attachmentUrl || undefined,
      attachmentName: attachmentName || undefined,
    },
    existingMetadata,
  )
}

function revalidateContentPaths(contentType: ContentType, slug?: string) {
  const adminPath = contentTypeToAdminPath(contentType)
  revalidatePath(adminPath)

  if (contentType === "notice" || contentType === "press") {
    const publicBase = getPublicPathsForContentType(contentType)
    revalidatePath(publicBase)
    if (slug) {
      revalidatePath(`${publicBase}/${slug}`)
    }
  }
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
  const metadata = parseMetadataFromFormData(formData)

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
    metadata,
  })

  if (error) throw new Error(error.message)

  revalidateContentPaths(contentType, slug)
  redirect(contentTypeToAdminPath(contentType))
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
    .select("status, published_at, metadata, slug")
    .eq("id", id)
    .single()

  const publishedAt =
    status === "published" && current?.status !== "published"
      ? new Date().toISOString()
      : current?.published_at ?? null

  const metadata = parseMetadataFromFormData(
    formData,
    parseContentPostMetadata(current?.metadata ?? null),
  )

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
      metadata,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidateContentPaths(contentType, current?.slug)
  redirect(contentTypeToAdminPath(contentType))
}

export async function deletePost(id: string, contentType: ContentType) {
  const supabase = await createClient()

  const { data: current } = await supabase
    .from("content_posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle()

  const { error } = await supabase.from("content_posts").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidateContentPaths(contentType, current?.slug ?? undefined)
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
