"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImageIcon, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BlogThumbnailFieldProps = {
  currentUrl?: string | null
  required?: boolean
}

export function BlogThumbnailField({ currentUrl, required = false }: BlogThumbnailFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null)
  const [removed, setRemoved] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const displayUrl = removed ? null : previewUrl

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setRemoved(false)
    setFileName(file.name)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleRemove = () => {
    setRemoved(true)
    setPreviewUrl(null)
    setFileName(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="thumbnail">
        썸네일 이미지{required ? " *" : ""}
      </Label>
      <input type="hidden" name="existing_thumbnail_url" value={currentUrl ?? ""} />
      <input type="hidden" name="remove_thumbnail" value={removed ? "1" : "0"} />

      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-dashed border-border bg-muted/30",
          displayUrl ? "aspect-[16/10]" : "flex min-h-[180px] flex-col items-center justify-center gap-3 p-6",
        )}
      >
        {displayUrl ? (
          <>
            <Image
              src={displayUrl}
              alt="썸네일 미리보기"
              fill
              className="object-cover"
              unoptimized={displayUrl.startsWith("blob:")}
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-3 top-3 h-8 w-8 rounded-full bg-background/90 shadow-sm"
              onClick={handleRemove}
              aria-label="썸네일 제거"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
            <p className="text-center text-sm text-muted-foreground">
              목록에 표시될 대표 이미지를 첨부하세요
              <br />
              JPEG, PNG, WebP, GIF · 최대 5MB
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
          {displayUrl ? "이미지 변경" : "이미지 선택"}
        </Button>
        {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
      </div>

      <input
        ref={inputRef}
        id="thumbnail"
        name="thumbnail"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        required={required && !displayUrl}
        onChange={handleFileChange}
      />
    </div>
  )
}
