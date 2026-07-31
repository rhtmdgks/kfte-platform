"use client"

import { useActionState, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import Image from "next/image"
import { ImageIcon, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { EventBanner } from "@/lib/event-banners"
import { toDatetimeLocalValue } from "@/lib/event-metadata"

type EventBannerFormProps = {
  banner?: EventBanner
  action: (formData: FormData) => Promise<void>
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

export function EventBannerForm({ banner, action }: EventBannerFormProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl ?? "")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(banner?.isActive ?? true)
  const [, formAction] = useActionState(async (_: void | null, formData: FormData) => {
    if (imageUrl) formData.set("image_url", imageUrl)
    await action(formData)
    return null
  }, null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setUploading(true)
    try {
      const body = new FormData()
      body.append("file", file)
      const response = await fetch("/api/admin/upload-event-banner", {
        method: "POST",
        body,
      })
      const payload = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "배너 이미지 업로드에 실패했습니다.")
      }
      setImageUrl(payload.url)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "업로드에 실패했습니다.")
      if (inputRef.current) inputRef.current.value = ""
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-6">
      {banner ? <input type="hidden" name="created_at" value={banner.createdAt} /> : null}
      <input type="hidden" name="existing_image_url" value={banner?.imageUrl ?? ""} />
      <input type="hidden" name="image_url" value={imageUrl} />
      <input type="hidden" name="is_active" value={isActive ? "1" : "0"} />

      <div className="space-y-2">
        <Label htmlFor="title">배너 제목 *</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={banner?.title ?? ""}
          placeholder="예: 2026 비즈쿨 창업톤 참가 모집"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={banner?.description ?? ""}
          placeholder="배너 왼쪽 영역에 표시될 짧은 설명 (2~3줄)"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta_text">부가 정보</Label>
        <Input
          id="meta_text"
          name="meta_text"
          defaultValue={banner?.metaText ?? ""}
          placeholder="예: 2026.08.17 09:00 · 오프라인 행사"
        />
        <p className="text-xs text-muted-foreground">일시·유형 등 한 줄 메타 정보</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="link_url">클릭 시 이동 링크</Label>
        <Input
          id="link_url"
          name="link_url"
          type="text"
          inputMode="url"
          defaultValue={banner?.linkUrl ?? ""}
          placeholder="/activities/events/bizcool-startupthon 또는 https://..."
        />
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-5">
        <div>
          <Label>배너 이미지 *</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            오른쪽 비주얼 영역 · JPEG/PNG/WebP/GIF · 최대 15MB · 권장 가로형/정사각
          </p>
        </div>

        <div className="relative flex min-h-[180px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-background">
          {imageUrl ? (
            <>
              <div className="relative h-[200px] w-full max-w-sm">
                <Image src={imageUrl} alt="배너 미리보기" fill className="object-contain" />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-3 top-3 h-8 w-8 rounded-full"
                onClick={() => setImageUrl("")}
                aria-label="이미지 제거"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-10 w-10 opacity-50" />
              <p className="text-sm">배너 이미지를 선택하세요</p>
            </div>
          )}
          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Loader2 className="h-6 w-6 animate-spin text-[#002065]" />
            </div>
          ) : null}
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "업로드 중…" : imageUrl ? "이미지 변경" : "이미지 선택"}
        </Button>
        {uploadError ? <p className="text-sm text-destructive">{uploadError}</p> : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sort_order">정렬 순서</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={banner?.sortOrder ?? 0}
          />
          <p className="text-xs text-muted-foreground">숫자가 작을수록 먼저 표시</p>
        </div>
        <div className="flex items-end pb-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_active"
              checked={isActive}
              onCheckedChange={(value) => setIsActive(value === true)}
            />
            <Label htmlFor="is_active" className="font-normal">
              공개 (활성)
            </Label>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="starts_at">게시 시작 (선택)</Label>
          <Input
            id="starts_at"
            name="starts_at"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(banner?.startsAt ?? undefined)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ends_at">게시 종료 (선택)</Label>
          <Input
            id="ends_at"
            name="ends_at"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(banner?.endsAt ?? undefined)}
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}
