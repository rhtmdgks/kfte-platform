"use client"

import { useActionState, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
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
import type { Tables, Database } from "@/types/database"

type ContentPost = Tables<"content_posts">
type ContentType = Database["public"]["Enums"]["content_type"]

type EventPostFormProps = {
  post?: ContentPost
  contentType: Extract<ContentType, "event">
  action: (formData: FormData) => Promise<void>
  applicationForms?: FormOption[]
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-[#002065] hover:bg-[#002065]/90">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      저장
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
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="content_type" value={contentType} />
      <input type="hidden" name="detail_image_url" value={detailImageUrl} />

      <div className="space-y-2">
        <Label htmlFor="title">행사명 *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={post?.title}
          placeholder="행사 제목을 입력하세요"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="metadata_category">카테고리 *</Label>
          <Select
            name="metadata_category"
            defaultValue={metadata.category ?? eventCategoryOptions[0]}
            required
          >
            <SelectTrigger id="metadata_category">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="metadata_subcategory">세부 분류</Label>
          <Input
            id="metadata_subcategory"
            name="metadata_subcategory"
            defaultValue={metadata.subcategory ?? ""}
            placeholder="예: 오프라인, 연례"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">요약</Label>
        <Textarea
          id="summary"
          name="summary"
          defaultValue={post?.summary ?? ""}
          placeholder="목록·카드에 표시될 짧은 소개 (2~3줄 권장)"
          className="min-h-[96px] resize-y"
        />
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-muted/10 p-5">
        <h3 className="text-sm font-semibold text-[#002065]">이미지</h3>
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
      </div>

      <PinToggleField defaultChecked={post?.is_pinned ?? false} />

      <div className="rounded-lg border border-border bg-muted/20 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#002065]">일정 · 장소</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="metadata_event_date">행사 시작 *</Label>
            <Input
              id="metadata_event_date"
              name="metadata_event_date"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(metadata.eventDate)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metadata_event_end_date">행사 종료</Label>
            <Input
              id="metadata_event_end_date"
              name="metadata_event_end_date"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(metadata.eventEndDate)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="metadata_location">장소 *</Label>
            <Input
              id="metadata_location"
              name="metadata_location"
              defaultValue={metadata.location ?? ""}
              placeholder="예: 서울 강남구"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metadata_location_detail">상세 장소</Label>
            <Input
              id="metadata_location_detail"
              name="metadata_location_detail"
              defaultValue={metadata.locationDetail ?? ""}
              placeholder="예: KFTE 프로그램센터 2층"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metadata_cost">참가 비용</Label>
          <Input
            id="metadata_cost"
            name="metadata_cost"
            defaultValue={metadata.cost ?? "무료"}
            placeholder="무료 또는 금액"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#002065]">신청 · 참가</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="metadata_registration_start">모집 시작</Label>
            <Input
              id="metadata_registration_start"
              name="metadata_registration_start"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(metadata.registrationStart)}
            />
          </div>
        <div className="space-y-2">
          <Label htmlFor="metadata_registration_end">모집 마감</Label>
          <Input
            id="metadata_registration_end"
            name="metadata_registration_end"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(metadata.registrationEnd)}
          />
          <p className="text-xs text-muted-foreground">
            모집 마감일이 지나면 행사 목록에서 아카이브로 자동 이동합니다. (모집 기간 미입력 시
            행사일 기준)
          </p>
        </div>
        </div>

        <div className="space-y-2">
          <Label>신청 폼 / 링크</Label>
          <EventApplicationFormField
            forms={applicationForms}
            initialFormId={metadata.applicationFormId}
            initialExternalUrl={post?.external_url ?? ""}
            eventTitle={post?.title}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="metadata_contact_phone">문의 전화 (T)</Label>
            <Input
              id="metadata_contact_phone"
              name="metadata_contact_phone"
              type="tel"
              defaultValue={metadata.contactPhone ?? ""}
              placeholder="070-7954-8795"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metadata_contact_email">문의 이메일 (E)</Label>
            <Input
              id="metadata_contact_email"
              name="metadata_contact_email"
              type="email"
              defaultValue={metadata.contactEmail ?? ""}
              placeholder="yun@seongyong.com"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          비워 두면 사이트 기본 문의처가 표시됩니다.
        </p>

        <div className="flex items-center gap-2">
          <Checkbox
            id="metadata_featured"
            checked={featured}
            onCheckedChange={(value) => setFeatured(value === true)}
          />
          <input type="hidden" name="metadata_featured" value={featured ? "1" : "0"} />
          <Label htmlFor="metadata_featured" className="font-normal">
            Featured 행사로 목록 상단에 강조 표시
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">프로그램 안내 · 본문</Label>
        <Textarea
          id="body"
          name="body"
          defaultValue={post?.body ?? ""}
          placeholder="행사 상세 프로그램, 대상, 준비물 등을 입력하세요"
          className="min-h-[400px] font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">게시 상태</Label>
        <Select name="status" defaultValue={post?.status ?? "draft"}>
          <SelectTrigger id="status" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">초안</SelectItem>
            <SelectItem value="published">공개</SelectItem>
            <SelectItem value="archived">보관</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <SubmitButton />
      </div>
    </form>
  )
}
