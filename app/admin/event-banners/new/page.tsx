import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { EventBannerForm } from "@/components/admin/event-banner-form"
import { createEventBanner } from "@/app/admin/event-banners/actions"

export default function NewEventBannerPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <Link
          href="/admin/event-banners"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          배너 목록
        </Link>
        <h1 className="text-lg font-semibold text-[#002065]">새 행사 배너</h1>
      </header>
      <main className="flex-1 p-6">
        <EventBannerForm action={createEventBanner} />
      </main>
    </div>
  )
}
