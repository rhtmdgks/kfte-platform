"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImageIcon, X } from "lucide-react"
import { toast } from "sonner"
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

    if (file.size > 15 * 1024 * 1024) {
      event.target.value = ""
      setFileName(null)
      toast.error("썸네일은 15MB 이하만 업로드할 수 있습니다.")
      return
    }

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
      <Label htmlFor="thumbnail" className="text-sm font-medium text-slate-700">
        썸네일 이미지{required ? <span className="text-red-500"> *</span> : null}
      </Label>
      <input type="hidden" name="existing_thumbnail_url" value={currentUrl ?? ""} />
      <input type="hidden" name="remove_thumbnail" value={removed ? "1" : "0"} />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative w-full overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50/60 transition-colors",
          "hover:border-[#002065]/40 hover:bg-[#002065]/[0.03]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002065]/30",
          displayUrl ? "aspect-[16/10]" : "flex min-h-[180px] flex-col items-center justify-center gap-3 p-6",
        )}
        aria-label={displayUrl ? "썸네일 변경" : "썸네일 선택"}
      >
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt="썸네일 미리보기"
            fill
            className="object-cover"
            unoptimized={displayUrl.startsWith("blob:")}
          />
        ) : (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#002065]/10 text-[#002065]">
              <ImageIcon className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-center text-sm text-slate-700">
              목록에 표시될 대표 이미지를 첨부하세요
            </p>
            <p className="text-center text-xs text-muted-foreground">
              JPEG, PNG, WebP, GIF · 최대 15MB
            </p>
          </>
        )}
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-full border-slate-200/80"
          onClick={() => inputRef.current?.click()}
        >
          {displayUrl ? "이미지 변경" : "이미지 선택"}
        </Button>
        {displayUrl ? (
          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleRemove}
          >
            <X className="mr-2 h-4 w-4" />
            제거
          </Button>
        ) : null}
        {fileName ? <span className="text-sm text-muted-foreground">{fileName}</span> : null}
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
