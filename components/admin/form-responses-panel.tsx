"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Pencil,
  Trash2,
} from "lucide-react"
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { deleteResponse } from "@/app/admin/forms/actions"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  buildResponsesCsv,
  buildResponsesExcelXml,
  downloadBlob,
  formatAnswerForExport,
} from "@/lib/application-forms/export-responses"
import { flattenQuestions } from "@/lib/application-forms/parse"
import type { FormQuestion, FormSchema } from "@/lib/application-forms/types"
import { cn } from "@/lib/utils"
import type { Tables } from "@/types/database"

type ResponseRow = Tables<"application_form_responses">

type FormResponsesPanelProps = {
  formId: string
  formTitle?: string
  schema: FormSchema
  responses: ResponseRow[]
}

type CountRow = { key: string; name: string; count: number; pct: number }

const PIE_COLORS = ["#002065", "#1a4a9e", "#3d6bb8", "#6b8fc9", "#9bb3db", "#c5d4eb", "#7a8fa6"]

function answersOf(response: ResponseRow) {
  return (response.answers ?? {}) as Record<string, unknown>
}

function optionLabel(question: FormQuestion, id: string) {
  const fromOptions = question.options?.find((o) => o.id === id)?.label
  if (fromOptions) return fromOptions
  if (id.startsWith("__other__:")) return `기타: ${id.slice("__other__:".length)}`
  if (id === "__other__") return "기타"
  return id
}

function buildCounts(question: FormQuestion, responses: ResponseRow[]): CountRow[] {
  const counts = new Map<string, number>()
  let answered = 0

  for (const response of responses) {
    const value = answersOf(response)[question.id]
    if (value == null || value === "") continue
    answered += 1

    if (Array.isArray(value)) {
      for (const item of value) {
        const key = String(item)
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
    } else {
      const key = String(value)
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }

  const denom = Math.max(answered, 1)
  const rows = [...counts.entries()].map(([key, count]) => ({
    key,
    name: optionLabel(question, key),
    count,
    pct: Math.round((count / denom) * 1000) / 10,
  }))

  // Keep option order when known
  if (question.options?.length) {
    const order = new Map(question.options.map((o, i) => [o.id, i]))
    rows.sort((a, b) => (order.get(a.key) ?? 999) - (order.get(b.key) ?? 999))
  } else if (question.type === "linear_scale") {
    rows.sort((a, b) => Number(a.key) - Number(b.key))
  }

  return rows
}

function textAnswers(question: FormQuestion, responses: ResponseRow[]) {
  return responses
    .map((response) => {
      const formatted = formatAnswerForExport(question, answersOf(response)[question.id])
      return formatted.trim() ? formatted : null
    })
    .filter((v): v is string => Boolean(v))
}

function isChoiceQuestion(type: FormQuestion["type"]) {
  return ["multiple_choice", "dropdown", "checkboxes", "linear_scale"].includes(type)
}

function QuestionSummaryCard({
  question,
  responses,
  total,
}: {
  question: FormQuestion
  responses: ResponseRow[]
  total: number
}) {
  const choice = isChoiceQuestion(question.type)
  const data = choice ? buildCounts(question, responses) : []
  const texts = choice ? [] : textAnswers(question, responses)
  const answered = choice
    ? responses.filter((r) => {
        const v = answersOf(r)[question.id]
        return v != null && v !== "" && !(Array.isArray(v) && v.length === 0)
      }).length
    : texts.length

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
      <header className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">{question.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {answered.toLocaleString("ko-KR")}개 응답
          {total > 0 ? ` · 전체 ${total.toLocaleString("ko-KR")}건 중` : null}
        </p>
      </header>

      {choice ? (
        data.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 응답이 없습니다.</p>
        ) : question.type === "multiple_choice" || question.type === "dropdown" ? (
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:items-center">
            <div className="mx-auto h-44 w-full max-w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {data.map((row, i) => (
                      <Cell key={row.key} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value}건`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2.5">
              {data.map((row, i) => (
                <li key={row.key} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate text-slate-700">{row.name}</span>
                  <span className="shrink-0 tabular-nums text-slate-500">
                    {row.count} · {row.pct}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis allowDecimals={false} width={28} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => [`${value}건`, "응답"]} />
                  <Bar dataKey="count" fill="#002065" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2">
              {data.map((row) => (
                <li key={row.key}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                    <span className="truncate text-slate-700">{row.name}</span>
                    <span className="shrink-0 tabular-nums text-slate-500">
                      {row.count} · {row.pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#002065] transition-[width] duration-200"
                      style={{ width: `${Math.min(row.pct, 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      ) : texts.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 응답이 없습니다.</p>
      ) : (
        <ul className="max-h-72 space-y-0 overflow-y-auto rounded-xl border border-slate-100">
          {texts.map((text, i) => (
            <li
              key={`${question.id}-${i}`}
              className="border-b border-slate-100 px-3 py-2.5 text-sm text-slate-700 last:border-b-0"
            >
              {text}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function Stepper({
  label,
  index,
  total,
  onPrev,
  onNext,
}: {
  label: string
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10"
        disabled={total === 0 || index <= 0}
        onClick={onPrev}
        aria-label="이전"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <p className="text-sm font-medium text-slate-700">
        {label}{" "}
        <span className="tabular-nums text-[#002065]">
          {total === 0 ? 0 : index + 1}
        </span>
        <span className="text-muted-foreground"> / {total}</span>
      </p>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10"
        disabled={total === 0 || index >= total - 1}
        onClick={onNext}
        aria-label="다음"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}

export function FormResponsesPanel({
  formId,
  formTitle,
  schema,
  responses,
}: FormResponsesPanelProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [questionIndex, setQuestionIndex] = useState(0)
  const [individualIndex, setIndividualIndex] = useState(0)
  const questions = useMemo(() => flattenQuestions(schema), [schema])
  const total = responses.length
  const fileStem = `form-${(formTitle || formId).replace(/[^\w가-힣-]+/g, "-").slice(0, 40)}-responses`

  const safeQuestionIndex = Math.min(questionIndex, Math.max(questions.length - 1, 0))
  const safeIndividualIndex = Math.min(individualIndex, Math.max(total - 1, 0))
  const currentQuestion = questions[safeQuestionIndex]
  const currentResponse = responses[safeIndividualIndex]

  const exportExcel = () => {
    if (total === 0) {
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
    if (total === 0) {
      toast.message("내보낼 응답이 없습니다.")
      return
    }
    const csv = buildResponsesCsv(schema, responses)
    downloadBlob(`${fileStem}.csv`, new Blob([csv], { type: "text/csv;charset=utf-8" }))
    toast.success("CSV 파일을 내려받았습니다.")
  }

  const removeResponse = (responseId: string) => {
    startTransition(async () => {
      try {
        await deleteResponse(formId, responseId)
        toast.success("응답을 삭제했습니다.")
        setIndividualIndex((i) => Math.max(0, i - (i >= total - 1 ? 1 : 0)))
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "삭제 실패")
      }
    })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-5 shadow-sm md:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Responses
          </p>
          <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight text-[#002065]">
            {total.toLocaleString("ko-KR")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">개의 응답</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="h-10 rounded-full">
            <Link href={`/admin/forms/${formId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              폼 편집
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full"
            onClick={exportCsv}
          >
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button
            type="button"
            className="h-10 rounded-full bg-[#002065] hover:bg-[#002065]/90"
            onClick={exportExcel}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            스프레드시트
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-5">
        <TabsList className="h-auto w-full justify-start gap-1 rounded-none border-b border-slate-200 bg-transparent p-0">
          {(
            [
              ["summary", "요약"],
              ["question", "질문"],
              ["individual", "개별"],
            ] as const
          ).map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                "rounded-none border-b-2 border-transparent px-4 py-3 text-sm shadow-none",
                "data-[state=active]:border-[#002065] data-[state=active]:bg-transparent data-[state=active]:text-[#002065] data-[state=active]:shadow-none",
              )}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="summary" className="mt-0 space-y-4">
          {total === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
              <p className="text-base font-medium text-slate-800">아직 응답이 없습니다</p>
              <p className="mt-1 text-sm text-muted-foreground">
                응답이 제출되면 질문별 요약 차트가 여기에 표시됩니다.
              </p>
            </div>
          ) : questions.length === 0 ? (
            <p className="text-sm text-muted-foreground">질문이 없는 폼입니다.</p>
          ) : (
            questions.map((question) => (
              <QuestionSummaryCard
                key={question.id}
                question={question}
                responses={responses}
                total={total}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="question" className="mt-0 space-y-4">
          <Stepper
            label="질문"
            index={safeQuestionIndex}
            total={questions.length}
            onPrev={() => setQuestionIndex((i) => Math.max(0, i - 1))}
            onNext={() => setQuestionIndex((i) => Math.min(questions.length - 1, i + 1))}
          />
          {currentQuestion ? (
            <QuestionSummaryCard
              question={currentQuestion}
              responses={responses}
              total={total}
            />
          ) : (
            <p className="text-sm text-muted-foreground">질문이 없습니다.</p>
          )}
        </TabsContent>

        <TabsContent value="individual" className="mt-0 space-y-4">
          <Stepper
            label="응답"
            index={safeIndividualIndex}
            total={total}
            onPrev={() => setIndividualIndex((i) => Math.max(0, i - 1))}
            onNext={() => setIndividualIndex((i) => Math.min(total - 1, i + 1))}
          />

          {!currentResponse ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
              <p className="text-base font-medium text-slate-800">개별 응답이 없습니다</p>
            </div>
          ) : (
            <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 md:px-6">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {currentResponse.respondent_email || "익명 응답"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(currentResponse.submitted_at).toLocaleString("ko-KR")}
                    {currentResponse.score != null ? ` · 점수 ${currentResponse.score}` : null}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={isPending}
                  onClick={() => removeResponse(currentResponse.id)}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  삭제
                </Button>
              </div>

              <div className="divide-y divide-slate-100">
                {questions.map((question) => {
                  const answer = formatAnswerForExport(
                    question,
                    answersOf(currentResponse)[question.id],
                  )
                  return (
                    <div key={question.id} className="px-5 py-4 md:px-6">
                      <p className="text-sm font-medium text-slate-900">{question.title}</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                        {answer || (
                          <span className="text-muted-foreground">응답 없음</span>
                        )}
                      </p>
                    </div>
                  )
                })}
              </div>
            </article>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
