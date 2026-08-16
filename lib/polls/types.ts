import type { Json } from "@/types/database"

export type PollStatus = "draft" | "open" | "closed"

export type PollOption = {
  id: string
  label: string
}

export type PollQuestion = {
  id: string
  title: string
  allowMultiple: boolean
  maxSelections?: number
  options: PollOption[]
}

export type PollQuestions = PollQuestion[]

/** { [questionId]: optionId[] } */
export type VoteAnswers = Record<string, string[]>

/** RPC result shape returned by get_poll_results */
export type PollResults = {
  pollId: string
  status: PollStatus
  totalVoters: number
  questions: {
    questionId: string
    /** { [optionId]: count } */
    optionCounts: Record<string, number>
  }[]
}

// ── Parsing ─────────────────────────────────────────────────────────────────

function asRecord(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null
  return v as Record<string, unknown>
}

function parseOption(v: unknown): PollOption | null {
  const r = asRecord(v)
  if (!r || typeof r.id !== "string" || typeof r.label !== "string") return null
  return { id: r.id, label: r.label }
}

function parseQuestion(v: unknown): PollQuestion | null {
  const r = asRecord(v)
  if (!r || typeof r.id !== "string" || typeof r.title !== "string") return null
  const options = Array.isArray(r.options)
    ? (r.options as unknown[]).map(parseOption).filter((o): o is PollOption => o !== null)
    : []
  return {
    id: r.id,
    title: r.title,
    allowMultiple: Boolean(r.allowMultiple),
    maxSelections: typeof r.maxSelections === "number" ? r.maxSelections : undefined,
    options,
  }
}

export function parsePollQuestions(raw: Json): PollQuestion[] {
  if (!Array.isArray(raw)) return []
  return (raw as unknown[]).map(parseQuestion).filter((q): q is PollQuestion => q !== null)
}

export function parsePollResults(raw: Json): PollResults | null {
  const r = asRecord(raw)
  if (!r) return null
  const questions = Array.isArray(r.questions)
    ? (r.questions as unknown[]).map((q) => {
        const qr = asRecord(q)
        if (!qr || typeof qr.questionId !== "string") return null
        const counts = asRecord(qr.optionCounts) ?? {}
        const optionCounts: Record<string, number> = Object.fromEntries(
          Object.entries(counts).map(([k, v]) => [k, typeof v === "number" ? v : 0]),
        )
        return { questionId: qr.questionId as string, optionCounts }
      }).filter((q): q is { questionId: string; optionCounts: Record<string, number> } => q !== null)
    : []
  return {
    pollId: String(r.pollId ?? ""),
    status: (r.status as PollStatus) ?? "closed",
    totalVoters: typeof r.totalVoters === "number" ? r.totalVoters : 0,
    questions,
  }
}

// ── Validation ───────────────────────────────────────────────────────────────

export type AnswerValidationError = {
  questionId: string
  message: string
}

export function validateVoteAnswers(
  questions: PollQuestion[],
  answers: VoteAnswers,
): AnswerValidationError[] {
  const errors: AnswerValidationError[] = []
  for (const q of questions) {
    const selected = answers[q.id] ?? []
    if (selected.length === 0) {
      errors.push({ questionId: q.id, message: "항목을 선택해 주세요." })
      continue
    }
    if (!q.allowMultiple && selected.length > 1) {
      errors.push({ questionId: q.id, message: "하나만 선택할 수 있습니다." })
    }
    if (q.allowMultiple && q.maxSelections && selected.length > q.maxSelections) {
      errors.push({ questionId: q.id, message: `최대 ${q.maxSelections}개까지 선택할 수 있습니다.` })
    }
    const validIds = new Set(q.options.map((o) => o.id))
    for (const id of selected) {
      if (!validIds.has(id)) {
        errors.push({ questionId: q.id, message: "유효하지 않은 선택지입니다." })
        break
      }
    }
  }
  return errors
}

export function publicPollPath(slug: string) {
  return `/vote/${slug}`
}
