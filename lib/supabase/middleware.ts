import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import type { Database } from "@/types/database"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
          Object.entries(headers ?? {}).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith("/admin")
  const isPublicAdminRoute =
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/auth") ||
    pathname.startsWith("/admin/forgot-password") ||
    pathname.startsWith("/admin/reset-password")

  if (isAdminRoute && !isPublicAdminRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/kfte-os/internal/login"
    return NextResponse.redirect(loginUrl)
  }

  const isPartnerRoute = pathname.startsWith("/partner")
  if (isPartnerRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/kfte-os/partner/login"
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}
