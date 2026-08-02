import Link from "next/link"
import { ClipboardList, ExternalLink, FileText, Pencil, Plus } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createForm } from "@/app/admin/forms/actions"
import { listForms } from "@/lib/application-forms/queries"
import { publicFormPath } from "@/lib/application-forms/types"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

const STATUS_LABEL: Record<string, string> = {
  draft: "임시저장",
  published: "게시됨",
  closed: "마감",
}

function statusBadgeVariant(status: string) {
  if (status === "published") return "default" as const
  if (status === "closed") return "outline" as const
  return "secondary" as const
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

export default async function AdminFormsPage() {
  let forms: Awaited<ReturnType<typeof listForms>> = []
  let loadError: string | null = null
  try {
    forms = await listForms()
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "폼 테이블을 불러오지 못했습니다. 마이그레이션을 적용해 주세요."
  }

  const supabase = await createClient()
  const counts = await Promise.all(
    forms.map(async (form) => {
      const { count } = await supabase
        .from("application_form_responses")
        .select("*", { count: "exact", head: true })
        .eq("form_id", form.id)
      return [form.id, count ?? 0] as const
    }),
  )
  const countMap = Object.fromEntries(counts)

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-[#002065]">신청 폼</h1>
          <p className="truncate text-sm text-muted-foreground">
            모집 폼 목록 · 총 {forms.length}개
          </p>
        </div>
        <form action={createForm} className="ml-auto shrink-0">
          <input type="hidden" name="title" value="제목 없는 폼" />
          <Button
            type="submit"
            className="h-11 rounded-full bg-[#002065] px-5 hover:bg-[#002065]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            새 폼
          </Button>
        </form>
      </header>

      <main className="flex-1 space-y-5 px-3 py-5 md:px-5 md:py-6">
        {loadError ? (
          <div
            role="alert"
            className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950"
          >
            {loadError}
            <p className="mt-1 text-xs text-amber-900/80">
              Supabase SQL Editor에서{" "}
              <code className="rounded bg-white/80 px-1">
                supabase/migrations/20260731140000_application_forms.sql
              </code>{" "}
              를 실행해 주세요.
            </p>
          </div>
        ) : null}

        <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Forms
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#002065]">폼 관리</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              공개 URL로 모집을 열고, 응답은 모집 현황에서 확인합니다.
            </p>
          </div>

          <div className="glass-pane overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead className="w-28">상태</TableHead>
                  <TableHead className="hidden md:table-cell">공개 URL</TableHead>
                  <TableHead className="w-24 text-right">응답</TableHead>
                  <TableHead className="hidden w-40 lg:table-cell">수정일</TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#002065]/10 text-[#002065]">
                          <FileText className="h-5 w-5" aria-hidden />
                        </span>
                        <div>
                          <p className="font-medium text-slate-800">폼이 없습니다</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            새 폼을 만들어 행사·모집에 연결해 보세요.
                          </p>
                        </div>
                        <form action={createForm}>
                          <input type="hidden" name="title" value="제목 없는 폼" />
                          <Button
                            type="submit"
                            className="h-11 rounded-full bg-[#002065] px-5 hover:bg-[#002065]/90"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            새 폼 만들기
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  forms.map((form) => {
                    const count = countMap[form.id] ?? 0
                    return (
                      <TableRow key={form.id} className="group">
                        <TableCell>
                          <Link
                            href={`/admin/forms/${form.id}/edit`}
                            className="font-medium text-slate-900 transition-colors hover:text-[#002065]"
                          >
                            {form.title}
                          </Link>
                          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground md:hidden">
                            {publicFormPath(form.slug)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusBadgeVariant(form.status)}
                            className={cn(
                              form.status === "published" && "bg-[#002065] hover:bg-[#002065]/90",
                            )}
                          >
                            {STATUS_LABEL[form.status] ?? form.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Link
                            href={publicFormPath(form.slug)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex max-w-[220px] items-center gap-1 truncate font-mono text-xs text-muted-foreground transition-colors hover:text-[#002065]"
                          >
                            <span className="truncate">{publicFormPath(form.slug)}</span>
                            <ExternalLink className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                            <span className="sr-only">새 탭에서 열기</span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          <Link
                            href={`/admin/forms/${form.id}/responses`}
                            className="font-medium text-[#002065] underline-offset-2 hover:underline"
                          >
                            {count}
                          </Link>
                        </TableCell>
                        <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                          {formatDate(form.updated_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-10 min-w-10 rounded-full px-3"
                            >
                              <Link href={`/admin/forms/${form.id}/edit`}>
                                <Pencil className="h-3.5 w-3.5 sm:mr-1.5" />
                                <span className="hidden sm:inline">편집</span>
                              </Link>
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-10 min-w-10 rounded-full px-3"
                            >
                              <Link href={`/admin/forms/${form.id}/responses`}>
                                <ClipboardList className="h-3.5 w-3.5 sm:mr-1.5" />
                                <span className="hidden sm:inline">현황</span>
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>
    </div>
  )
}
