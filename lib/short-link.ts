"use server"

import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export type CreateShortLinkResult =
  | { ok: true; code: string }
  | { ok: false; error: string }

/**
 * Create or reuse a short code for an internal path (e.g. `/activities/events/foo`).
 * Client prepends `window.location.origin` to build the share URL.
 */
export async function createShortLink(path: string): Promise<CreateShortLinkResult> {
  const trimmed = path.trim()
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("://")) {
    return { ok: false, error: "유효하지 않은 경로입니다." }
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "단축링크 서비스를 사용할 수 없습니다." }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc("create_short_link", {
      p_target: trimmed,
    })

    if (error || !data) {
      return { ok: false, error: error?.message ?? "단축링크 생성에 실패했습니다." }
    }

    return { ok: true, code: data }
  } catch (err) {
    const message = err instanceof Error ? err.message : "단축링크 생성에 실패했습니다."
    return { ok: false, error: message }
  }
}
