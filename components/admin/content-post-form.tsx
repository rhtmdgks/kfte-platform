"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import {
  CalendarDays,
  ExternalLink,
  FileText,
  ImageIcon,
  Link2,
  Loader2,
  NotebookPen,
  Paperclip,
  Settings2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BlogThumbnailField } from "@/components/admin/blog-thumbnail-field"
import { PinToggleField } from "@/components/admin/pin-toggle-field"
import { parseContentPostMetadata } from "@/lib/content-post-metadata"
import { getPublicPathsForContentType } from "@/lib/content-public-paths"
import { parseEventPostMetadata, toDatetimeLocalValue } from "@/lib/event-metadata"
import { cn } from "@/lib/utils"
import type { Tables, Database } from "@/types/database"

type ContentPost = Tables<"content_posts">
type ContentType = Database["public"]["Enums"]["content_type"]
type PostStatus = Database["public"]["Enums"]["post_status"]

type ContentPostFormProps = {
  post?: ContentPost
  contentType: ContentType
  action: (formData: FormData) => Promise<void>
  showExternalUrl?: boolean
  showAttachmentFields?: boolean
  authorFieldLabel?: string
  defaultAuthor?: string
  categoryOptions?: readonly string[]
  defaultCategory?: string
  showThumbnailField?: boolean
}

const controlClass =
  "h-11 rounded-xl border-slate-200/80 bg-white/70 shadow-none backdrop-blur-sm focus-visible:ring-[#002065]/25"

const statusLabel: Record<PostStatus, string> = {
  draft: "초안",
  published: "공개",
  archived: "보관",
}

const typeLabel: Partial<Record<ContentType, string>> = {
  notice: "공지사항",
  press: "언론보도",
  blog: "블로그",
  event_archive: "아카이브",
}

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="glass-pane space-y-5 rounded-2xl border border-white/55 p-5 md:p-6">
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

function SubmitButton({ isEdit, contentType }: { isEdit: boolean; contentType: ContentType }) {
  const { pending } = useFormStatus()
  const label = typeLabel[contentType] ?? "글"
  return (
    <Button
      type="submit"
      disabled={pending}
      className="ml-auto h-11 rounded-full bg-[#002065] px-6 font-semibold hover:bg-[#002065]/90"
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? "저장 중…" : isEdit ? "변경 사항 저장" : `${label} 저장`}
    </Button>
  )
}

export function ContentPostForm({
  post,
  contentType,
  action,
  showExternalUrl = false,
  showAttachmentFields = false,
  authorFieldLabel = "작성자",
  defaultAuthor = "KFTE",
  categoryOptions = [],
  defaultCategory,
  showThumbnailField = false,
}: ContentPostFormProps) {
  const metadata = parseContentPostMetadata(post?.metadata ?? null)
  const eventMeta =
    contentType === "event_archive"
      ? parseEventPostMetadata(post?.metadata ?? null)
      : null
  const isEdit = Boolean(post)
  const isArchive = contentType === "event_archive"
  const [category, setCategory] = useState(
    eventMeta?.category ?? metadata.category ?? defaultCategory ?? categoryOptions[0] ?? "",
  )
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft")

  const publicPath =
    contentType === "notice" ||
    contentType === "press" ||
    contentType === "blog" ||
    contentType === "event_archive"
      ? getPublicPathsForContentType(contentType)
      : null

  const [, formAction] = useActionState(async (_: void | null, formData: FormData) => {
    try {
      await action(formData)
    } catch (error) {
      const digest =
        error && typeof error === "object" && "digest" in error
          ? String((error as { digest?: unknown }).digest)
          : ""
      if (digest.startsWith("NEXT_REDIRECT")) throw error
      toast.error(error instanceof Error ? error.message : "저장에 실패했습니다.")
    }
    return null
  }, null)

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-5 pb-24">
      <input type="hidden" name="content_type" value={contentType} />
      {/* Radix Select options unmount when closed — use hidden inputs for submit */}
      {categoryOptions.length > 0 || isArchive ? (
        <input type="hidden" name="metadata_category" value={category} />
      ) : null}
      <input type="hidden" name="status" value={status} />
      {isArchive ? <input type="hidden" name="metadata_cost" value="무료" /> : null}

      {post ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="h-2.5 bg-[#002065]" />
          <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5 md:px-6">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Edit {contentType}
              </p>
              <h2 className="text-xl font-bold tracking-tight text-[#002065] md:text-2xl">
                {post.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={post.status === "published" ? "default" : "secondary"}
                  className={cn(
                    post.status === "published" && "bg-[#002065] hover:bg-[#002065]/90",
                  )}
                >
                  {statusLabel[post.status]}
                </Badge>
                {post.is_pinned ? <Badge variant="outline">상단 고정</Badge> : null}
                {metadata.category ? (
                  <Badge variant="outline">{metadata.category}</Badge>
                ) : null}
                <span className="font-mono text-xs text-muted-foreground">/{post.slug}</span>
              </div>
            </div>
            {publicPath ? (
              <Button asChild type="button" variant="outline" className="h-11 rounded-full">
                <Link href={`${publicPath}/${post.slug}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  공개 페이지
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <FormSection icon={NotebookPen} title="기본 정보" description="목록과 상세에 공통으로 쓰입니다.">
        <Field label="제목" htmlFor="title" required>
          <Input
            id="title"
            name="title"
            defaultValue={post?.title}
            placeholder="제목을 입력하세요"
            required
            className={controlClass}
          />
        </Field>

        {!isArchive ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={authorFieldLabel} htmlFor="metadata_author">
              <Input
                id="metadata_author"
                name="metadata_author"
                defaultValue={metadata.author ?? defaultAuthor}
                placeholder={authorFieldLabel}
                className={controlClass}
              />
            </Field>

            {categoryOptions.length > 0 ? (
              <Field label="카테고리" htmlFor="metadata_category">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="metadata_category" className={controlClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            ) : null}
          </div>
        ) : categoryOptions.length > 0 ? (
          <Field label="카테고리" htmlFor="metadata_category">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="metadata_category" className={controlClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : null}

        <Field
          label="요약"
          htmlFor="summary"
          hint="목록 카드에 표시됩니다. 2~3줄 권장."
        >
          <Textarea
            id="summary"
            name="summary"
            defaultValue={post?.summary ?? ""}
            placeholder="목록에 표시될 짧은 요약"
            className="min-h-[96px] resize-y rounded-xl border-slate-200/80 bg-white/70 shadow-none focus-visible:ring-[#002065]/25"
          />
        </Field>

        <PinToggleField defaultChecked={post?.is_pinned ?? false} />
      </FormSection>

      {isArchive ? (
        <FormSection
          icon={CalendarDays}
          title="행사 정보"
          description="아카이브 정렬·상세에 쓰이는 일정과 장소입니다."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="행사 시작" htmlFor="metadata_event_date" required>
              <Input
                id="metadata_event_date"
                name="metadata_event_date"
                type="datetime-local"
                required
                defaultValue={toDatetimeLocalValue(eventMeta?.eventDate)}
                className={controlClass}
              />
            </Field>
            <Field label="행사 종료 (선택)" htmlFor="metadata_event_end_date">
              <Input
                id="metadata_event_end_date"
                name="metadata_event_end_date"
                type="datetime-local"
                defaultValue={toDatetimeLocalValue(eventMeta?.eventEndDate)}
                className={controlClass}
              />
            </Field>
          </div>
          <Field label="장소" htmlFor="metadata_location" required>
            <Input
              id="metadata_location"
              name="metadata_location"
              required
              defaultValue={eventMeta?.location ?? ""}
              placeholder="예: 서울 강남구 · KFTE 홀"
              className={controlClass}
            />
          </Field>
          <Field label="장소 상세 (선택)" htmlFor="metadata_location_detail">
            <Input
              id="metadata_location_detail"
              name="metadata_location_detail"
              defaultValue={eventMeta?.locationDetail ?? ""}
              placeholder="건물·층·호수 등"
              className={controlClass}
            />
          </Field>
        </FormSection>
      ) : null}

      {showThumbnailField || isArchive ? (
        <FormSection icon={ImageIcon} title="썸네일" description="목록·카드에 쓰이는 대표 이미지입니다.">
          <BlogThumbnailField currentUrl={post?.thumbnail_url} />
        </FormSection>
      ) : null}

      <FormSection icon={FileText} title="본문" description="상세 페이지에 표시되는 본문입니다.">
        <Field label="본문" htmlFor="body">
          <Textarea
            id="body"
            name="body"
            defaultValue={post?.body ?? ""}
            placeholder="본문을 입력하세요"
            className="min-h-[360px] resize-y rounded-xl border-slate-200/80 bg-white/70 font-mono text-sm shadow-none focus-visible:ring-[#002065]/25"
          />
        </Field>
      </FormSection>

      {showExternalUrl ? (
        <FormSection
          icon={Link2}
          title={isArchive ? "관련 링크" : "원문 링크"}
          description={
            isArchive
              ? "행사 페이지·자료 등 관련 URL이 있으면 연결합니다."
              : "외부 기사·원문 URL이 있으면 연결합니다."
          }
        >
          <Field
            label={isArchive ? "관련 URL" : "외부 링크 (원문 URL)"}
            htmlFor="external_url"
          >
            <Input
              id="external_url"
              name="external_url"
              type="url"
              defaultValue={post?.external_url ?? ""}
              placeholder={
                isArchive
                  ? "/activities/events/... 또는 https://..."
                  : "https://example.com/article"
              }
              className={controlClass}
            />
          </Field>
        </FormSection>
      ) : null}

      {showAttachmentFields ? (
        <FormSection icon={Paperclip} title="첨부파일" description="다운로드용 파일 이름과 URL입니다.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="첨부파일 이름" htmlFor="metadata_attachment_name">
              <Input
                id="metadata_attachment_name"
                name="metadata_attachment_name"
                defaultValue={metadata.attachmentName ?? ""}
                placeholder="예: 안내.pdf"
                className={controlClass}
              />
            </Field>
            <Field label="첨부파일 URL" htmlFor="metadata_attachment_url">
              <Input
                id="metadata_attachment_url"
                name="metadata_attachment_url"
                type="url"
                defaultValue={metadata.attachmentUrl ?? ""}
                placeholder="https://..."
                className={controlClass}
              />
            </Field>
          </div>
        </FormSection>
      ) : null}

      <FormSection icon={Settings2} title="게시 설정" description="공개 상태를 선택합니다.">
        <Field label="게시 상태" htmlFor="status">
          <Select value={status} onValueChange={(value) => setStatus(value as PostStatus)}>
            <SelectTrigger id="status" className={cn(controlClass, "w-full sm:w-56")}>
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
          {isEdit
            ? "변경 사항을 저장해야 공개 페이지에 반영됩니다."
            : "저장 후 목록에서 상태를 확인할 수 있습니다."}
        </p>
        <SubmitButton isEdit={isEdit} contentType={contentType} />
      </div>
    </form>
  )
}
