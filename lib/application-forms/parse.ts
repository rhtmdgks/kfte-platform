import type { Json } from "@/types/database"
import {
  createDefaultSettings,
  createEmptySchema,
  type FormQuestion,
  type FormSchema,
  type FormSection,
  type FormSettings,
  type QuestionType,
  type SectionNavTarget,
} from "@/lib/application-forms/types"

const QUESTION_TYPES = new Set<QuestionType>([
  "short_answer",
  "paragraph",
  "multiple_choice",
  "checkboxes",
  "dropdown",
  "linear_scale",
  "multiple_choice_grid",
  "checkbox_grid",
  "date",
  "time",
  "file_upload",
])

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function parseOptions(value: unknown) {
  if (!Array.isArray(value)) return undefined
  return value
    .map((item) => {
      const row = asRecord(item)
      if (!row || typeof row.id !== "string" || typeof row.label !== "string") return null
      return { id: row.id, label: row.label }
    })
    .filter((item): item is { id: string; label: string } => Boolean(item))
}

function parseQuestion(value: unknown): FormQuestion | null {
  const row = asRecord(value)
  if (!row || typeof row.id !== "string" || typeof row.title !== "string") return null
  if (typeof row.type !== "string" || !QUESTION_TYPES.has(row.type as QuestionType)) return null

  const goTo = asRecord(row.goToSectionByOption)
  const goToSectionByOption = goTo
    ? Object.fromEntries(
        Object.entries(goTo).filter(
          (entry): entry is [string, SectionNavTarget] =>
            typeof entry[1] === "string",
        ),
      )
    : undefined

  const validationRow = asRecord(row.validation)
  const validation =
    validationRow && typeof validationRow.kind === "string"
      ? {
          kind: validationRow.kind as NonNullable<FormQuestion["validation"]>["kind"],
          value:
            typeof validationRow.value === "string" || typeof validationRow.value === "number"
              ? validationRow.value
              : undefined,
        }
      : undefined

  return {
    id: row.id,
    type: row.type as QuestionType,
    title: row.title,
    description: typeof row.description === "string" ? row.description : undefined,
    required: Boolean(row.required),
    options: parseOptions(row.options),
    allowOther: Boolean(row.allowOther),
    shuffleOptions: Boolean(row.shuffleOptions),
    scaleMin: typeof row.scaleMin === "number" ? row.scaleMin : undefined,
    scaleMax: typeof row.scaleMax === "number" ? row.scaleMax : undefined,
    scaleMinLabel: typeof row.scaleMinLabel === "string" ? row.scaleMinLabel : undefined,
    scaleMaxLabel: typeof row.scaleMaxLabel === "string" ? row.scaleMaxLabel : undefined,
    rows: parseOptions(row.rows),
    columns: parseOptions(row.columns),
    goToSectionByOption,
    points: typeof row.points === "number" ? row.points : undefined,
    correctOptionIds: Array.isArray(row.correctOptionIds)
      ? row.correctOptionIds.filter((id): id is string => typeof id === "string")
      : undefined,
    answerExplanation:
      typeof row.answerExplanation === "string" ? row.answerExplanation : undefined,
    validation,
  }
}

function parseSection(value: unknown): FormSection | null {
  const row = asRecord(value)
  if (!row || typeof row.id !== "string") return null
  const items = Array.isArray(row.items)
    ? row.items.map(parseQuestion).filter((q): q is FormQuestion => Boolean(q))
    : []

  return {
    id: row.id,
    title: typeof row.title === "string" ? row.title : "",
    description: typeof row.description === "string" ? row.description : undefined,
    items,
    nextSectionId:
      typeof row.nextSectionId === "string"
        ? (row.nextSectionId as SectionNavTarget)
        : "next",
  }
}

export function parseFormSchema(json: Json | null | undefined): FormSchema {
  const row = asRecord(json)
  if (!row || !Array.isArray(row.sections)) return createEmptySchema()
  const sections = row.sections.map(parseSection).filter((s): s is FormSection => Boolean(s))
  return sections.length > 0 ? { sections } : createEmptySchema()
}

export function parseFormSettings(json: Json | null | undefined): FormSettings {
  const defaults = createDefaultSettings()
  const row = asRecord(json)
  if (!row) return defaults
  return {
    confirmationMessage:
      typeof row.confirmationMessage === "string"
        ? row.confirmationMessage
        : defaults.confirmationMessage,
    showProgressBar:
      typeof row.showProgressBar === "boolean"
        ? row.showProgressBar
        : defaults.showProgressBar,
    collectEmail: Boolean(row.collectEmail),
    allowResponseEditing: Boolean(row.allowResponseEditing),
    isQuiz: Boolean(row.isQuiz),
    notifyEmail: typeof row.notifyEmail === "string" ? row.notifyEmail : undefined,
    shuffleQuestions: Boolean(row.shuffleQuestions),
  }
}

export function slugifyFormTitle(title: string) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
  return base || `form-${Date.now().toString(36)}`
}

export function flattenQuestions(schema: FormSchema): FormQuestion[] {
  return schema.sections.flatMap((section) => section.items)
}
