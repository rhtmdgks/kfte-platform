import { redirect } from "next/navigation"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { AccountTable } from "@/components/admin/account-table"
import { createClient } from "@/lib/supabase/server"
import { updateProfileRole, deleteProfile } from "@/app/admin/accounts/actions"

export default async function AdminAccountsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/kfte-os/internal/login")

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "admin")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <h1 className="text-lg font-semibold text-[#002065]">관리자 계정</h1>
        <span className="ml-auto text-sm text-muted-foreground">
          총 {profiles?.length ?? 0}명
        </span>
      </header>

      <main className="flex-1 p-6">
        <div className="rounded-md border">
          <AccountTable
            profiles={profiles ?? []}
            currentUserId={user.id}
            showRoleToggle={true}
            onRoleChange={updateProfileRole}
            onDelete={deleteProfile}
          />
        </div>
      </main>
    </div>
  )
}
