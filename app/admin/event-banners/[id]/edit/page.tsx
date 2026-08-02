import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { EventBannerForm } from "@/components/admin/event-banner-form"
import { getEventBannerById } from "@/lib/event-banners"
import { updateEventBanner } from "@/app/admin/event-banners/actions"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditEventBannerPage({ params }: PageProps) {
  const { id } = await params
  const banner = await getEventBannerById(id)
  if (!banner) notFound()

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
          <h1 className="truncate text-xl font-semibold text-[#002065]">
            {banner.title || "배너 수정"}
          </h1>
        </div>
      </header>
      <main className="flex-1 px-3 py-5 md:px-5 md:py-6">
        <EventBannerForm banner={banner} action={updateEventBanner.bind(null, id)} />
      </main>
    </div>
  )
}
