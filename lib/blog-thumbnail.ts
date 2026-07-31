import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const BUCKET = "blog-thumbnails"
const MAX_BYTES = 15 * 1024 * 1024
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

export async function uploadBlogThumbnail(
  supabase: SupabaseClient<Database>,
  file: File,
  userId: string,
): Promise<string> {
  if (file.size === 0) {
    throw new Error("썸네일 파일이 비어 있습니다.")
  }

  if (file.size > MAX_BYTES) {
    throw new Error("썸네일은 15MB 이하만 업로드할 수 있습니다.")
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
    throw new Error(`썸네일 업로드 실패: ${error.message}`)
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
