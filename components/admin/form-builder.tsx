"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronUp,
  Circle,
  ClipboardList,
  Copy,
  ExternalLink,
  GripVertical,
  Loader2,
  Plus,
  Settings2,
  Square,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { deleteForm, updateForm } from "@/app/admin/forms/actions"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { MarkdownText } from "@/components/markdown-text"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  QUESTION_TYPE_LABELS,
  createOption,
  createQuestion,
  createSection,
  newId,
  publicFormPath,
  type FormQuestion,
  type FormSchema,
  type FormSettings,
  type QuestionType,
} from "@/lib/application-forms/types"
import { cn } from "@/lib/utils"
import type { Tables } from "@/types/database"

type FormRow = Tables<"application_forms">

type FormBuilderProps = {
  form: FormRow
  initialSchema: FormSchema
  initialSettings: FormSettings
  responseCount: number
}

const TYPE_OPTIONS = Object.entries(QUESTION_TYPE_LABELS) as [QuestionType, string][]

const controlClass =
  "h-11 rounded-xl border-slate-200/80 bg-white/80 shadow-none focus-visible:ring-[#002065]/25"

const cardClass =
  "rounded-2xl border border-slate-200/80 bg-white shadow-sm"

const SECTION_MIME = "application/x-kfte-section"
const QUESTION_MIME = "application/x-kfte-question"

function reorder<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list
  }
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function hasDragType(types: DOMStringList | readonly string[], mime: string) {
  const wanted = mime.toLowerCase()
  return Array.from(types as ArrayLike<string>).some((t) => t.toLowerCase() === wanted)
}

export function FormBuilder({
  form,
  initialSchema,
  initialSettings,
  responseCount,
}: FormBuilderProps) {
  const router = useRouter()
  const [title, setTitle] = useState(form.title)
  const [description, setDescription] = useState(form.description ?? "")
  const [slug, setSlug] = useState(form.slug)
  const [status, setStatus] = useState(form.status)
  const [schema, setSchema] = useState<FormSchema>(initialSchema)
  const [settings, setSettings] = useState<FormSettings>(initialSettings)
  const [isPending, startTransition] = useTransition()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [formDescOpen, setFormDescOpen] = useState(Boolean(form.description))
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [confirmMsgOpen, setConfirmMsgOpen] = useState(false)
  const [sectionMetaOpen, setSectionMetaOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      initialSchema.sections.map((s) => [s.id, Boolean(s.description)]),
    ),
  )
  const [draggingSectionId, setDraggingSectionId] = useState<string | null>(null)
  const [overSectionId, setOverSectionId] = useState<string | null>(null)
  const [draggingQuestion, setDraggingQuestion] = useState<{
    sectionId: string
    questionId: string
  } | null>(null)
  const [overQuestion, setOverQuestion] = useState<{
    sectionId: string
    questionId: string
  } | null>(null)

  const publicUrl = useMemo(() => {
    if (typeof window === "undefined") return publicFormPath(slug)
    return `${window.location.origin}${publicFormPath(slug)}`
  }, [slug])

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    patch: Partial<FormQuestion>,
  ) => {
    setSchema((prev) => ({
      sections: prev.sections.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: section.items.map((item) =>
                item.id === questionId ? { ...item, ...patch } : item,
              ),
            },
      ),
    }))
  }

  const replaceQuestionType = (
    sectionId: string,
    questionId: string,
    type: QuestionType,
  ) => {
    const next = createQuestion(type)
    setSchema((prev) => ({
      sections: prev.sections.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: section.items.map((item) =>
                item.id === questionId
                  ? { ...next, id: item.id, title: item.title, required: item.required }
                  : item,
              ),
            },
      ),
    }))
  }

  const moveSection = (fromId: string, toId: string) => {
    setSchema((prev) => {
      const from = prev.sections.findIndex((s) => s.id === fromId)
      const to = prev.sections.findIndex((s) => s.id === toId)
      if (from < 0 || to < 0 || from === to) return prev
      return { sections: reorder(prev.sections, from, to) }
    })
  }

  const moveQuestion = (
    fromSectionId: string,
    questionId: string,
    toSectionId: string,
    toQuestionId: string,
  ) => {
    setSchema((prev) => {
      const fromSection = prev.sections.find((s) => s.id === fromSectionId)
      const toSection = prev.sections.find((s) => s.id === toSectionId)
      if (!fromSection || !toSection) return prev

      const fromIndex = fromSection.items.findIndex((q) => q.id === questionId)
      const toIndex = toSection.items.findIndex((q) => q.id === toQuestionId)
      if (fromIndex < 0 || toIndex < 0) return prev
      if (fromSectionId === toSectionId && fromIndex === toIndex) return prev

      if (fromSectionId === toSectionId) {
        return {
          sections: prev.sections.map((s) =>
            s.id === fromSectionId
              ? { ...s, items: reorder(s.items, fromIndex, toIndex) }
              : s,
          ),
        }
      }

      const question = fromSection.items[fromIndex]
      return {
        sections: prev.sections.map((s) => {
          if (s.id === fromSectionId) {
            return { ...s, items: s.items.filter((q) => q.id !== questionId) }
          }
          if (s.id === toSectionId) {
            const items = [...s.items]
            items.splice(toIndex, 0, question)
            return { ...s, items }
          }
          return s
        }),
      }
    })
  }

  const handleSave = () => {
    const fd = new FormData()
    fd.set("title", title)
    fd.set("description", description)
    fd.set("slug", slug)
    fd.set("status", status)
    fd.set("schema", JSON.stringify(schema))
    fd.set("settings", JSON.stringify(settings))

    startTransition(async () => {
      try {
        await updateForm(form.id, fd)
        toast.success("저장되었습니다.")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "저장에 실패했습니다.")
      }
    })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-24">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-full border-slate-200"
        >
          <Link href={`/admin/forms/${form.id}/responses`}>
            <ClipboardList className="mr-2 h-4 w-4" />
            모집 현황 {responseCount}건
          </Link>
        </Button>
        <Button
          variant="outline"
          type="button"
          className="h-10 rounded-full border-slate-200"
          onClick={() => {
            void navigator.clipboard.writeText(publicUrl)
            toast.success("공개 URL을 복사했습니다.")
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          URL 복사
        </Button>
        <Button asChild variant="outline" className="h-10 rounded-full border-slate-200">
          <Link href={publicFormPath(slug)} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            미리보기
          </Link>
        </Button>
        <Button
          variant="ghost"
          type="button"
          className="ml-auto h-10 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          삭제
        </Button>
      </div>

      {/* Google Forms–style title card */}
      <section className={cn(cardClass, "overflow-hidden")}>
        <div className="h-2.5 bg-[#002065]" />
        <div className="space-y-3 p-5 md:p-6">
          <Input
            id="form-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="폼 제목"
            className="h-auto border-0 border-b border-transparent bg-transparent px-0 text-2xl font-bold text-[#002065] shadow-none rounded-none focus-visible:border-[#002065] focus-visible:ring-0"
          />
          <div className="grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="form-slug" className="text-xs text-muted-foreground">
                공개 URL 슬러그
              </Label>
              <Input
                id="form-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={controlClass}
              />
              <p className="text-xs text-muted-foreground">{publicFormPath(slug)}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">상태</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger className={controlClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">임시저장</SelectItem>
                  <SelectItem value="published">게시됨</SelectItem>
                  <SelectItem value="closed">마감</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFormDescOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100/80"
            aria-expanded={formDescOpen}
          >
            <span>
              폼 설명
              {!formDescOpen && description ? (
                <span className="ml-2 text-xs text-muted-foreground">작성됨</span>
              ) : null}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                formDescOpen && "rotate-180",
              )}
            />
          </button>
          {formDescOpen ? (
            <div className="space-y-3">
              <Textarea
                id="form-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  "마크다운 지원 · URL은 자동 링크\n예: **강조**, [안내](https://kfte.kr), https://kfte.kr"
                }
                rows={6}
                className="min-h-[140px] resize-y rounded-xl border-slate-200/80 bg-white/80 text-sm text-slate-600 shadow-none focus-visible:ring-[#002065]/25"
              />
              {description.trim() ? (
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    미리보기
                  </p>
                  <MarkdownText>{description}</MarkdownText>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {schema.sections.map((section, sectionIndex) => {
        const metaOpen = sectionMetaOpen[section.id] ?? false
        const sectionDragging = draggingSectionId === section.id
        const sectionOver =
          overSectionId === section.id &&
          draggingSectionId != null &&
          draggingSectionId !== section.id
        return (
        <section
          key={section.id}
          className={cn(
            "space-y-3 rounded-2xl transition-[box-shadow,opacity] duration-150",
            sectionDragging && "opacity-50",
            sectionOver && "ring-2 ring-[#002065]/35 ring-offset-2",
          )}
          onDragOver={(event) => {
            if (!hasDragType(event.dataTransfer.types, SECTION_MIME)) return
            event.preventDefault()
            event.dataTransfer.dropEffect = "move"
            setOverSectionId(section.id)
          }}
          onDragLeave={(event) => {
            if (event.currentTarget.contains(event.relatedTarget as Node)) return
            setOverSectionId((id) => (id === section.id ? null : id))
          }}
          onDrop={(event) => {
            if (!hasDragType(event.dataTransfer.types, SECTION_MIME)) return
            event.preventDefault()
            const fromId = event.dataTransfer.getData(SECTION_MIME)
            if (fromId) moveSection(fromId, section.id)
            setDraggingSectionId(null)
            setOverSectionId(null)
          }}
        >
          <div className={cn(cardClass, "overflow-hidden")}>
            <div className="flex items-stretch">
              <div className="w-1.5 shrink-0 bg-[#002065]/70" aria-hidden />
              <div className="flex flex-1 items-start gap-2 p-5 md:gap-3 md:p-6">
                <div className="mt-1 flex shrink-0 flex-col items-center gap-0.5">
                  <button
                    type="button"
                    draggable={schema.sections.length > 1}
                    onDragStart={(event) => {
                      event.dataTransfer.setData(SECTION_MIME, section.id)
                      event.dataTransfer.effectAllowed = "move"
                      setDraggingSectionId(section.id)
                    }}
                    onDragEnd={() => {
                      setDraggingSectionId(null)
                      setOverSectionId(null)
                    }}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg text-slate-400",
                      schema.sections.length > 1
                        ? "cursor-grab hover:bg-slate-100 hover:text-[#002065] active:cursor-grabbing"
                        : "cursor-default opacity-40",
                    )}
                    aria-label="섹션 끌어 순서 변경"
                    title="끌어다 놓아 섹션 순서 변경"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                  {schema.sections.length > 1 ? (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400"
                        disabled={sectionIndex === 0}
                        onClick={() =>
                          moveSection(section.id, schema.sections[sectionIndex - 1]!.id)
                        }
                        aria-label="섹션 위로"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400"
                        disabled={sectionIndex >= schema.sections.length - 1}
                        onClick={() =>
                          moveSection(section.id, schema.sections[sectionIndex + 1]!.id)
                        }
                        aria-label="섹션 아래로"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      섹션 {sectionIndex + 1}
                    </p>
                    {schema.sections.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-400 hover:text-red-600"
                        onClick={() =>
                          setSchema((prev) => ({
                            sections: prev.sections.filter((s) => s.id !== section.id),
                          }))
                        }
                        aria-label="섹션 삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                  <Input
                    value={section.title}
                    onChange={(e) =>
                      setSchema((prev) => ({
                        sections: prev.sections.map((s) =>
                          s.id === section.id ? { ...s, title: e.target.value } : s,
                        ),
                      }))
                    }
                    placeholder="섹션 제목"
                    className="h-auto border-0 border-b border-transparent bg-transparent px-0 text-lg font-semibold shadow-none rounded-none focus-visible:border-[#002065] focus-visible:ring-0"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setSectionMetaOpen((prev) => ({
                        ...prev,
                        [section.id]: !metaOpen,
                      }))
                    }
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100/80"
                    aria-expanded={metaOpen}
                  >
                    <span>
                      섹션 설명 · 다음 이동
                      {!metaOpen && section.description ? (
                        <span className="ml-2 text-xs text-muted-foreground">설명 있음</span>
                      ) : null}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                        metaOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {metaOpen ? (
                    <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          섹션 설명 (마크다운 · URL 자동 링크)
                        </Label>
                        <Textarea
                          value={section.description ?? ""}
                          onChange={(e) =>
                            setSchema((prev) => ({
                              sections: prev.sections.map((s) =>
                                s.id === section.id
                                  ? { ...s, description: e.target.value }
                                  : s,
                              ),
                            }))
                          }
                          placeholder={
                            "예: 자세한 안내는 https://kfte.kr 또는 [여기](https://kfte.kr)"
                          }
                          rows={6}
                          className="min-h-[140px] resize-y rounded-xl border-slate-200/80 bg-white text-sm shadow-none focus-visible:ring-[#002065]/25"
                        />
                        {(section.description ?? "").trim() ? (
                          <div className="rounded-xl border border-slate-100 bg-white p-3">
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                              미리보기
                            </p>
                            <MarkdownText>{section.description ?? ""}</MarkdownText>
                          </div>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">다음 섹션</Label>
                        <Select
                          value={section.nextSectionId ?? "next"}
                          onValueChange={(value) =>
                            setSchema((prev) => ({
                              sections: prev.sections.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      nextSectionId: value as typeof s.nextSectionId,
                                    }
                                  : s,
                              ),
                            }))
                          }
                        >
                          <SelectTrigger className={cn(controlClass, "max-w-xs bg-white")}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="next">다음 섹션</SelectItem>
                            <SelectItem value="submit">제출</SelectItem>
                            {schema.sections
                              .filter((s) => s.id !== section.id)
                              .map((s, i) => (
                                <SelectItem key={s.id} value={s.id}>
                                  섹션{" "}
                                  {schema.sections.findIndex((x) => x.id === s.id) + 1}:{" "}
                                  {s.title || `섹션 ${i + 1}`}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {section.items.map((question, questionIndex) => {
              const qDragging =
                draggingQuestion?.sectionId === section.id &&
                draggingQuestion.questionId === question.id
              const qOver =
                overQuestion?.sectionId === section.id &&
                overQuestion.questionId === question.id &&
                draggingQuestion != null &&
                !(
                  draggingQuestion.sectionId === section.id &&
                  draggingQuestion.questionId === question.id
                )
              return (
              <div
                key={question.id}
                className={cn(
                  "rounded-2xl transition-[box-shadow,opacity] duration-150",
                  qDragging && "opacity-50",
                  qOver && "ring-2 ring-[#002065]/35 ring-offset-2",
                )}
                onDragOver={(event) => {
                  if (!hasDragType(event.dataTransfer.types, QUESTION_MIME)) return
                  event.preventDefault()
                  event.stopPropagation()
                  event.dataTransfer.dropEffect = "move"
                  setOverQuestion({ sectionId: section.id, questionId: question.id })
                }}
                onDragLeave={(event) => {
                  if (event.currentTarget.contains(event.relatedTarget as Node)) return
                  setOverQuestion((current) =>
                    current?.questionId === question.id ? null : current,
                  )
                }}
                onDrop={(event) => {
                  if (!hasDragType(event.dataTransfer.types, QUESTION_MIME)) return
                  event.preventDefault()
                  event.stopPropagation()
                  const payload = event.dataTransfer.getData(QUESTION_MIME)
                  const [fromSectionId, fromQuestionId] = payload.split(":")
                  if (fromSectionId && fromQuestionId) {
                    moveQuestion(
                      fromSectionId,
                      fromQuestionId,
                      section.id,
                      question.id,
                    )
                  }
                  setDraggingQuestion(null)
                  setOverQuestion(null)
                }}
              >
              <QuestionEditor
                question={question}
                sections={schema.sections}
                isQuiz={Boolean(settings.isQuiz)}
                canReorder={section.items.length > 1 || schema.sections.length > 1}
                canMoveUp={questionIndex > 0}
                canMoveDown={questionIndex < section.items.length - 1}
                onMoveUp={() =>
                  moveQuestion(
                    section.id,
                    question.id,
                    section.id,
                    section.items[questionIndex - 1]!.id,
                  )
                }
                onMoveDown={() =>
                  moveQuestion(
                    section.id,
                    question.id,
                    section.id,
                    section.items[questionIndex + 1]!.id,
                  )
                }
                onDragHandleStart={(event) => {
                  event.dataTransfer.setData(
                    QUESTION_MIME,
                    `${section.id}:${question.id}`,
                  )
                  event.dataTransfer.effectAllowed = "move"
                  setDraggingQuestion({
                    sectionId: section.id,
                    questionId: question.id,
                  })
                }}
                onDragHandleEnd={() => {
                  setDraggingQuestion(null)
                  setOverQuestion(null)
                }}
                onChange={(patch) => updateQuestion(section.id, question.id, patch)}
                onTypeChange={(type) => replaceQuestionType(section.id, question.id, type)}
                onDelete={() =>
                  setSchema((prev) => ({
                    sections: prev.sections.map((s) =>
                      s.id !== section.id
                        ? s
                        : { ...s, items: s.items.filter((q) => q.id !== question.id) },
                    ),
                  }))
                }
                onDuplicate={() =>
                  setSchema((prev) => ({
                    sections: prev.sections.map((s) =>
                      s.id !== section.id
                        ? s
                        : {
                            ...s,
                            items: [
                              ...s.items,
                              {
                                ...question,
                                id: newId("q"),
                                options: question.options?.map((o) => ({
                                  ...o,
                                  id: newId("opt"),
                                })),
                              },
                            ],
                          },
                    ),
                  }))
                }
              />
              </div>
              )
            })}

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-2xl border-dashed border-slate-300 bg-white/70 text-[#002065] hover:border-[#002065]/40 hover:bg-[#002065]/5"
              onClick={() =>
                setSchema((prev) => ({
                  sections: prev.sections.map((s) =>
                    s.id === section.id
                      ? { ...s, items: [...s.items, createQuestion("short_answer")] }
                      : s,
                  ),
                }))
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              질문 추가
            </Button>
          </div>
        </section>
        )
      })}

      <Button
        type="button"
        variant="secondary"
        className="h-11 w-full rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200"
        onClick={() => {
          const next = createSection(`섹션 ${schema.sections.length + 1}`)
          setSchema((prev) => ({
            sections: [...prev.sections, next],
          }))
          setSectionMetaOpen((prev) => ({ ...prev, [next.id]: true }))
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        섹션 추가
      </Button>

      <section className={cn(cardClass, "overflow-hidden")}>
        <button
          type="button"
          onClick={() => setSettingsOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left md:px-6"
          aria-expanded={settingsOpen}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002065]/10 text-[#002065]">
              <Settings2 className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-[#002065]">설정</h2>
              <p className="text-xs text-muted-foreground">수집·알림·퀴즈 옵션</p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
              settingsOpen && "rotate-180",
            )}
          />
        </button>
        {settingsOpen ? (
          <div className="space-y-4 border-t border-slate-100 px-5 pb-5 pt-4 md:px-6 md:pb-6">
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["showProgressBar", "진행률 표시"],
                  ["collectEmail", "이메일 수집"],
                  ["allowResponseEditing", "제출 후 수정 허용"],
                  ["isQuiz", "퀴즈 모드"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3"
                >
                  <span className="text-sm text-slate-700">{label}</span>
                  <Switch
                    checked={Boolean(settings[key])}
                    onCheckedChange={(checked) =>
                      setSettings((s) => ({ ...s, [key]: checked }))
                    }
                  />
                </label>
              ))}
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">새 응답 알림 이메일</Label>
              <Input
                type="email"
                value={settings.notifyEmail ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, notifyEmail: e.target.value }))
                }
                placeholder="admin@kfte.kr"
                className={cn(controlClass, "max-w-md")}
              />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setConfirmMsgOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100/80"
                aria-expanded={confirmMsgOpen}
              >
                <span>
                  확인 메시지
                  {!confirmMsgOpen && (settings.confirmationMessage ?? "").trim() ? (
                    <span className="ml-2 text-xs text-muted-foreground">작성됨</span>
                  ) : null}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                    confirmMsgOpen && "rotate-180",
                  )}
                />
              </button>
              {confirmMsgOpen ? (
                <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                  <Label className="text-xs text-muted-foreground">
                    제출 완료 화면 메시지 (마크다운 · URL 자동 링크)
                  </Label>
                  <Textarea
                    value={settings.confirmationMessage ?? ""}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        confirmationMessage: e.target.value,
                      }))
                    }
                    placeholder={
                      "예: 신청이 완료되었습니다.\n자세한 안내는 https://kfte.kr 또는 [여기](https://kfte.kr)"
                    }
                    rows={6}
                    className="min-h-[140px] resize-y rounded-xl border-slate-200/80 bg-white text-sm shadow-none focus-visible:ring-[#002065]/25"
                  />
                  {(settings.confirmationMessage ?? "").trim() ? (
                    <div className="rounded-xl border border-slate-100 bg-white p-3">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        미리보기
                      </p>
                      <MarkdownText>{settings.confirmationMessage ?? ""}</MarkdownText>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>

      <div className="glass-pane sticky bottom-3 z-20 flex items-center justify-between gap-3 rounded-2xl border border-white/60 px-4 py-3 shadow-[0_12px_40px_-20px_rgba(0,32,101,0.35)] md:px-5">
        <p className="hidden text-sm text-muted-foreground sm:block">
          변경 사항을 저장해야 공개 폼에 반영됩니다.
        </p>
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="ml-auto h-11 rounded-full bg-[#002065] px-6 font-semibold hover:bg-[#002065]/90"
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isPending ? "저장 중…" : "폼 저장"}
        </Button>
      </div>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="폼 삭제"
        description="폼과 모든 응답이 삭제됩니다. 계속할까요?"
        onConfirm={() => {
          startTransition(async () => {
            try {
              await deleteForm(form.id)
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "삭제 실패")
            }
          })
        }}
      />
    </div>
  )
}

function QuestionEditor({
  question,
  sections,
  isQuiz,
  canReorder,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDragHandleStart,
  onDragHandleEnd,
  onChange,
  onTypeChange,
  onDelete,
  onDuplicate,
}: {
  question: FormQuestion
  sections: FormSchema["sections"]
  isQuiz: boolean
  canReorder: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDragHandleStart: (event: React.DragEvent) => void
  onDragHandleEnd: () => void
  onChange: (patch: Partial<FormQuestion>) => void
  onTypeChange: (type: QuestionType) => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const hasOptions =
    question.type === "multiple_choice" ||
    question.type === "checkboxes" ||
    question.type === "dropdown"
  const canBranch =
    question.type === "multiple_choice" || question.type === "dropdown"
  const OptionIcon = question.type === "checkboxes" ? Square : Circle

  return (
    <div className={cn(cardClass, "overflow-hidden transition-shadow duration-200 hover:shadow-md")}>
      <div className="flex items-stretch">
        <div className="w-1.5 shrink-0 bg-slate-200" aria-hidden />
        <div className="flex shrink-0 flex-col items-center gap-0.5 px-1.5 py-3 md:px-2">
          <button
            type="button"
            draggable={canReorder}
            onDragStart={onDragHandleStart}
            onDragEnd={onDragHandleEnd}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-slate-400",
              canReorder
                ? "cursor-grab hover:bg-slate-100 hover:text-[#002065] active:cursor-grabbing"
                : "cursor-default opacity-40",
            )}
            aria-label="질문 끌어 순서 변경"
            title="끌어다 놓아 질문 순서 변경"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          {canReorder ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400"
                disabled={!canMoveUp}
                onClick={onMoveUp}
                aria-label="질문 위로"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400"
                disabled={!canMoveDown}
                onClick={onMoveDown}
                aria-label="질문 아래로"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : null}
        </div>
        <div className="min-w-0 flex-1 space-y-4 py-4 pr-4 md:py-5 md:pr-5">
          <div className="flex flex-wrap items-start gap-2">
            <Input
              className="min-w-[200px] flex-1 border-0 border-b border-transparent bg-transparent px-0 text-base font-medium shadow-none rounded-none focus-visible:border-[#002065] focus-visible:ring-0"
              value={question.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="질문"
            />
            <Select value={question.type} onValueChange={(v) => onTypeChange(v as QuestionType)}>
              <SelectTrigger className={cn(controlClass, "w-[160px]")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={onDuplicate}
              aria-label="질문 복제"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-slate-400 hover:text-red-600"
              onClick={onDelete}
              aria-label="질문 삭제"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Textarea
              value={question.description ?? ""}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="설명 (선택 · 마크다운/URL 자동 링크)"
              rows={2}
              className="min-h-[52px] resize-y border-0 border-b border-transparent bg-transparent px-0 text-sm text-slate-500 shadow-none rounded-none focus-visible:border-[#002065] focus-visible:ring-0"
            />
            {(question.description ?? "").trim() ? (
              <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2">
                <MarkdownText className="text-sm">{question.description ?? ""}</MarkdownText>
              </div>
            ) : null}
          </div>

          {(question.type === "short_answer" || question.type === "paragraph") && (
            <div
              className={cn(
                "pointer-events-none border-b border-slate-200 text-sm text-slate-300",
                question.type === "paragraph" ? "min-h-[72px] pt-2" : "py-2",
              )}
            >
              {question.type === "paragraph" ? "장문 답변" : "단답형 답변"}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <Checkbox
                checked={Boolean(question.required)}
                onCheckedChange={(checked) => onChange({ required: Boolean(checked) })}
              />
              필수
            </label>
            {hasOptions ? (
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <Checkbox
                  checked={Boolean(question.allowOther)}
                  onCheckedChange={(checked) => onChange({ allowOther: Boolean(checked) })}
                />
                기타 옵션
              </label>
            ) : null}
          </div>

          {hasOptions ? (
            <div className="space-y-2">
              {(question.options ?? []).map((option, index) => (
                <div key={option.id} className="flex flex-wrap items-center gap-2">
                  <OptionIcon className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
                  <Input
                    value={option.label}
                    onChange={(e) =>
                      onChange({
                        options: (question.options ?? []).map((o) =>
                          o.id === option.id ? { ...o, label: e.target.value } : o,
                        ),
                      })
                    }
                    className="min-w-[160px] flex-1 border-0 border-b border-transparent bg-transparent px-0 shadow-none rounded-none focus-visible:border-[#002065] focus-visible:ring-0"
                    placeholder={`옵션 ${index + 1}`}
                  />
                  {canBranch ? (
                    <Select
                      value={question.goToSectionByOption?.[option.id] ?? "next"}
                      onValueChange={(value) =>
                        onChange({
                          goToSectionByOption: {
                            ...(question.goToSectionByOption ?? {}),
                            [option.id]: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className={cn(controlClass, "w-[150px]")}>
                        <SelectValue placeholder="분기" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="next">다음 섹션</SelectItem>
                        <SelectItem value="submit">제출로 이동</SelectItem>
                        {sections.map((s, i) => (
                          <SelectItem key={s.id} value={s.id}>
                            섹션 {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-slate-400 hover:text-red-600"
                    onClick={() =>
                      onChange({
                        options: (question.options ?? []).filter((o) => o.id !== option.id),
                      })
                    }
                    aria-label={`옵션 ${index + 1} 삭제`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 px-2 text-[#002065] hover:bg-[#002065]/5"
                onClick={() =>
                  onChange({
                    options: [
                      ...(question.options ?? []),
                      createOption(`옵션 ${(question.options?.length ?? 0) + 1}`),
                    ],
                  })
                }
              >
                <Plus className="mr-1.5 h-4 w-4" />
                옵션 추가
              </Button>
            </div>
          ) : null}

          {question.type === "linear_scale" ? (
            <div className="grid gap-2 sm:grid-cols-4">
              <Input
                type="number"
                value={question.scaleMin ?? 1}
                onChange={(e) => onChange({ scaleMin: Number(e.target.value) })}
                placeholder="최소"
                className={controlClass}
              />
              <Input
                type="number"
                value={question.scaleMax ?? 5}
                onChange={(e) => onChange({ scaleMax: Number(e.target.value) })}
                placeholder="최대"
                className={controlClass}
              />
              <Input
                value={question.scaleMinLabel ?? ""}
                onChange={(e) => onChange({ scaleMinLabel: e.target.value })}
                placeholder="최소 라벨"
                className={controlClass}
              />
              <Input
                value={question.scaleMaxLabel ?? ""}
                onChange={(e) => onChange({ scaleMaxLabel: e.target.value })}
                placeholder="최대 라벨"
                className={controlClass}
              />
            </div>
          ) : null}

          {(question.type === "multiple_choice_grid" || question.type === "checkbox_grid") && (
            <div className="grid gap-4 sm:grid-cols-2">
              <OptionList
                label="행"
                options={question.rows ?? []}
                onChange={(rows) => onChange({ rows })}
              />
              <OptionList
                label="열"
                options={question.columns ?? []}
                onChange={(columns) => onChange({ columns })}
              />
            </div>
          )}

          {isQuiz && hasOptions ? (
            <div className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">배점</Label>
                <Input
                  type="number"
                  value={question.points ?? 0}
                  onChange={(e) => onChange({ points: Number(e.target.value) })}
                  className={controlClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">정답 옵션 ID (쉼표)</Label>
                <Input
                  value={(question.correctOptionIds ?? []).join(",")}
                  onChange={(e) =>
                    onChange({
                      correctOptionIds: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder={(question.options ?? []).map((o) => o.id).join(",")}
                  className={controlClass}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs text-muted-foreground">해설</Label>
                <Input
                  value={question.answerExplanation ?? ""}
                  onChange={(e) => onChange({ answerExplanation: e.target.value })}
                  className={controlClass}
                />
              </div>
            </div>
          ) : null}

          {(question.type === "short_answer" || question.type === "paragraph") && (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">응답 검증</Label>
                <Select
                  value={question.validation?.kind ?? "none"}
                  onValueChange={(value) =>
                    onChange({
                      validation:
                        value === "none"
                          ? undefined
                          : {
                              kind: value as NonNullable<FormQuestion["validation"]>["kind"],
                              value: question.validation?.value,
                            },
                    })
                  }
                >
                  <SelectTrigger className={controlClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">없음</SelectItem>
                    <SelectItem value="email">이메일</SelectItem>
                    <SelectItem value="number">숫자</SelectItem>
                    <SelectItem value="text_contains">텍스트 포함</SelectItem>
                    <SelectItem value="min_length">최소 길이</SelectItem>
                    <SelectItem value="max_length">최대 길이</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {question.validation &&
              question.validation.kind !== "email" &&
              question.validation.kind !== "number" ? (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">검증 값</Label>
                  <Input
                    value={String(question.validation.value ?? "")}
                    onChange={(e) =>
                      onChange({
                        validation: {
                          ...question.validation!,
                          value:
                            question.validation!.kind === "min_length" ||
                            question.validation!.kind === "max_length"
                              ? Number(e.target.value)
                              : e.target.value,
                        },
                      })
                    }
                    className={controlClass}
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function OptionList({
  label,
  options,
  onChange,
}: {
  label: string
  options: { id: string; label: string }[]
  onChange: (options: { id: string; label: string }[]) => void
}) {
  return (
    <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {options.map((option) => (
        <div key={option.id} className="flex gap-2">
          <Input
            value={option.label}
            onChange={(e) =>
              onChange(
                options.map((o) => (o.id === option.id ? { ...o, label: e.target.value } : o)),
              )
            }
            className={controlClass}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-11 w-11 text-slate-400 hover:text-red-600"
            onClick={() => onChange(options.filter((o) => o.id !== option.id))}
            aria-label={`${label} 삭제`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-9 px-2 text-[#002065] hover:bg-[#002065]/5"
        onClick={() => onChange([...options, createOption(`${label} ${options.length + 1}`)])}
      >
        <Plus className="mr-1.5 h-4 w-4" />
        {label} 추가
      </Button>
    </div>
  )
}
