"use server"

import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  deleteEventBanner,
  saveEventBanner,
  type EventBanner,
} from "@/lib/event-banners"
import { fromDatetimeLocalValue } from "@/lib/event-metadata"

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (!isAdmin) throw new Error("Forbidden")

  return user
}

function parseBannerForm(formData: FormData, id: string, createdAt?: string): EventBanner {
  const title = ((formData.get("title") as string) || "").trim()
  const description = ((formData.get("description") as string) || "").trim()
  const imageUrl = ((formData.get("image_url") as string) || "").trim()
  const existingImageUrl = ((formData.get("existing_image_url") as string) || "").trim()
  const linkUrl = ((formData.get("link_url") as string) || "").trim()
  const metaText = ((formData.get("meta_text") as string) || "").trim()
  const sortOrderRaw = ((formData.get("sort_order") as string) || "0").trim()
  const sortOrder = Number(sortOrderRaw)
  const isActive = formData.get("is_active") === "1"
  const startsAt = fromDatetimeLocalValue((formData.get("starts_at") as string) || "") ?? null
  const endsAt = fromDatetimeLocalValue((formData.get("ends_at") as string) || "") ?? null

  return {
    id,
    title,
    description,
    imageUrl: imageUrl || existingImageUrl,
    linkUrl,
    metaText,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    isActive,
    startsAt,
    endsAt,
    createdAt: createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function revalidateBannerPaths() {
  revalidatePath("/admin/event-banners")
  revalidatePath("/activities/events")
}

export async function createEventBanner(formData: FormData) {
  await requireAdmin()
  const banner = parseBannerForm(formData, randomUUID())
  await saveEventBanner(banner)
  revalidateBannerPaths()
  redirect("/admin/event-banners")
}

export async function updateEventBanner(id: string, formData: FormData) {
  await requireAdmin()
  const createdAt = ((formData.get("created_at") as string) || "").trim() || undefined
  const banner = parseBannerForm(formData, id, createdAt)
  await saveEventBanner(banner)
  revalidateBannerPaths()
  redirect("/admin/event-banners")
}

export async function removeEventBanner(id: string) {
  await requireAdmin()
  await deleteEventBanner(id)
  revalidateBannerPaths()
}
