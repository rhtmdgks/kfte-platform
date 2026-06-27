import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function PartnerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/kfte-os/partner/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "partner") {
    redirect("/kfte-os/partner/login?error=wrong_portal")
  }

  return <>{children}</>
}
