"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  buildContentPostMetadata,
  parseContentPostMetadata,
} from "@/lib/content-post-metadata"
import { uploadBlogThumbnail } from "@/lib/blog-thumbnail"
import { uploadEventPoster } from "@/lib/event-poster"
import { parseIsPinnedFromFormData } from "@/lib/content-post-pin"
import {
  buildEventPostMetadata,
  fromDatetimeLocalValue,
  parseEventPostMetadata,
} from "@/lib/event-metadata"
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

function parseEventMetadataFromFormData(
  formData: FormData,
  existingMetadata?: ReturnType<typeof parseEventPostMetadata>,
) {
  const category = ((formData.get("metadata_category") as string) || "").trim()
  const subcategory = ((formData.get("metadata_subcategory") as string) || "").trim()
  const location = ((formData.get("metadata_location") as string) || "").trim()
  const locationDetail = ((formData.get("metadata_location_detail") as string) || "").trim()
  const cost = ((formData.get("metadata_cost") as string) || "").trim()
  const eventDate = fromDatetimeLocalValue(
    (formData.get("metadata_event_date") as string) || "",
  )
  const eventEndDate = fromDatetimeLocalValue(
    (formData.get("metadata_event_end_date") as string) || "",
  )
  const registrationStart = fromDatetimeLocalValue(
    (formData.get("metadata_registration_start") as string) || "",
  )
  const registrationEnd = fromDatetimeLocalValue(
    (formData.get("metadata_registration_end") as string) || "",
  )
  const featured = formData.get("metadata_featured") === "1"
  const removeDetailImage = formData.get("remove_detail_image") === "1"

  const widthRaw = ((formData.get("detail_image_w") as string) || "").trim()
  const heightRaw = ((formData.get("detail_image_h") as string) || "").trim()
  const parsedWidth = widthRaw ? Number(widthRaw) : NaN
  const parsedHeight = heightRaw ? Number(heightRaw) : NaN

  if (!eventDate) {
    throw new Error("행사 시작 일시를 입력해 주세요.")
  }

  if (!location) {
    throw new Error("행사 장소를 입력해 주세요.")
  }

  return buildEventPostMetadata(
    {
      category: category || undefined,
      subcategory: subcategory || undefined,
      location,
      locationDetail: locationDetail || undefined,
      cost: cost || "무료",
      eventDate,
      eventEndDate,
      registrationStart,
      registrationEnd,
      featured,
      detailImageWidth: removeDetailImage
        ? null
        : Number.isFinite(parsedWidth)
          ? parsedWidth
          : undefined,
      detailImageHeight: removeDetailImage
        ? null
        : Number.isFinite(parsedHeight)
          ? parsedHeight
          : undefined,
    },
    existingMetadata,
  )
}

function contentTypeUsesThumbnail(contentType: ContentType) {
  return contentType === "blog" || contentType === "event"
}

function assertThumbnailRequired(contentType: ContentType, thumbnailUrl: string | null) {
  if (contentType === "event" && !thumbnailUrl) {
    throw new Error("썸네일 이미지를 첨부해 주세요.")
  }
}

function revalidateContentPaths(contentType: ContentType, slug?: string) {
  const adminPath = contentTypeToAdminPath(contentType)
  revalidatePath(adminPath)

  if (
    contentType === "notice" ||
    contentType === "press" ||
    contentType === "blog" ||
    contentType === "event" ||
    contentType === "event_archive"
  ) {
    const publicBase = getPublicPathsForContentType(contentType)
    revalidatePath(publicBase)
    if (slug) {
      revalidatePath(`${publicBase}/${slug}`)
    }
    // sitemap을 콘텐츠 변경 시마다 무효화
    revalidatePath("/sitemap.xml")
  }
}

async function resolveThumbnailUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
  userId: string,
  currentThumbnailUrl?: string | null,
) {
  const removeThumbnail = formData.get("remove_thumbnail") === "1"
  const thumbnailFile = formData.get("thumbnail")

  if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
    return uploadBlogThumbnail(supabase, thumbnailFile, userId)
  }

  if (removeThumbnail) {
    return null
  }

  const existing = ((formData.get("existing_thumbnail_url") as string) || "").trim()
  return existing || currentThumbnailUrl || null
}

async function resolveDetailImageUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
  userId: string,
  currentDetailImageUrl?: string | null,
) {
  const removeDetail = formData.get("remove_detail_image") === "1"
  const detailFile = formData.get("detail_image")

  if (detailFile instanceof File && detailFile.size > 0) {
    return uploadEventPoster(supabase, detailFile, userId)
  }

  if (removeDetail) {
    return null
  }

  const existing = ((formData.get("existing_detail_image_url") as string) || "").trim()
  return existing || currentDetailImageUrl || null
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
  const isPinned = parseIsPinnedFromFormData(formData)
  const metadata =
    contentType === "event"
      ? parseEventMetadataFromFormData(formData)
      : parseMetadataFromFormData(formData)
  const thumbnailUrl = contentTypeUsesThumbnail(contentType)
    ? await resolveThumbnailUrl(supabase, formData, user.id)
    : null

  const detailImageUrl =
    contentType === "event"
      ? await resolveDetailImageUrl(supabase, formData, user.id)
      : null

  assertThumbnailRequired(contentType, thumbnailUrl)

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
    thumbnail_url: thumbnailUrl,
    detail_image_url: detailImageUrl,
    is_pinned: isPinned,
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
    .select("status, published_at, metadata, slug, thumbnail_url, detail_image_url")
    .eq("id", id)
    .single()

  const publishedAt =
    status === "published" && current?.status !== "published"
      ? new Date().toISOString()
      : current?.published_at ?? null

  const metadata =
    contentType === "event"
      ? parseEventMetadataFromFormData(
          formData,
          parseEventPostMetadata(current?.metadata ?? null),
        )
      : parseMetadataFromFormData(
          formData,
          parseContentPostMetadata(current?.metadata ?? null),
        )
  const isPinned = parseIsPinnedFromFormData(formData)

  const thumbnailUrl = contentTypeUsesThumbnail(contentType)
    ? await resolveThumbnailUrl(supabase, formData, user.id, current?.thumbnail_url)
    : current?.thumbnail_url ?? null

  const detailImageUrl =
    contentType === "event"
      ? await resolveDetailImageUrl(supabase, formData, user.id, current?.detail_image_url)
      : current?.detail_image_url ?? null

  assertThumbnailRequired(contentType, thumbnailUrl)

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
      thumbnail_url: thumbnailUrl,
      detail_image_url: detailImageUrl,
      is_pinned: isPinned,
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
    resource: "/admin",
    blog: "/admin/blog",
  }
  return map[contentType]
}
