import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createEventPosterSignedUpload } from "@/lib/event-poster"

export const runtime = "nodejs"

type SignBody = {
  name?: string
  type?: string
  size?: number
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: SignBody
  try {
    body = (await request.json()) as SignBody
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 })
  }

  const name = typeof body.name === "string" ? body.name : ""
  const type = typeof body.type === "string" ? body.type : ""
  const size = typeof body.size === "number" ? body.size : Number.NaN
  if (!name || !Number.isFinite(size)) {
    return NextResponse.json({ error: "이미지 파일이 필요합니다." }, { status: 400 })
  }

  try {
    // ponytail: signed URL — file never passes through Next/Vercel body limit
    const admin = createAdminClient()
    const signed = await createEventPosterSignedUpload(
      admin,
      { name, type, size },
      user.id,
    )
    return NextResponse.json(signed)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "상세 페이지 이미지 업로드에 실패했습니다."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
