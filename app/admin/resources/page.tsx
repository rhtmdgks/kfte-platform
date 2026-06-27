import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostTable } from "@/components/admin/content-post-table"
import { createClient } from "@/lib/supabase/server"
import { deletePost } from "@/app/admin/content/actions"

export default async function AdminResourcesPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("content_posts").select("*").eq("content_type", "resource").order("created_at", { ascending: false })

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <h1 className="text-lg font-semibold text-[#002065]">자료실 관리</h1>
      </header>
      <main className="flex-1 p-6">
        <ContentPostTable posts={posts ?? []} adminPath="/admin/resources" contentType="resource" onDelete={deletePost} />
      </main>
    </div>
  )
}
