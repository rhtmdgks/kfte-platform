import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { EventBannerTable } from "@/components/admin/event-banner-table"
import { getAllEventBanners } from "@/lib/event-banners"
import { removeEventBanner } from "@/app/admin/event-banners/actions"

export const dynamic = "force-dynamic"

export default async function AdminEventBannersPage() {
  const banners = await getAllEventBanners()

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <div>
          <h1 className="text-lg font-semibold text-[#002065]">행사 배너</h1>
          <p className="text-xs text-muted-foreground">
            행사 목록 페이지 상단 캐러셀 · 3초 자동 전환 · 호버 시 좌우 이동
          </p>
        </div>
      </header>
      <main className="flex-1 p-6">
        <EventBannerTable banners={banners} onDelete={removeEventBanner} />
      </main>
    </div>
  )
}
