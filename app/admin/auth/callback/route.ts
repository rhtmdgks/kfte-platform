import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const target = new URL("/auth/callback", url.origin)

  url.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value)
  })

  if (!target.searchParams.has("portal")) {
    target.searchParams.set("portal", "internal")
  }

  return NextResponse.redirect(target)
}
