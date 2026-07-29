"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImageIcon, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EventPosterFieldProps = {
  currentUrl?: string | null
  currentWidth?: number | null
  currentHeight?: number | null
}

export function EventPosterField({
  currentUrl,
  currentWidth,
  currentHeight,
}: EventPosterFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null)
  const [removed, setRemoved] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [naturalWidth, setNaturalWidth] = useState<number | null>(currentWidth ?? null)
  const [naturalHeight, setNaturalHeight] = useState<number | null>(currentHeight ?? null)

  const displayUrl = removed ? null : previewUrl

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setRemoved(false)
    setFileName(file.name)
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    const img = new window.Image()
    img.onload = () => {
      setNaturalWidth(img.naturalWidth || null)
      setNaturalHeight(img.naturalHeight || null)
    }
    img.src = objectUrl
  }

  const handleRemove = () => {
    setRemoved(true)
    setPreviewUrl(null)
    setFileName(null)
    setNaturalWidth(null)
    setNaturalHeight(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="detail_image">상세 포스터 (세로 이미지)</Label>
      <p className="text-xs text-muted-foreground">
        행사 상세 페이지 본문 아래 실물 전단처럼 표시됩니다. 선택 항목 · JPEG/PNG/WebP/GIF · 최대
        15MB
      </p>
      <input type="hidden" name="existing_detail_image_url" value={currentUrl ?? ""} />
      <input type="hidden" name="remove_detail_image" value={removed ? "1" : "0"} />
      <input type="hidden" name="detail_image_w" value={naturalWidth ?? ""} />
      <input type="hidden" name="detail_image_h" value={naturalHeight ?? ""} />

      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-dashed border-border bg-muted/30",
          displayUrl
            ? "mx-auto aspect-[3/4] max-w-xs"
            : "flex min-h-[220px] flex-col items-center justify-center gap-3 p-6",
        )}
      >
        {displayUrl ? (
          <>
            <Image
              src={displayUrl}
              alt="상세 포스터 미리보기"
              fill
              className="object-contain"
              unoptimized={displayUrl.startsWith("blob:")}
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-3 top-3 h-8 w-8 rounded-full bg-background/90 shadow-sm"
              onClick={handleRemove}
              aria-label="상세 포스터 제거"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
            <p className="text-center text-sm text-muted-foreground">
              세로로 긴 포스터·상세 이미지를 첨부하세요
            </p>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="border-[#002065]/20 text-[#002065] hover:bg-[#002065]/5"
          onClick={() => inputRef.current?.click()}
        >
          {displayUrl ? "포스터 변경" : "포스터 선택"}
        </Button>
        {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
        {naturalWidth && naturalHeight ? (
          <span className="text-xs text-muted-foreground">
            {naturalWidth}×{naturalHeight}px
          </span>
        ) : null}
      </div>

      <input
        ref={inputRef}
        id="detail_image"
        name="detail_image"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
