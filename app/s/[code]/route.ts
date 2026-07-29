import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"

type RouteParams = {
  params: Promise<{ code: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { code } = await params
  const trimmed = code?.trim() ?? ""

  if (!trimmed || !isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/", _request.url), 302)
  }

  try {
    const supabase = await createClient()
    const { data: targetPath, error } = await supabase.rpc("resolve_short_link", {
      p_code: trimmed,
    })

    if (error || !targetPath || typeof targetPath !== "string") {
      return NextResponse.redirect(new URL("/", _request.url), 302)
    }

    // Only allow internal relative paths (RPC already guards, belt-and-suspenders)
    if (!targetPath.startsWith("/") || targetPath.startsWith("//") || targetPath.includes("://")) {
      return NextResponse.redirect(new URL("/", _request.url), 302)
    }

    return NextResponse.redirect(new URL(targetPath, _request.url), 302)
  } catch {
    return NextResponse.redirect(new URL("/", _request.url), 302)
  }
}
