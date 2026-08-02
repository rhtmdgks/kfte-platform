import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { EventBannerTable } from "@/components/admin/event-banner-table"
import { getAllEventBanners } from "@/lib/event-banners"
import { removeEventBanner } from "@/app/admin/event-banners/actions"

export const dynamic = "force-dynamic"

export default async function AdminEventBannersPage() {
  const banners = await getAllEventBanners()
  const activeCount = banners.filter((b) => b.isActive).length

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-[#002065]">행사 배너</h1>
          <p className="truncate text-sm text-muted-foreground">
            행사 목록 상단 캐러셀 · 총 {banners.length}개 · 공개 {activeCount}개
          </p>
        </div>
      </header>
      <main className="flex-1 space-y-5 px-3 py-5 md:px-5 md:py-6">
        <EventBannerTable banners={banners} onDelete={removeEventBanner} />
      </main>
    </div>
  )
}
