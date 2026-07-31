"use client"

import { useMemo, useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { submitFormResponse } from "@/app/apply/actions"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import type { FormQuestion, FormSchema, FormSettings, SectionNavTarget } from "@/lib/application-forms/types"
import type { AnswerMap } from "@/lib/application-forms/validate-answers"

type PublicFormProps = {
  formId: string
  title: string
  description?: string | null
  schema: FormSchema
  settings: FormSettings
  initialEditToken?: string
}

function resolveNext(
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

export function PublicForm({
  formId,
  title,
  description,
  schema,
  settings,
  initialEditToken,
}: PublicFormProps) {
  const [sectionIndex, setSectionIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [editToken, setEditToken] = useState(initialEditToken)
  const [done, setDone] = useState<{
    message: string
    score?: number
    editToken?: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()

  const section = schema.sections[sectionIndex]
  const progress = useMemo(() => {
    if (!settings.showProgressBar || schema.sections.length <= 1) return null
    return Math.round(((sectionIndex + 1) / schema.sections.length) * 100)
  }, [schema.sections.length, sectionIndex, settings.showProgressBar])

  const setAnswer = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[questionId]
      return next
    })
  }

  const findBranchTarget = (): SectionNavTarget | undefined => {
    for (const question of section.items) {
      if (question.type !== "multiple_choice" && question.type !== "dropdown") continue
      const value = answers[question.id]
      if (typeof value !== "string" || !question.goToSectionByOption) continue
      const target = question.goToSectionByOption[value]
      if (target) return target
    }
    return section.nextSectionId
  }

  const handleNextOrSubmit = () => {
    const next = resolveNext(findBranchTarget(), schema.sections, sectionIndex)
    if (next !== "submit") {
      setSectionIndex(next)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    startTransition(async () => {
      const result = await submitFormResponse(formId, {
        answers,
        email: settings.collectEmail ? email : undefined,
        editToken,
      })
      if (!result.ok) {
        setErrors(result.errors ?? { __form: result.error })
        return
      }
      setEditToken(result.editToken)
      setDone({
        message: result.confirmationMessage || "응답이 기록되었습니다.",
        score: result.score,
        editToken: result.editToken,
      })
    })
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-6 py-16">
        <h1 className="text-2xl font-bold text-[#002065]">{title}</h1>
        <p className="text-foreground" role="status">
          {done.message}
        </p>
        {typeof done.score === "number" ? (
          <p className="text-sm text-muted-foreground">점수: {done.score}</p>
        ) : null}
        {done.editToken ? (
          <p className="text-sm text-muted-foreground">
            수정 링크 토큰이 발급되었습니다. 같은 브라우저에서 다시 제출하면 수정됩니다.
          </p>
        ) : null}
      </div>
    )
  }

  if (!section) {
    return <p className="p-10 text-center text-muted-foreground">표시할 섹션이 없습니다.</p>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-6 py-12 md:py-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[#002065]">{title}</h1>
        {description ? <p className="text-muted-foreground">{description}</p> : null}
        {progress != null ? (
          <div className="pt-2">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>
                섹션 {sectionIndex + 1}/{schema.sections.length}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-[#002065] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}
      </header>

      {errors.__form ? (
        <div role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.__form}
        </div>
      ) : null}

      {section.title || section.description ? (
        <div className="space-y-1 border-b pb-4">
          {section.title ? <h2 className="text-lg font-semibold">{section.title}</h2> : null}
          {section.description ? (
            <p className="text-sm text-muted-foreground">{section.description}</p>
          ) : null}
        </div>
      ) : null}

      {settings.collectEmail && sectionIndex === 0 ? (
        <div className="space-y-2">
          <Label htmlFor="respondent-email">
            이메일 {settings.collectEmail ? "*" : ""}
          </Label>
          <Input
            id="respondent-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.__email ? (
            <p role="alert" className="text-sm text-red-600">
              {errors.__email}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-8">
        {section.items.map((question) => (
          <QuestionField
            key={question.id}
            formId={formId}
            question={question}
            value={answers[question.id]}
            error={errors[question.id]}
            onChange={(value) => setAnswer(question.id, value)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {sectionIndex > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setSectionIndex((i) => Math.max(0, i - 1))}
            disabled={isPending}
          >
            이전
          </Button>
        ) : null}
        <Button
          type="button"
          className="bg-[#002065] hover:bg-[#002065]/90"
          onClick={handleNextOrSubmit}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {resolveNext(findBranchTarget(), schema.sections, sectionIndex) === "submit"
            ? "제출"
            : "다음"}
        </Button>
      </div>
    </div>
  )
}

function QuestionField({
  formId,
  question,
  value,
  error,
  onChange,
}: {
  formId: string
  question: FormQuestion
  value: unknown
  error?: string
  onChange: (value: unknown) => void
}) {
  const options = question.options ?? []

  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-medium text-foreground">
        {question.title}
        {question.required ? <span className="text-red-600"> *</span> : null}
      </legend>
      {question.description ? (
        <p className="text-sm text-muted-foreground">{question.description}</p>
      ) : null}

      {question.type === "short_answer" || question.type === "date" || question.type === "time" ? (
        <Input
          type={
            question.type === "date" ? "date" : question.type === "time" ? "time" : "text"
          }
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}

      {question.type === "paragraph" ? (
        <Textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
        />
      ) : null}

      {question.type === "multiple_choice" ? (
        <RadioGroup
          value={typeof value === "string" ? value : ""}
          onValueChange={onChange}
          className="space-y-2"
        >
          {options.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-sm">
              <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
              {option.label}
            </label>
          ))}
          {question.allowOther ? (
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="__other__" id={`${question.id}-other`} />
              기타
              <Input
                className="max-w-xs"
                value={
                  typeof value === "string" && value.startsWith("__other__:")
                    ? value.slice("__other__:".length)
                    : ""
                }
                onChange={(e) => onChange(`__other__:${e.target.value}`)}
                onFocus={() => {
                  if (typeof value !== "string" || !value.startsWith("__other__:")) {
                    onChange("__other__:")
                  }
                }}
              />
            </label>
          ) : null}
        </RadioGroup>
      ) : null}

      {question.type === "dropdown" ? (
        <Select
          value={typeof value === "string" ? value : undefined}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="선택" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      {question.type === "checkboxes" ? (
        <div className="space-y-2">
          {options.map((option) => {
            const selected = Array.isArray(value) ? value.map(String) : []
            const checked = selected.includes(option.id)
            return (
              <label key={option.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(next) => {
                    if (next) onChange([...selected, option.id])
                    else onChange(selected.filter((id) => id !== option.id))
                  }}
                />
                {option.label}
              </label>
            )
          })}
        </div>
      ) : null}

      {question.type === "linear_scale" ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-muted-foreground">{question.scaleMinLabel}</span>
          {Array.from(
            {
              length: (question.scaleMax ?? 5) - (question.scaleMin ?? 1) + 1,
            },
            (_, i) => (question.scaleMin ?? 1) + i,
          ).map((n) => (
            <label key={n} className="flex flex-col items-center gap-1 text-xs">
              <input
                type="radio"
                name={question.id}
                checked={Number(value) === n}
                onChange={() => onChange(n)}
              />
              {n}
            </label>
          ))}
          <span className="text-xs text-muted-foreground">{question.scaleMaxLabel}</span>
        </div>
      ) : null}

      {(question.type === "multiple_choice_grid" || question.type === "checkbox_grid") && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left" />
                {(question.columns ?? []).map((col) => (
                  <th key={col.id} className="p-2 text-center font-medium">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(question.rows ?? []).map((row) => {
                const map =
                  value && typeof value === "object" && !Array.isArray(value)
                    ? (value as Record<string, unknown>)
                    : {}
                return (
                  <tr key={row.id} className="border-t">
                    <td className="p-2">{row.label}</td>
                    {(question.columns ?? []).map((col) => (
                      <td key={col.id} className="p-2 text-center">
                        {question.type === "multiple_choice_grid" ? (
                          <input
                            type="radio"
                            name={`${question.id}-${row.id}`}
                            checked={map[row.id] === col.id}
                            onChange={() => onChange({ ...map, [row.id]: col.id })}
                          />
                        ) : (
                          <Checkbox
                            checked={
                              Array.isArray(map[row.id])
                                ? (map[row.id] as string[]).includes(col.id)
                                : false
                            }
                            onCheckedChange={(checked) => {
                              const current = Array.isArray(map[row.id])
                                ? [...(map[row.id] as string[])]
                                : []
                              const next = checked
                                ? [...current, col.id]
                                : current.filter((id) => id !== col.id)
                              onChange({ ...map, [row.id]: next })
                            }}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {question.type === "file_upload" ? (
        <Input
          type="file"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const supabase = createClient()
            const path = `${formId}/${question.id}/${Date.now()}-${file.name}`
            const { error: uploadError } = await supabase.storage
              .from("form-uploads")
              .upload(path, file, { upsert: false })
            if (uploadError) {
              onChange("")
              return
            }
            const { data } = supabase.storage.from("form-uploads").getPublicUrl(path)
            onChange(data.publicUrl)
          }}
        />
      ) : null}

      {typeof value === "string" && question.type === "file_upload" && value ? (
        <a href={value} className="text-sm text-primary underline" target="_blank" rel="noreferrer">
          업로드된 파일
        </a>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
