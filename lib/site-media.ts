const PUBLIC_MARKER = "/storage/v1/object/public/"

const ALLOWED_BUCKETS = new Set([
  "event-posters",
  "blog-thumbnails",
  "event-banners",
  "form-uploads",
])

export function isAllowedMediaBucket(bucket: string) {
  return ALLOWED_BUCKETS.has(bucket)
}

/** Rewrite Supabase public Storage URLs to same-origin `/api/media/...`. */
export function toSiteMediaUrl(url: string | null | undefined): string {
  if (!url) return ""
  if (url.startsWith("/api/media/") || url.startsWith("/") || url.startsWith("blob:")) {
    return url
  }

  try {
    const parsed = new URL(url)
    if (!parsed.hostname.endsWith(".supabase.co")) return url
    const idx = parsed.pathname.indexOf(PUBLIC_MARKER)
    if (idx === -1) return url
    const rest = parsed.pathname.slice(idx + PUBLIC_MARKER.length)
    const [bucket] = rest.split("/")
    if (!bucket || !isAllowedMediaBucket(bucket)) return url
    return `/api/media/${rest}`
  } catch {
    return url
  }
}

export function toAbsoluteSiteMediaUrl(
  url: string | null | undefined,
  siteUrl: string,
): string | undefined {
  const local = toSiteMediaUrl(url)
  if (!local) return undefined
  if (local.startsWith("http://") || local.startsWith("https://")) return local
  return `${siteUrl}${local}`
}
