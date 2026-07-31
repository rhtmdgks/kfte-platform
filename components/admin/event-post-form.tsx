"use client"

import { useActionState, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { CalendarDays, ImageIcon, Loader2, Megaphone, NotebookPen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BlogThumbnailField } from "@/components/admin/blog-thumbnail-field"
import {
  EventApplicationFormField,
  type FormOption,
} from "@/components/admin/event-application-form-field"
import { EventPosterField } from "@/components/admin/event-poster-field"
import { PinToggleField } from "@/components/admin/pin-toggle-field"
import { eventCategoryOptions } from "@/lib/events-content"
import { parseEventPostMetadata, toDatetimeLocalValue } from "@/lib/event-metadata"
import { cn } from "@/lib/utils"
import type { Tables, Database } from "@/types/database"

type ContentPost = Tables<"content_posts">
type ContentType = Database["public"]["Enums"]["content_type"]

type EventPostFormProps = {
  post?: ContentPost
  contentType: Extract<ContentType, "event">
  action: (formData: FormData) => Promise<void>
  applicationForms?: FormOption[]
}

function FormSection({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "glass-pane space-y-5 rounded-2xl border border-white/55 p-5 md:p-6",
        className,
      )}
    >
      <div className="flex items-start gap-3 border-b border-white/50 pb-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#002065]/10 text-[#002065]">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-[#002065]">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

const controlClass =
  "h-11 rounded-xl border-slate-200/80 bg-white/70 shadow-none backdrop-blur-sm focus-visible:ring-[#002065]/25"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 rounded-full bg-[#002065] px-6 font-semibold hover:bg-[#002065]/90"
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "저장 중…" : "행사 저장"}
    </Button>
  )
}

export function EventPostForm({
  post,
  contentType,
  action,
  applicationForms = [],
}: EventPostFormProps) {
  const metadata = parseEventPostMetadata(post?.metadata ?? null)
  const [featured, setFeatured] = useState(metadata.featured ?? false)
  const [detailImageUrl, setDetailImageUrl] = useState("")
  const detailImageUrlRef = useRef("")
  const [, formAction] = useActionState(async (_: void | null, formData: FormData) => {
    const uploaded = detailImageUrlRef.current.trim()
    if (uploaded) {
      formData.set("detail_image_url", uploaded)
    }
    await action(formData)
    return null
  }, null)

  return (
    <form action={formAction} className="space-y-4 pb-20">
      <input type="hidden" name="content_type" value={contentType} />
      <input type="hidden" name="detail_image_url" value={detailImageUrl} />

      <FormSection icon={NotebookPen} title="기본 정보" description="목록과 상세에 공통으로 쓰입니다.">
        <Field label="행사명" htmlFor="title" required>
          <Input
            id="title"
            name="title"
            defaultValue={post?.title}
            placeholder="행사 제목을 입력하세요"
            required
            className={controlClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="카테고리" htmlFor="metadata_category" required>
            <Select
              name="metadata_category"
              defaultValue={metadata.category ?? eventCategoryOptions[0]}
              required
            >
              <SelectTrigger id="metadata_category" className={controlClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventCategoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="세부 분류" htmlFor="metadata_subcategory">
            <Input
              id="metadata_subcategory"
              name="metadata_subcategory"
              defaultValue={metadata.subcategory ?? ""}
              placeholder="예: 오프라인, 연례"
              className={controlClass}
            />
          </Field>
        </div>

        <Field
          label="요약"
          htmlFor="summary"
          hint="목록·카드에 표시될 짧은 소개 (2~3줄 권장)"
        >
          <Textarea
            id="summary"
            name="summary"
            defaultValue={post?.summary ?? ""}
            placeholder="한눈에 보이는 소개 문장을 적어 주세요"
            className="min-h-[100px] resize-y rounded-xl border-slate-200/80 bg-white/70"
          />
        </Field>

        <div className="flex flex-wrap items-center gap-4">
          <PinToggleField defaultChecked={post?.is_pinned ?? false} />
          <div className="flex items-center gap-2">
            <Checkbox
              id="metadata_featured"
              checked={featured}
              onCheckedChange={(value) => setFeatured(value === true)}
            />
            <input type="hidden" name="metadata_featured" value={featured ? "1" : "0"} />
            <Label htmlFor="metadata_featured" className="font-normal text-slate-700">
              Featured 강조 표시
            </Label>
          </div>
        </div>
      </FormSection>

      <FormSection icon={ImageIcon} title="이미지" description="썸네일과 상세 포스터를 등록합니다.">
        <BlogThumbnailField currentUrl={post?.thumbnail_url} required />
        <EventPosterField
          currentUrl={post?.detail_image_url}
          currentWidth={metadata.detailImageWidth}
          currentHeight={metadata.detailImageHeight}
          onUploadedUrlChange={(url) => {
            const next = url ?? ""
            detailImageUrlRef.current = next
            setDetailImageUrl(next)
          }}
        />
      </FormSection>

      <FormSection icon={CalendarDays} title="일정 · 장소" description="행사 일시와 장소 정보입니다.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="행사 시작" htmlFor="metadata_event_date" required>
            <Input
              id="metadata_event_date"
              name="metadata_event_date"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(metadata.eventDate)}
              required
              className={controlClass}
            />
          </Field>
          <Field label="행사 종료" htmlFor="metadata_event_end_date">
            <Input
              id="metadata_event_end_date"
              name="metadata_event_end_date"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(metadata.eventEndDate)}
              className={controlClass}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="장소" htmlFor="metadata_location" required>
            <Input
              id="metadata_location"
              name="metadata_location"
              defaultValue={metadata.location ?? ""}
              placeholder="예: 서울 강남구"
              required
              className={controlClass}
            />
          </Field>
          <Field label="상세 장소" htmlFor="metadata_location_detail">
            <Input
              id="metadata_location_detail"
              name="metadata_location_detail"
              defaultValue={metadata.locationDetail ?? ""}
              placeholder="예: KFTE 프로그램센터 2층"
              className={controlClass}
            />
          </Field>
        </div>

        <Field label="참가 비용" htmlFor="metadata_cost">
          <Input
            id="metadata_cost"
            name="metadata_cost"
            defaultValue={metadata.cost ?? "무료"}
            placeholder="무료 또는 금액"
            className={controlClass}
          />
        </Field>
      </FormSection>

      <FormSection
        icon={Megaphone}
        title="신청 · 참가"
        description="모집 기간과 신청 폼을 연결합니다."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="모집 시작" htmlFor="metadata_registration_start">
            <Input
              id="metadata_registration_start"
              name="metadata_registration_start"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(metadata.registrationStart)}
              className={controlClass}
            />
          </Field>
          <Field
            label="모집 마감"
            htmlFor="metadata_registration_end"
            hint="마감 후 아카이브로 자동 이동 (미입력 시 행사일 기준)"
          >
            <Input
              id="metadata_registration_end"
              name="metadata_registration_end"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(metadata.registrationEnd)}
              className={controlClass}
            />
          </Field>
        </div>

        <Field label="신청 폼 / 링크">
          <EventApplicationFormField
            forms={applicationForms}
            initialFormId={metadata.applicationFormId}
            initialExternalUrl={post?.external_url ?? ""}
            eventTitle={post?.title}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="문의 전화 (T)" htmlFor="metadata_contact_phone">
            <Input
              id="metadata_contact_phone"
              name="metadata_contact_phone"
              type="tel"
              defaultValue={metadata.contactPhone ?? ""}
              placeholder="070-7954-8795"
              className={controlClass}
            />
          </Field>
          <Field
            label="문의 이메일 (E)"
            htmlFor="metadata_contact_email"
            hint="비워 두면 사이트 기본 문의처가 표시됩니다."
          >
            <Input
              id="metadata_contact_email"
              name="metadata_contact_email"
              type="email"
              defaultValue={metadata.contactEmail ?? ""}
              placeholder="yun@seongyong.com"
              className={controlClass}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection icon={NotebookPen} title="본문 · 게시" description="상세 안내와 공개 상태입니다.">
        <Field label="프로그램 안내 · 본문" htmlFor="body">
          <Textarea
            id="body"
            name="body"
            defaultValue={post?.body ?? ""}
            placeholder="행사 상세 프로그램, 대상, 준비물 등을 입력하세요"
            className="min-h-[280px] rounded-xl border-slate-200/80 bg-white/70 font-mono text-sm md:min-h-[360px]"
          />
        </Field>

        <Field label="게시 상태" htmlFor="status">
          <Select name="status" defaultValue={post?.status ?? "draft"}>
            <SelectTrigger id="status" className={cn(controlClass, "w-44")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">초안</SelectItem>
              <SelectItem value="published">공개</SelectItem>
              <SelectItem value="archived">보관</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </FormSection>

      <div className="glass-pane sticky bottom-3 z-20 flex items-center justify-between gap-3 rounded-2xl border border-white/60 px-4 py-3 shadow-[0_12px_40px_-20px_rgba(0,32,101,0.35)] md:px-5">
        <p className="hidden text-sm text-muted-foreground sm:block">
          입력한 내용으로 행사를 저장합니다.
        </p>
        <SubmitButton />
      </div>
    </form>
  )
}
