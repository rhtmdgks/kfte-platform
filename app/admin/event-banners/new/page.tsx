import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { EventBannerForm } from "@/components/admin/event-banner-form"
import { createEventBanner } from "@/app/admin/event-banners/actions"

export default function NewEventBannerPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <Link
            href="/admin/event-banners"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-[#002065]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            배너 목록
          </Link>
          <h1 className="truncate text-xl font-semibold text-[#002065]">새 행사 배너</h1>
        </div>
      </header>
      <main className="flex-1 px-3 py-5 md:px-5 md:py-6">
        <EventBannerForm action={createEventBanner} />
      </main>
    </div>
  )
}
