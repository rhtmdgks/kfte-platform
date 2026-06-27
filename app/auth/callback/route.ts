import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  authPortals,
  isRoleAllowedForPortal,
  type AuthPortal,
} from "@/lib/auth-portals"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const type = searchParams.get("type")
  const portal = (searchParams.get("portal") as AuthPortal) ?? "internal"
  const next = searchParams.get("next") ?? authPortals[portal]?.redirectPath ?? "/"

  const portalConfig = authPortals[portal] ?? authPortals.internal

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}${portalConfig.resetPasswordPath}`)
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (!profile || !isRoleAllowedForPortal(profile.role, portal)) {
          await supabase.auth.signOut()
          return NextResponse.redirect(
            `${origin}${portalConfig.loginPath}?error=wrong_portal`,
          )
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}${portalConfig.loginPath}?error=auth_callback_failed`)
}
