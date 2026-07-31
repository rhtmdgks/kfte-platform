"use client"

import { MotionPage } from "@/components/motion"

type AdminContentShellProps = {
  children: React.ReactNode
}

/** Minimal admin canvas + glass accents via .admin-shell CSS. */
export function AdminContentShell({ children }: AdminContentShellProps) {
  return (
    <MotionPage className="admin-shell relative flex min-h-screen flex-col overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 -top-16 h-80 w-80 rounded-full bg-[#002065]/[0.07] blur-3xl" />
        <div className="absolute -right-20 top-28 h-96 w-96 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-[#002065]/[0.04] blur-3xl" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </MotionPage>
  )
}
