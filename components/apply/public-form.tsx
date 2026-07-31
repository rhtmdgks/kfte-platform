"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, Loader2, Upload } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { submitFormResponse } from "@/app/apply/actions"
import { MotionChoice, MotionField } from "@/components/apply/motion-field"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { springGentle } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"
import type {
  FormQuestion,
  FormSchema,
  FormSettings,
  SectionNavTarget,
} from "@/lib/application-forms/types"
import type { AnswerMap } from "@/lib/application-forms/validate-answers"

type PublicFormProps = {
  formId: string
  title: string
  description?: string | null
  schema: FormSchema
  settings: FormSettings
  initialEditToken?: string
  eventHref?: string
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
  eventHref = "/activities/events",
}: PublicFormProps) {
  const reduceMotion = useReducedMotion()
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
  const [isPending, setIsPending] = useState(false)

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

  const jumpToFirstError = (fieldErrors: Record<string, string>) => {
    const questionIds = new Set(Object.keys(fieldErrors).filter((k) => k !== "__form" && k !== "__email"))
    if (questionIds.size === 0) return
    const idx = schema.sections.findIndex((s) =>
      s.items.some((q) => questionIds.has(q.id)),
    )
    if (idx >= 0) setSectionIndex(idx)
  }

  const handleNextOrSubmit = async () => {
    const next = resolveNext(findBranchTarget(), schema.sections, sectionIndex)
    if (next !== "submit") {
      setSectionIndex(next)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setIsPending(true)
    try {
      const result = await submitFormResponse(formId, {
        answers,
        email: settings.collectEmail ? email : undefined,
        editToken,
      })
      if (!result?.ok) {
        const nextErrors = {
          ...(result?.errors ?? {}),
          __form: result?.error || "제출에 실패했습니다.",
        }
        setErrors(nextErrors)
        jumpToFirstError(nextErrors)
        window.scrollTo({ top: 0, behavior: "smooth" })
        return
      }
      if (result.editToken) setEditToken(result.editToken)
      setDone({
        message: result.confirmationMessage || "응답이 기록되었습니다.",
        score: result.score,
        editToken: result.editToken,
      })
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setErrors({
        __form: err instanceof Error ? err.message : "제출에 실패했습니다.",
      })
      window.scrollTo({ top: 0, behavior: "smooth" })
    } finally {
      setIsPending(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-4xl px-5 pb-16 pt-10 md:px-8 md:pt-14">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springGentle}
          className="space-y-5"
          role="status"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#002065] text-white">
            <Check className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#002065]">제출 완료</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {title}
            </h1>
            <p className="text-lg leading-relaxed text-slate-600">{done.message}</p>
          </div>
          {typeof done.score === "number" ? (
            <p className="text-base text-slate-500">점수 · {done.score}</p>
          ) : null}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-full bg-[#002065] px-6 text-base font-semibold hover:bg-[#001a52]"
            >
              <Link href="/">홈페이지로 돌아가기</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-slate-300 px-6 text-base font-semibold text-slate-800 hover:bg-slate-50"
            >
              <Link href={eventHref}>행사 페이지로 돌아가기</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!section) {
    return <p className="p-10 text-center text-slate-500">표시할 섹션이 없습니다.</p>
  }

  const isLastStep =
    resolveNext(findBranchTarget(), schema.sections, sectionIndex) === "submit"

  return (
    <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-8 md:px-8 md:pb-20 md:pt-12">
      {progress != null ? (
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs font-medium tracking-wide text-slate-500">
            <span>
              {sectionIndex + 1} / {schema.sections.length}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-[2px] overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full bg-[#002065]"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={springGentle}
            />
          </div>
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={section.id}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={springGentle}
          className="space-y-10"
        >
          <header className="space-y-4">
            {sectionIndex === 0 ? (
              <>
                <h1 className="text-[1.85rem] font-bold leading-[1.25] tracking-tight text-slate-900 md:text-[2.15rem]">
                  {title}
                </h1>
                {description ? (
                  <p className="whitespace-pre-line text-[15px] leading-[1.75] text-slate-500 md:text-base">
                    {description}
                  </p>
                ) : null}
              </>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#002065]">{title}</p>
                {section.title ? (
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                    {section.title}
                  </h2>
                ) : null}
              </div>
            )}
            {sectionIndex === 0 && section.title ? (
              <h2 className="pt-2 text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                {section.title}
              </h2>
            ) : null}
            {section.description ? (
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-500">
                {section.description}
              </p>
            ) : null}
          </header>

          {errors.__form ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errors.__form}
            </div>
          ) : null}

          <div className="space-y-9">
            {settings.collectEmail && sectionIndex === 0 ? (
              <MotionField
                label="이메일"
                type="email"
                value={email}
                onChange={setEmail}
                required
                autoComplete="email"
                error={errors.__email}
              />
            ) : null}

            {section.items.map((question) => (
              <QuestionField
                key={`${section.id}-${question.id}`}
                formId={formId}
                question={question}
                value={answers[question.id]}
                error={errors[question.id]}
                onChange={(value) => setAnswer(question.id, value)}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            {sectionIndex > 0 ? (
              <Button
                type="button"
                variant="ghost"
                className="h-12 gap-2 rounded-full px-4 text-base text-slate-600 hover:text-slate-900"
                onClick={() => setSectionIndex((i) => Math.max(0, i - 1))}
                disabled={isPending}
              >
                <ArrowLeft className="h-4 w-4" />
                이전
              </Button>
            ) : null}
            <Button
              type="button"
              className="h-12 flex-1 gap-2 rounded-full bg-[#002065] text-base font-semibold hover:bg-[#001a52] md:flex-none md:px-8"
              onClick={handleNextOrSubmit}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isLastStep ? "제출하기" : "다음"}
              {!isPending && !isLastStep ? <ArrowRight className="h-4 w-4" /> : null}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
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
  const reduceMotion = useReducedMotion()
  const stringValue = typeof value === "string" ? value : ""
  const isTextLike =
    question.type === "short_answer" ||
    question.type === "paragraph" ||
    question.type === "date" ||
    question.type === "time"

  return (
    <motion.div
      role="group"
      aria-labelledby={`${question.id}-title`}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springGentle}
      className="space-y-3"
    >
      <div className="space-y-1.5">
        <h3
          id={`${question.id}-title`}
          className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl"
        >
          {question.title}
          {question.required ? <span className="text-red-500"> *</span> : null}
        </h3>
        {question.description ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-500 md:text-[15px]">
            {question.description}
          </p>
        ) : null}
      </div>

      {isTextLike ? (
        <MotionField
          hideLabel
          label={
            question.type === "date"
              ? "날짜"
              : question.type === "time"
                ? "시간"
                : question.type === "paragraph"
                  ? "자세히 입력하세요"
                  : "답변을 입력하세요"
          }
          type={
            question.type === "date" ? "date" : question.type === "time" ? "time" : "text"
          }
          multiline={question.type === "paragraph"}
          rows={4}
          value={stringValue}
          onChange={onChange}
          required={question.required}
          error={error}
        />
      ) : null}

      {question.type === "multiple_choice" ? (
        <div className="space-y-2">
          {options.map((option, index) => (
            <MotionChoice
              key={option.id}
              index={index}
              label={option.label}
              selected={stringValue === option.id}
              onSelect={() => onChange(option.id)}
            />
          ))}
          {question.allowOther ? (
            <div className="space-y-2">
              <MotionChoice
                label="기타"
                selected={stringValue.startsWith("__other__")}
                onSelect={() => {
                  if (!stringValue.startsWith("__other__:")) onChange("__other__:")
                }}
              />
              {stringValue.startsWith("__other__") ? (
                <MotionField
                  label="기타 내용"
                  value={stringValue.slice("__other__:".length)}
                  onChange={(next) => onChange(`__other__:${next}`)}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {question.type === "dropdown" ? (
        <Select value={stringValue || undefined} onValueChange={onChange}>
          <SelectTrigger className="h-12 rounded-none border-0 border-b border-slate-200 bg-transparent px-0 text-[17px] shadow-none focus:ring-0 focus:ring-offset-0 data-[state=open]:border-[#002065]">
            <SelectValue placeholder="선택해 주세요" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id} className="text-base">
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
              <MotionChoice
                key={option.id}
                multi
                label={option.label}
                selected={checked}
                onSelect={() => {
                  if (checked) onChange(selected.filter((id) => id !== option.id))
                  else onChange([...selected, option.id])
                }}
              />
            )
          })}
        </div>
      ) : null}

      {question.type === "linear_scale" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {Array.from(
              {
                length: (question.scaleMax ?? 5) - (question.scaleMin ?? 1) + 1,
              },
              (_, i) => (question.scaleMin ?? 1) + i,
            ).map((n) => {
              const active = Number(value) === n
              return (
                <motion.button
                  key={n}
                  type="button"
                  whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  onClick={() => onChange(n)}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl text-sm font-semibold transition-colors",
                    active
                      ? "bg-[#002065] text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                  )}
                >
                  {n}
                </motion.button>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>{question.scaleMinLabel}</span>
            <span>{question.scaleMaxLabel}</span>
          </div>
        </div>
      ) : null}

      {(question.type === "multiple_choice_grid" || question.type === "checkbox_grid") && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-2 text-left font-medium text-slate-500" />
                {(question.columns ?? []).map((col) => (
                  <th key={col.id} className="p-2 text-center font-medium text-slate-500">
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
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="p-2 font-medium text-slate-800">{row.label}</td>
                    {(question.columns ?? []).map((col) => (
                      <td key={col.id} className="p-2 text-center">
                        {question.type === "multiple_choice_grid" ? (
                          <input
                            type="radio"
                            name={`${question.id}-${row.id}`}
                            checked={map[row.id] === col.id}
                            onChange={() => onChange({ ...map, [row.id]: col.id })}
                            className="h-4 w-4 accent-[#002065]"
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
        <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-8 text-center transition-colors hover:border-[#002065]/40 hover:bg-[#002065]/[0.02]">
          <Upload className="h-5 w-5 text-[#002065]" />
          <span className="text-sm font-medium text-slate-800">파일 선택</span>
          <span className="text-xs text-slate-500">이미지 · PDF · 문서 · 최대 10MB</span>
          <input
            type="file"
            className="sr-only"
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
        </label>
      ) : null}

      {typeof value === "string" && question.type === "file_upload" && value ? (
        <a
          href={value}
          className="inline-flex text-sm font-medium text-[#002065] underline"
          target="_blank"
          rel="noreferrer"
        >
          업로드된 파일 보기
        </a>
      ) : null}

      {error && !isTextLike ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </motion.div>
  )
}
