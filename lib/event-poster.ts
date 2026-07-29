import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const BUCKET = "event-posters"
const MAX_BYTES = 15 * 1024 * 1024
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

export async function uploadEventPoster(
  supabase: SupabaseClient<Database>,
  file: File,
  userId: string,
): Promise<string> {
  if (file.size === 0) {
    throw new Error("상세 포스터 파일이 비어 있습니다.")
  }

  if (file.size > MAX_BYTES) {
    throw new Error("상세 포스터는 15MB 이하만 업로드할 수 있습니다.")
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("JPEG, PNG, WebP, GIF 이미지만 업로드할 수 있습니다.")
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const path = `${userId}/${Date.now()}.${extension}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  })

  if (error) {
    throw new Error(`상세 포스터 업로드 실패: ${error.message}`)
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
