import { flattenQuestions } from "@/lib/application-forms/parse"
import type { FormQuestion, FormSchema, FormSettings } from "@/lib/application-forms/types"

export type AnswerMap = Record<string, unknown>

function isFilled(value: unknown) {
  if (value == null) return false
  if (typeof value === "string") return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === "object") return Object.keys(value as object).length > 0
  return true
}

function validateOne(question: FormQuestion, value: unknown): string | null {
  if (question.required && !isFilled(value)) return "필수 항목입니다."

  if (!isFilled(value)) return null

  if (question.validation) {
    const text = String(value)
    const { kind, value: ruleValue } = question.validation
    if (kind === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      return "올바른 이메일을 입력해 주세요."
    }
    if (kind === "number" && Number.isNaN(Number(text))) {
      return "숫자를 입력해 주세요."
    }
    if (kind === "text_contains" && typeof ruleValue === "string" && !text.includes(ruleValue)) {
      return `"${ruleValue}"를 포함해야 합니다.`
    }
    if (kind === "min_length" && typeof ruleValue === "number" && text.length < ruleValue) {
      return `${ruleValue}자 이상 입력해 주세요.`
    }
    if (kind === "max_length" && typeof ruleValue === "number" && text.length > ruleValue) {
      return `${ruleValue}자 이하로 입력해 주세요.`
    }
  }

  if (question.type === "linear_scale") {
    const n = Number(value)
    const min = question.scaleMin ?? 1
    const max = question.scaleMax ?? 5
    if (!Number.isFinite(n) || n < min || n > max) {
      return `${min}~${max} 사이 값을 선택해 주세요.`
    }
  }

  if (
    (question.type === "multiple_choice_grid" || question.type === "checkbox_grid") &&
    question.required
  ) {
    const map = (value && typeof value === "object" ? value : {}) as Record<string, unknown>
    for (const row of question.rows ?? []) {
      if (!isFilled(map[row.id])) return "모든 행에 답변해 주세요."
    }
  }

  return null
}

function scoreQuestion(question: FormQuestion, value: unknown): number {
  if (!question.correctOptionIds?.length || !question.points) return 0
  const correct = new Set(question.correctOptionIds)

  if (question.type === "checkboxes") {
    const selected = Array.isArray(value) ? value.map(String) : []
    if (selected.length !== correct.size) return 0
    return selected.every((id) => correct.has(id)) ? question.points : 0
  }

  if (
    question.type === "multiple_choice" ||
    question.type === "dropdown"
  ) {
    return typeof value === "string" && correct.has(value) ? question.points : 0
  }

  return 0
}

export function validateAnswers(
  schema: FormSchema,
  settings: FormSettings,
  answers: AnswerMap,
  email?: string,
) {
  const errors: Record<string, string> = {}

  if (settings.collectEmail) {
    if (!email?.trim()) errors.__email = "이메일을 입력해 주세요."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.__email = "올바른 이메일을 입력해 주세요."
    }
  }

  for (const question of flattenQuestions(schema)) {
    const message = validateOne(question, answers[question.id])
    if (message) errors[question.id] = message
  }

  let score: number | undefined
  if (settings.isQuiz) {
    score = flattenQuestions(schema).reduce(
      (sum, question) => sum + scoreQuestion(question, answers[question.id]),
      0,
    )
  }

  return { ok: Object.keys(errors).length === 0, errors, score }
}

/** ponytail: tiny self-check, run via `npx tsx scripts/check-form-validation.ts` */
export function runValidateAnswersSelfCheck() {
  const schema: FormSchema = {
    sections: [
      {
        id: "s1",
        title: "A",
        items: [
          {
            id: "q1",
            type: "short_answer",
            title: "이름",
            required: true,
          },
          {
            id: "q2",
            type: "multiple_choice",
            title: "선택",
            options: [
              { id: "a", label: "A" },
              { id: "b", label: "B" },
            ],
            correctOptionIds: ["a"],
            points: 2,
          },
        ],
      },
    ],
  }

  const fail = validateAnswers(schema, { isQuiz: true }, {})
  if (fail.ok || !fail.errors.q1) throw new Error("required check failed")

  const pass = validateAnswers(schema, { isQuiz: true }, { q1: "홍길동", q2: "a" })
  if (!pass.ok || pass.score !== 2) throw new Error("quiz score failed")

  return true
}
