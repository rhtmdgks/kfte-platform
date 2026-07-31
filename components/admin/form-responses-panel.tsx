"use client"

import { useMemo, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { deleteResponse } from "@/app/admin/forms/actions"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  buildResponsesCsv,
  buildResponsesExcelXml,
  downloadBlob,
  formatAnswerForExport,
} from "@/lib/application-forms/export-responses"
import { flattenQuestions } from "@/lib/application-forms/parse"
import type { FormSchema } from "@/lib/application-forms/types"
import type { Tables } from "@/types/database"

type ResponseRow = Tables<"application_form_responses">

type FormResponsesPanelProps = {
  formId: string
  formTitle?: string
  schema: FormSchema
  responses: ResponseRow[]
}

export function FormResponsesPanel({
  formId,
  formTitle,
  schema,
  responses,
}: FormResponsesPanelProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const questions = flattenQuestions(schema)
  const fileStem = `form-${(formTitle || formId).replace(/[^\w가-힣-]+/g, "-").slice(0, 40)}-responses`

  const summary = useMemo(() => {
    return questions
      .filter((q) =>
        ["multiple_choice", "dropdown", "checkboxes", "linear_scale"].includes(q.type),
      )
      .map((question) => {
        const counts = new Map<string, number>()
        for (const response of responses) {
          const answers = (response.answers ?? {}) as Record<string, unknown>
          const value = answers[question.id]
          if (Array.isArray(value)) {
            for (const item of value) {
              const key = String(item)
              counts.set(key, (counts.get(key) ?? 0) + 1)
            }
          } else if (value != null && value !== "") {
            const key = String(value)
            counts.set(key, (counts.get(key) ?? 0) + 1)
          }
        }

        const labelMap = new Map(
          (question.options ?? []).map((o) => [o.id, o.label] as const),
        )

        return {
          question,
          data: [...counts.entries()].map(([key, count]) => ({
            name: labelMap.get(key) ?? key,
            count,
          })),
        }
      })
  }, [questions, responses])

  const exportExcel = () => {
    if (responses.length === 0) {
      toast.message("내보낼 응답이 없습니다.")
      return
    }
    const xml = buildResponsesExcelXml(schema, responses)
    downloadBlob(
      `${fileStem}.xls`,
      new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" }),
    )
    toast.success("엑셀 파일을 내려받았습니다.")
  }

  const exportCsv = () => {
    if (responses.length === 0) {
      toast.message("내보낼 응답이 없습니다.")
      return
    }
    const csv = buildResponsesCsv(schema, responses)
    downloadBlob(`${fileStem}.csv`, new Blob([csv], { type: "text/csv;charset=utf-8" }))
    toast.success("CSV 파일을 내려받았습니다.")
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href={`/admin/forms/${formId}/edit`}>폼 편집</Link>
        </Button>
        <Button
          type="button"
          onClick={exportExcel}
          className="bg-[#002065] hover:bg-[#002065]/90"
        >
          엑셀 내보내기
        </Button>
        <Button type="button" variant="outline" onClick={exportCsv}>
          CSV 내보내기
        </Button>
      </div>

      {summary.length > 0 ? (
        <section className="space-y-6">
          <h2 className="text-sm font-semibold text-[#002065]">요약</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {summary.map(({ question, data }) => (
              <div key={question.id} className="rounded-lg border p-4">
                <p className="mb-3 text-sm font-medium">{question.title}</p>
                {data.length === 0 ? (
                  <p className="text-sm text-muted-foreground">응답 없음</p>
                ) : (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} width={28} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#002065" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제출 시각</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>점수</TableHead>
              <TableHead>미리보기</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  응답이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              responses.map((response) => {
                const answers = (response.answers ?? {}) as Record<string, unknown>
                const preview = questions
                  .slice(0, 2)
                  .map((q) => formatAnswerForExport(q, answers[q.id]))
                  .filter(Boolean)
                  .join(" · ")
                return (
                  <TableRow key={response.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(response.submitted_at).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell>{response.respondent_email ?? "—"}</TableCell>
                    <TableCell>{response.score ?? "—"}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {preview || "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          startTransition(async () => {
                            try {
                              await deleteResponse(formId, response.id)
                              toast.success("응답을 삭제했습니다.")
                              router.refresh()
                            } catch (error) {
                              toast.error(
                                error instanceof Error ? error.message : "삭제 실패",
                              )
                            }
                          })
                        }
                      >
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
