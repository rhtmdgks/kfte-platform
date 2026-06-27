"use client"

import { MotionPage } from "@/components/motion"

type AdminContentShellProps = {
  children: React.ReactNode
}

export function AdminContentShell({ children }: AdminContentShellProps) {
  return <MotionPage className="flex min-h-screen flex-col">{children}</MotionPage>
}
