import { redirect } from "next/navigation"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { AccountTable } from "@/components/admin/account-table"
import { AccountsSectionNav } from "@/components/admin/accounts-section-nav"
import { getAccountSectionCounts } from "@/lib/admin-accounts"
import { createClient } from "@/lib/supabase/server"
import {
  deleteProfile,
  updateProfileDisplayName,
  updateProfileRole,
  updateUserPassword,
} from "@/app/admin/accounts/actions"

export default async function AdminAccountsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/kfte-os/internal/login")

  const [{ data: profiles }, counts] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "admin")
      .order("created_at", { ascending: false }),
    getAccountSectionCounts(),
  ])

  const list = profiles ?? []

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-[#002065]">계정 관리</h1>
          <p className="truncate text-sm text-muted-foreground">
            관리자 · 이름·비밀번호 변경 · {list.length}명
          </p>
        </div>
      </header>

      <main className="flex-1 space-y-5 px-3 py-5 md:px-5 md:py-6">
        <AccountsSectionNav
          active="admins"
          adminCount={counts.adminCount}
          userCount={counts.userCount}
        />

        <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Admins
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#002065]">관리자 계정</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              모든 관리자 계정의 표시 이름과 비밀번호를 변경할 수 있습니다.
            </p>
          </div>
          <AccountTable
            profiles={list}
            currentUserId={user.id}
            emptyTitle="관리자 계정이 없습니다"
            emptyDescription="관리자 역할의 계정이 여기에 표시됩니다."
            showRoleToggle
            onRoleChange={updateProfileRole}
            onDelete={deleteProfile}
            onUpdateDisplayName={updateProfileDisplayName}
            onUpdatePassword={updateUserPassword}
          />
        </section>
      </main>
    </div>
  )
}
