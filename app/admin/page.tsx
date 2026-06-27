import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import {
  Bell,
  Building2,
  Calendar,
  FileText,
  Megaphone,
  Newspaper,
  Users,
} from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: noticeCount },
    { count: pressCount },
    { count: eventCount },
    { count: resourceCount },
    { count: blogCount },
    { count: pendingCount },
    { count: adminCount },
  ] = await Promise.all([
    supabase
      .from("content_posts")
      .select("*", { count: "exact", head: true })
      .eq("content_type", "notice"),
    supabase
      .from("content_posts")
      .select("*", { count: "exact", head: true })
      .eq("content_type", "press"),
    supabase
      .from("content_posts")
      .select("*", { count: "exact", head: true })
      .in("content_type", ["event", "event_archive"]),
    supabase
      .from("content_posts")
      .select("*", { count: "exact", head: true })
      .eq("content_type", "resource"),
    supabase
      .from("content_posts")
      .select("*", { count: "exact", head: true })
      .eq("content_type", "blog"),
    supabase
      .from("membership_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin"),
  ])

  const summaryCards = [
    { label: "공지사항", count: noticeCount ?? 0, icon: Bell, href: "/admin/notices" },
    { label: "언론보도", count: pressCount ?? 0, icon: Newspaper, href: "/admin/press" },
    { label: "행사", count: eventCount ?? 0, icon: Calendar, href: "/admin/events" },
    { label: "자료실", count: resourceCount ?? 0, icon: FileText, href: "/admin/resources" },
    { label: "블로그", count: blogCount ?? 0, icon: Megaphone, href: "/admin/blog" },
    {
      label: "가입 신청 (대기)",
      count: pendingCount ?? 0,
      icon: Building2,
      href: "/admin/membership-applications",
    },
    {
      label: "관리자 계정",
      count: adminCount ?? 0,
      icon: Users,
      href: "/admin/accounts/admins",
    },
  ]

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <h1 className="text-lg font-semibold text-[#002065]">대시보드</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.href} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#002065]">{card.count}</div>
                <a href={card.href} className="text-xs text-muted-foreground hover:underline">
                  관리하기 →
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
