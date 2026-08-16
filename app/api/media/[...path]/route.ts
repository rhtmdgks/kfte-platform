import sharp from "sharp"
import { isAllowedMediaBucket } from "@/lib/site-media"
import { getSupabasePublicEnv } from "@/lib/supabase/config"

export const maxDuration = 30

function bad(status: number, message: string) {
  return new Response(message, { status })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const segments = (await params).path
  const bucket = segments[0]
  if (!bucket || !isAllowedMediaBucket(bucket)) return bad(404, "Not found")
  if (segments.some((part) => part === ".." || part.includes("\\") || part === "")) {
    return bad(400, "Invalid path")
  }

  const env = getSupabasePublicEnv()
  if (!env) return bad(503, "Not configured")

  const objectPath = segments.map(encodeURIComponent).join("/")
  const origin = `${env.url}/storage/v1/object/public/${objectPath}`
  const upstream = await fetch(origin)
  if (!upstream.ok || !upstream.body) return bad(upstream.status === 404 ? 404 : 502, "Not found")

  const contentType = (upstream.headers.get("content-type") || "").toLowerCase()
  const cacheHeaders = {
    "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400",
  }

  // GIF / non-image: stream as-is (canvas/sharp would drop animation)
  if (!contentType.startsWith("image/") || contentType.includes("gif")) {
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        ...cacheHeaders,
      },
    })
  }

  const input = Buffer.from(await upstream.arrayBuffer())
  const output = await sharp(input)
    .rotate()
    .resize({
      width: 1600,
      height: 2400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 76 })
    .toBuffer()

  return new Response(new Uint8Array(output), {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      ...cacheHeaders,
    },
  })
}
