const SKIP_TYPES = new Set(["image/gif"])

type CompressOptions = {
  maxEdge: number
  quality: number
  maxBytes: number
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("이미지를 읽지 못했습니다."))
    img.src = src
  })
}

/** Browser-only. Shrinks still images to WebP before upload. GIF is passed through. */
export async function compressImageFile(file: File, options: CompressOptions): Promise<File> {
  if (SKIP_TYPES.has(file.type)) {
    if (file.size > options.maxBytes) {
      throw new Error("GIF는 압축되지 않습니다. 더 작은 파일을 선택해 주세요.")
    }
    return file
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await loadImage(objectUrl)
    const scale = Math.min(1, options.maxEdge / Math.max(img.naturalWidth, img.naturalHeight))
    const width = Math.max(1, Math.round(img.naturalWidth * scale))
    const height = Math.max(1, Math.round(img.naturalHeight * scale))

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("이미지를 압축하지 못했습니다.")
    ctx.drawImage(img, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", options.quality)
    })
    if (!blob) throw new Error("이미지를 압축하지 못했습니다.")
    if (blob.size > options.maxBytes) {
      throw new Error("압축 후에도 파일이 너무 큽니다. 더 작은 이미지를 선택해 주세요.")
    }

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp"
    return new File([blob], name, { type: "image/webp" })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
