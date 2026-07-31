import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { uploadEventPoster } from "@/lib/event-poster"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { error: "업로드 요청을 읽지 못했습니다. 파일 크기를 확인한 뒤 다시 시도해 주세요." },
      { status: 400 },
    )
  }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "이미지 파일이 필요합니다." }, { status: 400 })
  }

  try {
    // Storage RLS를 우회하기 위해 인증된 관리자 요청만 service role로 업로드
    const admin = createAdminClient()
    const url = await uploadEventPoster(admin, file, user.id)
    return NextResponse.json({ url })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "상세 페이지 이미지 업로드에 실패했습니다."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
