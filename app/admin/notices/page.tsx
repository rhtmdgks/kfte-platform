import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostTable } from "@/components/admin/content-post-table"
import { ContentViewsChart } from "@/components/admin/content-views-chart"
import { createClient } from "@/lib/supabase/server"
import { deletePost } from "@/app/admin/content/actions"
import { getContentViewTrends, sumViewTrend } from "@/lib/content-view-analytics"

export default async function AdminNoticesPage() {
  const supabase = await createClient()
  const [{ data: posts }, viewTrends] = await Promise.all([
    supabase
      .from("content_posts")
      .select("*")
      .eq("content_type", "notice")
      .order("created_at", { ascending: false }),
    getContentViewTrends("notice", 30),
  ])
  const list = posts ?? []

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-[#002065]">공지사항 관리</h1>
          <p className="truncate text-sm text-muted-foreground">
            공지 · 총 {list.length}개
          </p>
        </div>
      </header>
      <main className="flex-1 space-y-5 px-3 py-5 md:px-5 md:py-6">
        <ContentViewsChart
          title="공지사항 조회 추이"
          description="최근 30일간 공개 공지사항 상세 페이지 조회수"
          data={viewTrends}
          totalViews={sumViewTrend(viewTrends)}
        />
        <ContentPostTable
          posts={list}
          adminPath="/admin/notices"
          contentType="notice"
          onDelete={deletePost}
          sectionTitle="공지 관리"
          sectionDescription="상단 고정·첨부·공개 상태를 관리합니다."
        />
      </main>
    </div>
  )
}
