type SharePageLinkOptions = {
  url: string
  title: string
}

export type SharePageLinkResult = "shared" | "copied" | "cancelled" | "failed"

/** 모바일·태블릿 등 터치 기기에서만 네이티브 공유 UI 사용 */
export function shouldUseNativeShare() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false
  }

  if (typeof navigator.share !== "function") {
    return false
  }

  const ua = navigator.userAgent
  const isMobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches
  const hasTouch = navigator.maxTouchPoints > 0

  return isMobileUa || (hasTouch && isCoarsePointer)
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof document === "undefined") return false

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // focus 등으로 실패 시 fallback
    }
  }

  try {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.top = "0"
    textarea.style.left = "0"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    textarea.setSelectionRange(0, text.length)
    const copied = document.execCommand("copy")
    document.body.removeChild(textarea)
    return copied
  } catch {
    return false
  }
}

export async function sharePageLink({
  url,
  title,
}: SharePageLinkOptions): Promise<SharePageLinkResult> {
  if (shouldUseNativeShare()) {
    try {
      await navigator.share({ title, url })
      return "shared"
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled"
      }
    }
  }

  const copied = await copyTextToClipboard(url)
  return copied ? "copied" : "failed"
}
