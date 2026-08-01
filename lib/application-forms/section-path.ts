import type {
  FormQuestion,
  FormSchema,
  FormSection,
  SectionNavTarget,
} from "@/lib/application-forms/types"

export type AnswerMap = Record<string, unknown>

export function resolveNextSection(
  target: SectionNavTarget | undefined,
  sections: FormSchema["sections"],
  currentIndex: number,
): number | "submit" {
  if (!target || target === "next") {
    return currentIndex + 1 < sections.length ? currentIndex + 1 : "submit"
  }
  if (target === "submit") return "submit"
  const idx = sections.findIndex((s) => s.id === target)
  return idx >= 0 ? idx : "submit"
}

/** 객관식/드롭다운 옵션별 이동 → 섹션 nextSectionId 순으로 다음 목적지를 찾는다. */
export function findBranchTarget(
  section: FormSection,
  answers: AnswerMap,
): SectionNavTarget | undefined {
  for (const question of section.items) {
    if (question.type !== "multiple_choice" && question.type !== "dropdown") continue
    const value = answers[question.id]
    if (typeof value !== "string" || !question.goToSectionByOption) continue
    const target = question.goToSectionByOption[value]
    if (target) return target
  }
  return section.nextSectionId
}

/** 답변 기준으로 시작 섹션부터 따라간 실제 방문 섹션 id 집합 */
export function collectVisitedSectionIds(
  schema: FormSchema,
  answers: AnswerMap,
): Set<string> {
  const visited = new Set<string>()
  let index = 0
  const maxSteps = schema.sections.length + 2

  for (let step = 0; step < maxSteps; step++) {
    if (index < 0 || index >= schema.sections.length) break
    const section = schema.sections[index]!
    if (visited.has(section.id)) break
    visited.add(section.id)

    const next = resolveNextSection(
      findBranchTarget(section, answers),
      schema.sections,
      index,
    )
    if (next === "submit") break
    index = next
  }

  return visited
}

export function questionsOnPath(
  schema: FormSchema,
  answers: AnswerMap,
): FormQuestion[] {
  const visited = collectVisitedSectionIds(schema, answers)
  return schema.sections
    .filter((section) => visited.has(section.id))
    .flatMap((section) => section.items)
}
