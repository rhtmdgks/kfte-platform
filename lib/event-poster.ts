import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const BUCKET = "event-posters"
const MAX_BYTES = 15 * 1024 * 1024
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

const EXT_TO_TYPE: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jfif: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
}

export function resolveEventPosterContentType(file: {
  name: string
  type: string
}): string | null {
  const raw = (file.type || "").toLowerCase()
  if (raw === "image/jpg") return "image/jpeg"
  if (ALLOWED_TYPES.has(raw)) return raw
  const ext = file.name.split(".").pop()?.toLowerCase() || ""
  return EXT_TO_TYPE[ext] ?? null
}

export function assertEventPosterFile(file: { name: string; type: string; size: number }) {
  if (file.size === 0) {
    throw new Error("상세 포스터 파일이 비어 있습니다.")
  }
  if (file.size > MAX_BYTES) {
    throw new Error("상세 포스터는 15MB 이하만 업로드할 수 있습니다.")
  }
  const contentType = resolveEventPosterContentType(file)
  if (!contentType) {
    throw new Error("JPEG, PNG, WebP, GIF 이미지만 업로드할 수 있습니다.")
  }
  return contentType
}

function buildPath(userId: string, fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() || "jpg"
  return `${userId}/${Date.now()}.${extension}`
}

/** Signed upload so the browser can PUT the file without going through Next body limits. */
export async function createEventPosterSignedUpload(
  supabase: SupabaseClient<Database>,
  file: { name: string; type: string; size: number },
  userId: string,
) {
  const contentType = assertEventPosterFile(file)
  const path = buildPath(userId, file.name)

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path)

  if (error || !data) {
    throw new Error(`상세 포스터 업로드 URL 발급 실패: ${error?.message || "unknown"}`)
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return {
    path: data.path,
    token: data.token,
    publicUrl: pub.publicUrl,
    contentType,
  }
}

export async function uploadEventPoster(
  supabase: SupabaseClient<Database>,
  file: File,
  userId: string,
): Promise<string> {
  const contentType = assertEventPosterFile(file)
  const path = buildPath(userId, file.name)

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType,
  })

  if (error) {
    throw new Error(`상세 포스터 업로드 실패: ${error.message}`)
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
