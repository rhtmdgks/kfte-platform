import { redirect } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AccountTable } from "@/components/admin/account-table"
import { createClient } from "@/lib/supabase/server"

export default async function UsersAccountsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/kfte-os/internal/login")

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "user")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold text-[#002065]">일반 사용자</h1>
        <span className="ml-auto text-sm text-muted-foreground">
          총 {profiles?.length ?? 0}명
        </span>
      </header>

      <main className="flex-1 p-6">
        <div className="rounded-md border">
          <AccountTable
            profiles={profiles ?? []}
            currentUserId={user.id}
            showRoleToggle={false}
          />
        </div>
      </main>
    </div>
  )
}
