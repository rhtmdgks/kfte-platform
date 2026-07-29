"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MotionPage } from "@/components/motion"

const NO_SCROLL_PATHS = [
  "/kfte-os/internal/login",
  "/kfte-os/internal/forgot-password",
  "/kfte-os/internal/reset-password",
]

function isNoScroll(pathname: string) {
  return NO_SCROLL_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
}

function isNoChrome(pathname: string) {
  if (pathname.startsWith("/admin")) return true
  if (
    pathname === "/bonlipdosaeng" ||
    pathname.startsWith("/bonlipdosaeng/")
  ) {
    return true
  }
  return NO_SCROLL_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const noChrome = isNoChrome(pathname)
  const noScroll = isNoScroll(pathname)

  useEffect(() => {
    if (!noScroll) return
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    return () => {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }
  }, [noScroll])

  if (noChrome) {
    return <>{children}</>
  }

  return (
    <>
      <Navigation />
      <MotionPage>{children}</MotionPage>
      <Footer />
    </>
  )
}
