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
import { cn } from "@/lib/utils"

type EventBannerFormProps = {
  banner?: EventBanner
  action: (formData: FormData) => Promise<void>
}

const controlClass =
  "h-11 rounded-xl border-slate-200/80 bg-white/80 shadow-none focus-visible:ring-[#002065]/25"

const cardClass = "glass-pane space-y-5 rounded-2xl border border-white/55 p-5 md:p-6"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="ml-auto h-11 rounded-full bg-[#002065] px-6 font-semibold hover:bg-[#002065]/90"
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? "저장 중…" : "배너 저장"}
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
    <form action={formAction} className="mx-auto max-w-2xl space-y-5 pb-24">
      {banner ? <input type="hidden" name="created_at" value={banner.createdAt} /> : null}
      <input type="hidden" name="existing_image_url" value={banner?.imageUrl ?? ""} />
      <input type="hidden" name="image_url" value={imageUrl} />
      <input type="hidden" name="is_active" value={isActive ? "1" : "0"} />

      <section className={cardClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Content
          </p>
          <h2 className="mt-1 text-lg font-semibold text-[#002065]">배너 내용</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">배너 제목 *</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={banner?.title ?? ""}
            placeholder="예: 2026 비즈쿨 창업톤 참가 모집"
            className={controlClass}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">설명</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={banner?.description ?? ""}
            placeholder="배너 왼쪽 영역에 표시될 짧은 설명 (2~3줄)"
            className="min-h-[100px] resize-y rounded-xl border-slate-200/80 bg-white/80 shadow-none focus-visible:ring-[#002065]/25"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_text">부가 정보</Label>
          <Input
            id="meta_text"
            name="meta_text"
            defaultValue={banner?.metaText ?? ""}
            placeholder="예: 2026.08.17 09:00 · 오프라인 행사"
            className={controlClass}
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
            className={controlClass}
          />
        </div>
      </section>

      <section className={cardClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Media
          </p>
          <h2 className="mt-1 text-lg font-semibold text-[#002065]">배너 이미지 *</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            오른쪽 비주얼 · JPEG/PNG/WebP/GIF · 최대 15MB · 권장 가로형/정사각
          </p>
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex min-h-[200px] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50/60 transition-colors",
            "hover:border-[#002065]/40 hover:bg-[#002065]/[0.03]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002065]/30",
            "disabled:pointer-events-none disabled:opacity-60",
          )}
          aria-label={imageUrl ? "이미지 변경" : "이미지 선택"}
        >
          {imageUrl ? (
            <div className="relative h-[220px] w-full max-w-md">
              <Image src={imageUrl} alt="배너 미리보기" fill className="object-contain" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 text-muted-foreground">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#002065]/10 text-[#002065]">
                <ImageIcon className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-sm font-medium text-slate-700">이미지를 선택하거나 클릭</p>
              <p className="text-xs">권장 가로형 · 최대 15MB</p>
            </div>
          )}
          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
              <Loader2 className="h-6 w-6 animate-spin text-[#002065]" />
            </div>
          ) : null}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="h-11 rounded-full border-slate-200/80"
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "업로드 중…" : imageUrl ? "이미지 변경" : "이미지 선택"}
          </Button>
          {imageUrl ? (
            <Button
              type="button"
              variant="ghost"
              className="h-11 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                setImageUrl("")
                if (inputRef.current) inputRef.current.value = ""
              }}
            >
              <X className="mr-2 h-4 w-4" />
              제거
            </Button>
          ) : null}
        </div>
        {uploadError ? (
          <p role="alert" className="text-sm text-destructive">
            {uploadError}
          </p>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </section>

      <section className={cardClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Settings
          </p>
          <h2 className="mt-1 text-lg font-semibold text-[#002065]">노출 설정</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sort_order">정렬 순서</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={banner?.sortOrder ?? 0}
              className={controlClass}
            />
            <p className="text-xs text-muted-foreground">숫자가 작을수록 먼저 표시</p>
          </div>
          <div className="flex items-end">
            <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3">
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
              className={controlClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ends_at">게시 종료 (선택)</Label>
            <Input
              id="ends_at"
              name="ends_at"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(banner?.endsAt ?? undefined)}
              className={controlClass}
            />
          </div>
        </div>
      </section>

      <div className="glass-pane sticky bottom-3 z-20 flex items-center justify-between gap-3 rounded-2xl border border-white/60 px-4 py-3 shadow-[0_12px_40px_-20px_rgba(0,32,101,0.35)] md:px-5">
        <p className="hidden text-sm text-muted-foreground sm:block">
          저장 후 행사 목록 캐러셀에 바로 반영됩니다.
        </p>
        <SubmitButton />
      </div>
    </form>
  )
}
