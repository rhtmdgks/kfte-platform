import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { EventArchiveAdminTable } from "@/components/admin/event-archive-admin-table"
import { getAdminEventArchiveRows } from "@/lib/event-archive-admin"

export default async function AdminEventArchivesPage() {
  const rows = await getAdminEventArchiveRows()

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <h1 className="text-lg font-semibold text-[#002065]">행사 아카이브 관리</h1>
      </header>
      <main className="flex-1 p-6">
        <EventArchiveAdminTable rows={rows} />
      </main>
    </div>
  )
}
