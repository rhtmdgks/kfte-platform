import { createAdminClient } from "@/lib/supabase/admin"
import { getSupabasePublicEnv, isSupabaseConfigured } from "@/lib/supabase/config"

export type EventBanner = {
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  metaText: string
  sortOrder: number
  isActive: boolean
  startsAt: string | null
  endsAt: string | null
  createdAt: string
  updatedAt: string
}

type EventBannerManifest = {
  version: 1
  banners: EventBanner[]
}

const BUCKET = "event-banners"
const MANIFEST_PATH = "_manifest.json"

const emptyManifest = (): EventBannerManifest => ({
  version: 1,
  banners: [],
})

function isBannerActiveNow(banner: EventBanner, now = Date.now()) {
  if (!banner.isActive) return false
  if (banner.startsAt) {
    const start = new Date(banner.startsAt).getTime()
    if (!Number.isNaN(start) && now < start) return false
  }
  if (banner.endsAt) {
    const end = new Date(banner.endsAt).getTime()
    if (!Number.isNaN(end) && now > end) return false
  }
  return Boolean(banner.imageUrl?.trim() && banner.title?.trim())
}

function sortBanners(banners: EventBanner[]) {
  return [...banners].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

function normalizeManifest(raw: unknown): EventBannerManifest {
  const parsed = raw as EventBannerManifest
  if (!parsed || !Array.isArray(parsed.banners)) return emptyManifest()
  return {
    version: 1,
    banners: parsed.banners.map((banner) => ({
      id: String(banner.id),
      title: String(banner.title ?? ""),
      description: String(banner.description ?? ""),
      imageUrl: String(banner.imageUrl ?? ""),
      linkUrl: String(banner.linkUrl ?? ""),
      metaText: String(banner.metaText ?? ""),
      sortOrder: Number(banner.sortOrder) || 0,
      isActive: Boolean(banner.isActive),
      startsAt: banner.startsAt ?? null,
      endsAt: banner.endsAt ?? null,
      createdAt: String(banner.createdAt ?? new Date().toISOString()),
      updatedAt: String(banner.updatedAt ?? new Date().toISOString()),
    })),
  }
}

async function downloadManifest(): Promise<EventBannerManifest> {
  const env = getSupabasePublicEnv()
  if (!env) return emptyManifest()

  try {
    const publicUrl = `${env.url}/storage/v1/object/public/${BUCKET}/${MANIFEST_PATH}`
    const response = await fetch(publicUrl, { cache: "no-store" })
    if (response.ok) {
      return normalizeManifest(await response.json())
    }
  } catch {
    // fall through to admin download
  }

  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return emptyManifest()
  }

  try {
    const admin = createAdminClient()
    const { data, error } = await admin.storage.from(BUCKET).download(MANIFEST_PATH)
    if (error || !data) return emptyManifest()
    return normalizeManifest(JSON.parse(await data.text()))
  } catch {
    return emptyManifest()
  }
}

async function uploadManifest(manifest: EventBannerManifest) {
  const admin = createAdminClient()
  const body = JSON.stringify({ version: 1, banners: sortBanners(manifest.banners) }, null, 2)
  const { error } = await admin.storage.from(BUCKET).upload(MANIFEST_PATH, body, {
    contentType: "application/json",
    upsert: true,
    cacheControl: "0",
  })
  if (error) {
    throw new Error(`배너 목록 저장 실패: ${error.message}`)
  }
}

export async function getActiveEventBanners(): Promise<EventBanner[]> {
  const manifest = await downloadManifest()
  const now = Date.now()
  return sortBanners(manifest.banners.filter((banner) => isBannerActiveNow(banner, now)))
}

export async function getAllEventBanners(): Promise<EventBanner[]> {
  const manifest = await downloadManifest()
  return sortBanners(manifest.banners)
}

export async function getEventBannerById(id: string): Promise<EventBanner | null> {
  const banners = await getAllEventBanners()
  return banners.find((banner) => banner.id === id) ?? null
}

export async function saveEventBanner(
  input: Omit<EventBanner, "createdAt" | "updatedAt"> & {
    createdAt?: string
  },
): Promise<EventBanner> {
  const manifest = await downloadManifest()
  const now = new Date().toISOString()
  const existingIndex = manifest.banners.findIndex((banner) => banner.id === input.id)

  const next: EventBanner = {
    id: input.id,
    title: input.title.trim(),
    description: input.description.trim(),
    imageUrl: input.imageUrl.trim(),
    linkUrl: input.linkUrl.trim(),
    metaText: input.metaText.trim(),
    sortOrder: Number.isFinite(input.sortOrder) ? input.sortOrder : 0,
    isActive: Boolean(input.isActive),
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    createdAt: existingIndex >= 0 ? manifest.banners[existingIndex].createdAt : (input.createdAt ?? now),
    updatedAt: now,
  }

  if (!next.title) throw new Error("배너 제목을 입력해 주세요.")
  if (!next.imageUrl) throw new Error("배너 이미지를 업로드해 주세요.")

  if (existingIndex >= 0) {
    manifest.banners[existingIndex] = next
  } else {
    manifest.banners.push(next)
  }

  await uploadManifest(manifest)
  return next
}

export async function deleteEventBanner(id: string): Promise<void> {
  const manifest = await downloadManifest()
  const nextBanners = manifest.banners.filter((banner) => banner.id !== id)
  if (nextBanners.length === manifest.banners.length) {
    throw new Error("삭제할 배너를 찾을 수 없습니다.")
  }
  await uploadManifest({ version: 1, banners: nextBanners })
}

export async function uploadEventBannerImage(file: File, userId: string): Promise<string> {
  if (file.size === 0) throw new Error("배너 이미지 파일이 비어 있습니다.")
  if (file.size > 15 * 1024 * 1024) {
    throw new Error("배너 이미지는 15MB 이하만 업로드할 수 있습니다.")
  }

  const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])
  if (!allowed.has(file.type)) {
    throw new Error("JPEG, PNG, WebP, GIF 이미지만 업로드할 수 있습니다.")
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const path = `images/${userId}/${Date.now()}.${extension}`
  const admin = createAdminClient()
  const { error } = await admin.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  })
  if (error) throw new Error(`배너 이미지 업로드 실패: ${error.message}`)

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
