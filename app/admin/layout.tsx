import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminContentShell } from "@/components/admin/admin-content-shell"
import { Toaster } from "@/components/ui/sonner"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  robots: { index: false, follow: false },
  alternates: {},
  openGraph: { images: [] },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/kfte-os/internal/login")
  }

  // role 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/kfte-os/internal/login?error=wrong_portal")
  }

  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get("sidebar:state")?.value
  const defaultOpen = sidebarCookie === undefined ? true : sidebarCookie === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar profile={profile} />
      <SidebarInset>
        <AdminContentShell>{children}</AdminContentShell>
      </SidebarInset>
      <Toaster richColors />
    </SidebarProvider>
  )
}
