import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { EventArchiveAdminTable } from "@/components/admin/event-archive-admin-table"
import { getAdminEventArchiveRows } from "@/lib/event-archive-admin"

export default async function AdminEventArchivesPage() {
  const rows = await getAdminEventArchiveRows()

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-[#002065]">행사 아카이브 관리</h1>
          <p className="truncate text-sm text-muted-foreground">
            자동·수동 기록 · 총 {rows.length}개
          </p>
        </div>
      </header>
      <main className="flex-1 space-y-5 px-3 py-5 md:px-5 md:py-6">
        <EventArchiveAdminTable rows={rows} />
      </main>
    </div>
  )
}
