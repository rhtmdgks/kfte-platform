"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImageIcon, Loader2, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EventPosterFieldProps = {
  currentUrl?: string | null
  currentWidth?: number | null
  currentHeight?: number | null
  /** 새로 업로드된 공개 URL — 부모 form hidden에 반영 */
  onUploadedUrlChange?: (url: string | null) => void
}

export function EventPosterField({
  currentUrl,
  currentWidth,
  currentHeight,
  onUploadedUrlChange,
}: EventPosterFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [removed, setRemoved] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [naturalWidth, setNaturalWidth] = useState<number | null>(currentWidth ?? null)
  const [naturalHeight, setNaturalHeight] = useState<number | null>(currentHeight ?? null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const displayUrl = removed ? null : previewUrl
  const isRemoteOrBlob =
    !!displayUrl &&
    (displayUrl.startsWith("blob:") ||
      displayUrl.startsWith("http://") ||
      displayUrl.startsWith("https://"))

  const commitUploadedUrl = (url: string | null) => {
    setUploadedUrl(url)
    onUploadedUrlChange?.(url)
  }

  useEffect(() => {
    const form = inputRef.current?.closest("form")
    if (!form) return

    const onSubmit = (event: Event) => {
      if (uploading) {
        event.preventDefault()
        setUploadError("이미지 업로드가 끝날 때까지 기다려 주세요.")
        return
      }

      const pendingBlob = !!previewUrl?.startsWith("blob:") && !uploadedUrl
      if (pendingBlob) {
        event.preventDefault()
        setUploadError("상세 이미지 업로드가 완료되지 않았습니다. 다시 선택해 주세요.")
      }
    }

    form.addEventListener("submit", onSubmit)
    return () => form.removeEventListener("submit", onSubmit)
  }, [uploading, previewUrl, uploadedUrl])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setRemoved(false)
    setUploadError(null)
    setFileName(file.name)
    commitUploadedUrl(null)

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    const img = new window.Image()
    img.onload = () => {
      setNaturalWidth(img.naturalWidth || null)
      setNaturalHeight(img.naturalHeight || null)
    }
    img.src = objectUrl

    setUploading(true)
    try {
      const body = new FormData()
      body.append("file", file)

      const response = await fetch("/api/admin/upload-event-poster", {
        method: "POST",
        body,
      })
      const payload = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "상세 페이지 이미지 업로드에 실패했습니다.")
      }

      commitUploadedUrl(payload.url)
      setPreviewUrl(payload.url)
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      commitUploadedUrl(null)
      setPreviewUrl(currentUrl ?? null)
      setFileName(null)
      setNaturalWidth(currentWidth ?? null)
      setNaturalHeight(currentHeight ?? null)
      setUploadError(error instanceof Error ? error.message : "업로드에 실패했습니다.")
      if (inputRef.current) {
        inputRef.current.value = ""
      }
      URL.revokeObjectURL(objectUrl)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setRemoved(true)
    setPreviewUrl(null)
    commitUploadedUrl(null)
    setFileName(null)
    setNaturalWidth(null)
    setNaturalHeight(null)
    setUploadError(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-5">
      <div>
        <Label htmlFor="detail_image">상세 페이지 이미지</Label>
        <p className="mt-1.5 text-xs text-muted-foreground">
          행사 상세 페이지 「프로그램 안내」 아래에 표시됩니다. JPEG/PNG/WebP/GIF · 최대 15MB.
          선택 즉시 업로드됩니다.
        </p>
      </div>

      <input type="hidden" name="existing_detail_image_url" value={currentUrl ?? ""} />
      <input type="hidden" name="remove_detail_image" value={removed ? "1" : "0"} />
      <input type="hidden" name="detail_image_w" value={naturalWidth ?? ""} />
      <input type="hidden" name="detail_image_h" value={naturalHeight ?? ""} />

      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-dashed border-border bg-background",
          displayUrl
            ? "mx-auto flex min-h-[240px] max-w-md items-center justify-center p-3"
            : "flex min-h-[220px] flex-col items-center justify-center gap-3 p-6",
        )}
      >
        {displayUrl ? (
          <>
            {isRemoteOrBlob ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin preview; blob/remote URLs
              <img
                src={displayUrl}
                alt="상세 페이지 이미지 미리보기"
                className="max-h-[420px] w-full object-contain"
              />
            ) : (
              <div className="relative aspect-[3/4] w-full max-w-xs">
                <Image
                  src={displayUrl}
                  alt="상세 페이지 이미지 미리보기"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                <Loader2 className="h-6 w-6 animate-spin text-[#002065]" />
              </div>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-3 top-3 h-8 w-8 rounded-full bg-background/90 shadow-sm"
                onClick={handleRemove}
                aria-label="상세 페이지 이미지 제거"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <>
            <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
            <p className="text-center text-sm text-muted-foreground">
              상세 페이지에 넣을 이미지를 첨부하세요
            </p>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          className="border-[#002065]/20 text-[#002065] hover:bg-[#002065]/5"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              업로드 중…
            </>
          ) : displayUrl ? (
            "이미지 변경"
          ) : (
            "이미지 선택"
          )}
        </Button>
        {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
        {naturalWidth && naturalHeight ? (
          <span className="text-xs text-muted-foreground">
            {naturalWidth}×{naturalHeight}px
          </span>
        ) : null}
        {uploadedUrl ? (
          <span className="text-xs font-medium text-[#002065]">업로드 완료 · 저장을 눌러 반영</span>
        ) : null}
      </div>

      {uploadError ? <p className="text-sm text-destructive">{uploadError}</p> : null}

      <input
        ref={inputRef}
        id="detail_image"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
