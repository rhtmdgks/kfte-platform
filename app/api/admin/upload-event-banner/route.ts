import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { uploadEventBannerImage } from "@/lib/event-banners"

export const runtime = "nodejs"

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

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "업로드 요청을 읽지 못했습니다." }, { status: 400 })
  }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "이미지 파일이 필요합니다." }, { status: 400 })
  }

  try {
    const url = await uploadEventBannerImage(file, user.id)
    return NextResponse.json({ url })
  } catch (error) {
    const message = error instanceof Error ? error.message : "배너 이미지 업로드에 실패했습니다."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
