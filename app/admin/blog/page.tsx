import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostTable } from "@/components/admin/content-post-table"
import { createClient } from "@/lib/supabase/server"
import { deletePost } from "@/app/admin/content/actions"

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("content_posts")
    .select("*")
    .eq("content_type", "blog")
    .order("created_at", { ascending: false })
  const list = posts ?? []

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-[#002065]">블로그 관리</h1>
          <p className="truncate text-sm text-muted-foreground">
            블로그 · 총 {list.length}개
          </p>
        </div>
      </header>
      <main className="flex-1 space-y-5 px-3 py-5 md:px-5 md:py-6">
        <ContentPostTable
          posts={list}
          adminPath="/admin/blog"
          contentType="blog"
          onDelete={deletePost}
          sectionTitle="글 관리"
          sectionDescription="썸네일·카테고리·공개 상태를 관리합니다."
        />
      </main>
    </div>
  )
}
