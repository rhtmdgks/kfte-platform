import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostTable } from "@/components/admin/content-post-table"
import { createClient } from "@/lib/supabase/server"
import { deletePost } from "@/app/admin/content/actions"

export default async function AdminEventArchivesPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("content_posts").select("*").eq("content_type", "event_archive").order("created_at", { ascending: false })

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <h1 className="text-lg font-semibold text-[#002065]">행사 아카이브 관리</h1>
      </header>
      <main className="flex-1 p-6">
        <ContentPostTable posts={posts ?? []} adminPath="/admin/event-archives" contentType="event_archive" onDelete={deletePost} />
      </main>
    </div>
  )
}
