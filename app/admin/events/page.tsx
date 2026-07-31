import Link from "next/link"
import { Plus } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostTable } from "@/components/admin/content-post-table"
import { EventAdminDashboard } from "@/components/admin/event-admin-dashboard"
import { EventPostForm } from "@/components/admin/event-post-form"
import { Button } from "@/components/ui/button"
import { createPost, deletePost } from "@/app/admin/content/actions"
import { listForms } from "@/lib/application-forms/queries"
import { getEventAdminDashboardData } from "@/lib/admin-event-dashboard"
import { createClient } from "@/lib/supabase/server"

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const [postsRes, dashboard, forms] = await Promise.all([
    supabase
      .from("content_posts")
      .select("*")
      .eq("content_type", "event")
      .order("created_at", { ascending: false }),
    getEventAdminDashboardData(),
    listForms().catch(() => []),
  ])

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div>
          <h1 className="text-xl font-semibold text-[#002065]">행사</h1>
          <p className="text-sm text-muted-foreground">현황 · 관리 · 등록</p>
        </div>
      </header>

      <main className="flex-1 space-y-8 px-3 py-5 md:px-5 md:py-6">
        <section id="dashboard" className="scroll-mt-4">
          <EventAdminDashboard data={dashboard} />
        </section>

        <section
          id="manage"
          className="scroll-mt-4 space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-6"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Manage
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-[#002065]">행사 관리</h2>
              <Button
                asChild
                className="h-11 shrink-0 rounded-full bg-[#002065] px-5 hover:bg-[#002065]/90"
              >
                <Link href="#register">
                  <Plus className="mr-2 h-4 w-4" />
                  새 행사 등록
                </Link>
              </Button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              모집 마감된 공개 행사는 아카이브에 자동 노출됩니다.
            </p>
          </div>
          <ContentPostTable
            posts={postsRes.data ?? []}
            adminPath="/admin/events"
            contentType="event"
            onDelete={deletePost}
            hideCreate
          />
        </section>

        <section id="register" className="scroll-mt-4 space-y-5">
          <div className="glass-pane rounded-2xl border border-white/55 px-5 py-4 md:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Register
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#002065]">행사 등록</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              새 행사를 작성하고 신청 폼을 연결할 수 있습니다.
            </p>
          </div>
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
        </section>
      </main>
    </div>
  )
}
