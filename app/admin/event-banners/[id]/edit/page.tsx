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
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <Link
          href="/admin/event-banners"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          배너 목록
        </Link>
        <h1 className="text-lg font-semibold text-[#002065]">배너 수정</h1>
      </header>
      <main className="flex-1 p-6">
        <EventBannerForm banner={banner} action={updateEventBanner.bind(null, id)} />
      </main>
    </div>
  )
}
