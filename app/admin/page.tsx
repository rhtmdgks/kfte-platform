import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getAdminDashboardData } from "@/lib/admin-dashboard"

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData()

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <div>
          <h1 className="text-lg font-semibold text-[#002065]">대시보드</h1>
          <p className="text-xs text-muted-foreground">참여자 · 행사 · 콘텐츠 한눈에</p>
        </div>
      </header>

      <main className="flex-1 bg-[#F5F7FA]/60 p-6">
        <div className="mx-auto max-w-6xl">
          <AdminDashboard data={data} />
        </div>
      </main>
    </div>
  )
}
