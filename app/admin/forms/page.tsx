import Link from "next/link"
import { Plus } from "lucide-react"
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

const STATUS_LABEL: Record<string, string> = {
  draft: "임시저장",
  published: "게시됨",
  closed: "마감",
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
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <h1 className="text-lg font-semibold text-[#002065]">신청 폼</h1>
        <span className="text-sm text-muted-foreground">총 {forms.length}개</span>
        <form action={createForm} className="ml-auto">
          <input type="hidden" name="title" value="제목 없는 폼" />
          <Button type="submit" className="bg-[#002065] hover:bg-[#002065]/90">
            <Plus className="mr-2 h-4 w-4" />
            새 폼
          </Button>
        </form>
      </header>

      <main className="flex-1 p-6">
        {loadError ? (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {loadError}
            <p className="mt-1 text-xs">
              Supabase SQL Editor에서{" "}
              <code className="rounded bg-white px-1">
                supabase/migrations/20260731140000_application_forms.sql
              </code>{" "}
              를 실행해 주세요.
            </p>
          </div>
        ) : null}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>공개 URL</TableHead>
                <TableHead>응답</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    폼이 없습니다. 새 폼을 만들어 주세요.
                  </TableCell>
                </TableRow>
              ) : (
                forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.title}</TableCell>
                    <TableCell>
                      <Badge variant={form.status === "published" ? "default" : "secondary"}>
                        {STATUS_LABEL[form.status] ?? form.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {publicFormPath(form.slug)}
                    </TableCell>
                    <TableCell>{countMap[form.id] ?? 0}</TableCell>
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/forms/${form.id}/edit`}>편집</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}
