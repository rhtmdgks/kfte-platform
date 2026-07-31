export type QuestionType =
  | "short_answer"
  | "paragraph"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "linear_scale"
  | "multiple_choice_grid"
  | "checkbox_grid"
  | "date"
  | "time"
  | "file_upload"

export type SectionNavTarget = string | "submit" | "next"

export type FormOption = {
  id: string
  label: string
}

export type FormValidation = {
  kind: "email" | "number" | "text_contains" | "min_length" | "max_length"
  value?: string | number
}

export type FormQuestion = {
  id: string
  type: QuestionType
  title: string
  description?: string
  required?: boolean
  options?: FormOption[]
  allowOther?: boolean
  shuffleOptions?: boolean
  scaleMin?: number
  scaleMax?: number
  scaleMinLabel?: string
  scaleMaxLabel?: string
  rows?: FormOption[]
  columns?: FormOption[]
  goToSectionByOption?: Record<string, SectionNavTarget>
  points?: number
  correctOptionIds?: string[]
  answerExplanation?: string
  validation?: FormValidation
}

export type FormSection = {
  id: string
  title: string
  description?: string
  items: FormQuestion[]
  nextSectionId?: SectionNavTarget
}

export type FormSchema = {
  sections: FormSection[]
}

export type FormSettings = {
  confirmationMessage?: string
  showProgressBar?: boolean
  collectEmail?: boolean
  allowResponseEditing?: boolean
  isQuiz?: boolean
  notifyEmail?: string
  shuffleQuestions?: boolean
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  short_answer: "단답형",
  paragraph: "장문형",
  multiple_choice: "객관식",
  checkboxes: "체크박스",
  dropdown: "드롭다운",
  linear_scale: "선형 배율",
  multiple_choice_grid: "객관식 그리드",
  checkbox_grid: "체크박스 그리드",
  date: "날짜",
  time: "시간",
  file_upload: "파일 업로드",
}

export function newId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function createOption(label = "옵션"): FormOption {
  return { id: newId("opt"), label }
}

export function createQuestion(type: QuestionType = "short_answer"): FormQuestion {
  const base: FormQuestion = {
    id: newId("q"),
    type,
    title: "질문",
    required: false,
  }

  switch (type) {
    case "multiple_choice":
    case "checkboxes":
    case "dropdown":
      return {
        ...base,
        options: [createOption("옵션 1"), createOption("옵션 2")],
        allowOther: type !== "dropdown",
      }
    case "linear_scale":
      return { ...base, scaleMin: 1, scaleMax: 5, scaleMinLabel: "", scaleMaxLabel: "" }
    case "multiple_choice_grid":
    case "checkbox_grid":
      return {
        ...base,
        rows: [createOption("행 1"), createOption("행 2")],
        columns: [createOption("열 1"), createOption("열 2")],
      }
    default:
      return base
  }
}

export function createSection(title = "섹션 1"): FormSection {
  return {
    id: newId("s"),
    title,
    description: "",
    items: [createQuestion("short_answer")],
    nextSectionId: "next",
  }
}

export function createEmptySchema(): FormSchema {
  return {
    sections: [createSection("섹션 1")],
  }
}

export function createDefaultSettings(): FormSettings {
  return {
    confirmationMessage: "응답이 기록되었습니다.",
    showProgressBar: true,
    collectEmail: false,
    allowResponseEditing: false,
    isQuiz: false,
  }
}

export function publicFormPath(slug: string) {
  return `/apply/${slug}`
}
