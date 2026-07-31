"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  Copy,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { deleteForm, updateForm } from "@/app/admin/forms/actions"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
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
import type { Tables } from "@/types/database"

type FormRow = Tables<"application_forms">

type FormBuilderProps = {
  form: FormRow
  initialSchema: FormSchema
  initialSettings: FormSettings
  responseCount: number
}

const TYPE_OPTIONS = Object.entries(QUESTION_TYPE_LABELS) as [QuestionType, string][]

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleSave} disabled={isPending} className="bg-[#002065] hover:bg-[#002065]/90">
          {isPending ? "저장 중…" : "저장"}
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/admin/forms/${form.id}/responses`}>응답 {responseCount}건</Link>
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(publicUrl)
            toast.success("공개 URL을 복사했습니다.")
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          URL 복사
        </Button>
        <Button variant="destructive" type="button" onClick={() => setDeleteOpen(true)}>
          삭제
        </Button>
      </div>

      <section className="space-y-4 rounded-lg border bg-muted/20 p-5">
        <div className="space-y-2">
          <Label htmlFor="form-title">제목</Label>
          <Input id="form-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="form-description">설명</Label>
          <Textarea
            id="form-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="form-slug">슬러그 (URL)</Label>
            <Input id="form-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <p className="text-xs text-muted-foreground">{publicFormPath(slug)}</p>
          </div>
          <div className="space-y-2">
            <Label>상태</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger>
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
      </section>

      <section className="space-y-4 rounded-lg border p-5">
        <h2 className="text-sm font-semibold text-[#002065]">설정</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
            <span className="text-sm">진행률 표시</span>
            <Switch
              checked={Boolean(settings.showProgressBar)}
              onCheckedChange={(checked) =>
                setSettings((s) => ({ ...s, showProgressBar: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
            <span className="text-sm">이메일 수집</span>
            <Switch
              checked={Boolean(settings.collectEmail)}
              onCheckedChange={(checked) =>
                setSettings((s) => ({ ...s, collectEmail: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
            <span className="text-sm">제출 후 수정 허용</span>
            <Switch
              checked={Boolean(settings.allowResponseEditing)}
              onCheckedChange={(checked) =>
                setSettings((s) => ({ ...s, allowResponseEditing: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
            <span className="text-sm">퀴즈 모드</span>
            <Switch
              checked={Boolean(settings.isQuiz)}
              onCheckedChange={(checked) => setSettings((s) => ({ ...s, isQuiz: checked }))}
            />
          </label>
        </div>
        <div className="space-y-2">
          <Label>확인 메시지</Label>
          <Input
            value={settings.confirmationMessage ?? ""}
            onChange={(e) =>
              setSettings((s) => ({ ...s, confirmationMessage: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>새 응답 알림 이메일 (선택)</Label>
          <Input
            type="email"
            value={settings.notifyEmail ?? ""}
            onChange={(e) => setSettings((s) => ({ ...s, notifyEmail: e.target.value }))}
            placeholder="admin@kfte.kr"
          />
        </div>
      </section>

      {schema.sections.map((section, sectionIndex) => (
        <section key={section.id} className="space-y-4 rounded-lg border p-5">
          <div className="flex items-start gap-3">
            <GripVertical className="mt-2 h-4 w-4 text-muted-foreground" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground">
                  섹션 {sectionIndex + 1}
                </p>
                {schema.sections.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSchema((prev) => ({
                        sections: prev.sections.filter((s) => s.id !== section.id),
                      }))
                    }
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
              />
              <Textarea
                value={section.description ?? ""}
                onChange={(e) =>
                  setSchema((prev) => ({
                    sections: prev.sections.map((s) =>
                      s.id === section.id ? { ...s, description: e.target.value } : s,
                    ),
                  }))
                }
                placeholder="섹션 설명"
                rows={2}
              />

              <div className="space-y-2">
                <Label className="text-xs">다음 섹션</Label>
                <Select
                  value={section.nextSectionId ?? "next"}
                  onValueChange={(value) =>
                    setSchema((prev) => ({
                      sections: prev.sections.map((s) =>
                        s.id === section.id
                          ? { ...s, nextSectionId: value as typeof s.nextSectionId }
                          : s,
                      ),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="next">다음 섹션</SelectItem>
                    <SelectItem value="submit">제출</SelectItem>
                    {schema.sections
                      .filter((s) => s.id !== section.id)
                      .map((s, i) => (
                        <SelectItem key={s.id} value={s.id}>
                          섹션 {schema.sections.findIndex((x) => x.id === s.id) + 1}:{" "}
                          {s.title || `섹션 ${i + 1}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-3 pl-7">
            {section.items.map((question) => (
              <QuestionEditor
                key={question.id}
                question={question}
                sections={schema.sections}
                isQuiz={Boolean(settings.isQuiz)}
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
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
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
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          setSchema((prev) => ({
            sections: [...prev.sections, createSection(`섹션 ${prev.sections.length + 1}`)],
          }))
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        섹션 추가
      </Button>

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
  onChange,
  onTypeChange,
  onDelete,
  onDuplicate,
}: {
  question: FormQuestion
  sections: FormSchema["sections"]
  isQuiz: boolean
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

  return (
    <div className="space-y-3 rounded-md border bg-background p-4">
      <div className="flex flex-wrap items-start gap-2">
        <Input
          className="min-w-[200px] flex-1"
          value={question.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="질문"
        />
        <Select value={question.type} onValueChange={(v) => onTypeChange(v as QuestionType)}>
          <SelectTrigger className="w-[160px]">
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
        <Button type="button" variant="ghost" size="icon" onClick={onDuplicate}>
          <Copy className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Input
        value={question.description ?? ""}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="설명 (선택)"
      />

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={Boolean(question.required)}
            onCheckedChange={(checked) => onChange({ required: Boolean(checked) })}
          />
          필수
        </label>
        {hasOptions ? (
          <label className="flex items-center gap-2 text-sm">
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
              <ChevronDown className="h-3 w-3 opacity-0" />
              <Input
                value={option.label}
                onChange={(e) =>
                  onChange({
                    options: (question.options ?? []).map((o) =>
                      o.id === option.id ? { ...o, label: e.target.value } : o,
                    ),
                  })
                }
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
                  <SelectTrigger className="w-[160px]">
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
                onClick={() =>
                  onChange({
                    options: (question.options ?? []).filter((o) => o.id !== option.id),
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <span className="sr-only">옵션 {index + 1}</span>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                options: [...(question.options ?? []), createOption(`옵션 ${(question.options?.length ?? 0) + 1}`)],
              })
            }
          >
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
          />
          <Input
            type="number"
            value={question.scaleMax ?? 5}
            onChange={(e) => onChange({ scaleMax: Number(e.target.value) })}
            placeholder="최대"
          />
          <Input
            value={question.scaleMinLabel ?? ""}
            onChange={(e) => onChange({ scaleMinLabel: e.target.value })}
            placeholder="최소 라벨"
          />
          <Input
            value={question.scaleMaxLabel ?? ""}
            onChange={(e) => onChange({ scaleMaxLabel: e.target.value })}
            placeholder="최대 라벨"
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
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">배점</Label>
            <Input
              type="number"
              value={question.points ?? 0}
              onChange={(e) => onChange({ points: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">정답 옵션 ID (쉼표)</Label>
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
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs">해설</Label>
            <Input
              value={question.answerExplanation ?? ""}
              onChange={(e) => onChange({ answerExplanation: e.target.value })}
            />
          </div>
        </div>
      ) : null}

      {(question.type === "short_answer" || question.type === "paragraph") && (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">응답 검증</Label>
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
              <SelectTrigger>
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
          {question.validation && question.validation.kind !== "email" && question.validation.kind !== "number" ? (
            <div className="space-y-2">
              <Label className="text-xs">검증 값</Label>
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
              />
            </div>
          ) : null}
        </div>
      )}
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
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      {options.map((option) => (
        <div key={option.id} className="flex gap-2">
          <Input
            value={option.label}
            onChange={(e) =>
              onChange(
                options.map((o) => (o.id === option.id ? { ...o, label: e.target.value } : o)),
              )
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(options.filter((o) => o.id !== option.id))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...options, createOption(`${label} ${options.length + 1}`)])}
      >
        {label} 추가
      </Button>
    </div>
  )
}
