import { flattenQuestions } from "@/lib/application-forms/parse"
import type { FormQuestion, FormSchema } from "@/lib/application-forms/types"
import type { Json } from "@/types/database"

export type ExportableResponse = {
  submitted_at: string
  respondent_email?: string | null
  score?: number | null
  answers: Json
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function optionLabel(question: FormQuestion, id: string) {
  const fromOptions = question.options?.find((o) => o.id === id)?.label
  if (fromOptions) return fromOptions
  if (id.startsWith("__other__:")) return `기타: ${id.slice("__other__:".length)}`
  if (id === "__other__") return "기타"
  return id
}

export function formatAnswerForExport(question: FormQuestion, value: unknown): string {
  if (value == null) return ""

  if (
    question.type === "multiple_choice" ||
    question.type === "dropdown"
  ) {
    return typeof value === "string" ? optionLabel(question, value) : String(value)
  }

  if (question.type === "checkboxes" && Array.isArray(value)) {
    return value.map((id) => optionLabel(question, String(id))).join(", ")
  }

  if (
    (question.type === "multiple_choice_grid" || question.type === "checkbox_grid") &&
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    const map = value as Record<string, unknown>
    const rowLabels = new Map((question.rows ?? []).map((r) => [r.id, r.label]))
    const colLabels = new Map((question.columns ?? []).map((c) => [c.id, c.label]))
    return Object.entries(map)
      .map(([rowId, cell]) => {
        const row = rowLabels.get(rowId) ?? rowId
        if (Array.isArray(cell)) {
          return `${row}: ${cell.map((id) => colLabels.get(String(id)) ?? String(id)).join(", ")}`
        }
        return `${row}: ${colLabels.get(String(cell)) ?? String(cell)}`
      })
      .join(" | ")
  }

  if (typeof value === "string" || typeof value === "number") return String(value)
  if (Array.isArray(value)) return value.map(String).join(", ")
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function asAnswerMap(answers: Json): Record<string, unknown> {
  if (answers && typeof answers === "object" && !Array.isArray(answers)) {
    return answers as Record<string, unknown>
  }
  return {}
}

function buildRows(schema: FormSchema, responses: ExportableResponse[]) {
  const questions = flattenQuestions(schema)
  const headers = ["제출 시각", "이메일", "점수", ...questions.map((q) => q.title || q.id)]
  const rows = responses.map((response) => {
    const answers = asAnswerMap(response.answers)
    return [
      new Date(response.submitted_at).toLocaleString("ko-KR"),
      response.respondent_email ?? "",
      response.score ?? "",
      ...questions.map((q) => formatAnswerForExport(q, answers[q.id])),
    ]
  })
  return { headers, rows }
}

/** Excel-compatible SpreadsheetML (.xls). No extra dependency. */
export function buildResponsesExcelXml(schema: FormSchema, responses: ExportableResponse[]) {
  const { headers, rows } = buildRows(schema, responses)
  const cell = (value: string | number) =>
    `<Cell><Data ss:Type="${typeof value === "number" ? "Number" : "String"}">${escapeXml(String(value))}</Data></Cell>`

  const headerRow = `<Row>${headers.map((h) => cell(h)).join("")}</Row>`
  const bodyRows = rows
    .map((row) => `<Row>${row.map((v) => cell(typeof v === "number" ? v : String(v))).join("")}</Row>`)
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="응답">
  <Table>
   ${headerRow}
   ${bodyRows}
  </Table>
 </Worksheet>
</Workbook>`
}

export function buildResponsesCsv(schema: FormSchema, responses: ExportableResponse[]) {
  const { headers, rows } = buildRows(schema, responses)
  const lines = [
    headers.map((h) => `"${h.replaceAll('"', '""')}"`).join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    ),
  ]
  return `\uFEFF${lines.join("\n")}`
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
