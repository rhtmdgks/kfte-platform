import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getAdminDashboardData } from "@/lib/admin-dashboard"

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData()

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div>
          <h1 className="text-xl font-semibold text-[#002065]">대시보드</h1>
          <p className="text-sm text-muted-foreground">참여자 · 행사 · 콘텐츠 한눈에</p>
        </div>
      </header>

      <main className="flex-1 px-3 py-4 md:px-4 md:py-5">
        <AdminDashboard data={data} />
      </main>
    </div>
  )
}
