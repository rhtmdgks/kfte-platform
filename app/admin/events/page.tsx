import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostTable } from "@/components/admin/content-post-table"
import { createClient } from "@/lib/supabase/server"
import { deletePost } from "@/app/admin/content/actions"

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("content_posts")
    .select("*")
    .eq("content_type", "event")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <div>
          <h1 className="text-lg font-semibold text-[#002065]">행사 관리</h1>
          <p className="text-xs text-muted-foreground">
            모집 마감된 공개 행사는 아카이브에 자동 노출됩니다.
          </p>
        </div>
      </header>
      <main className="flex-1 p-6">
        <ContentPostTable posts={posts ?? []} adminPath="/admin/events" contentType="event" onDelete={deletePost} />
      </main>
    </div>
  )
}
