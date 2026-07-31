import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { EventPostForm } from "@/components/admin/event-post-form"
import { createPost } from "@/app/admin/content/actions"
import { listForms } from "@/lib/application-forms/queries"

export default async function NewEventPage() {
  const forms = await listForms().catch(() => [])

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <Link href="/admin/events" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />행사 목록
        </Link>
        <h1 className="text-lg font-semibold text-[#002065]">새 행사</h1>
      </header>
      <main className="flex-1 p-6">
        <EventPostForm
          contentType="event"
          action={createPost}
          applicationForms={forms.map((form) => ({
            id: form.id,
            title: form.title,
            slug: form.slug,
            status: form.status,
          }))}
        />
      </main>
    </div>
  )
}
