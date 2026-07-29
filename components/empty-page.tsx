"use client"

import { MotionEnter } from "@/components/motion"
import { pageMainClassName } from "@/lib/page-layout"

type EmptyPageProps = {
  label: string
}

/** Stub route placeholder — content not built yet. Keep visible (not blank). */
export function EmptyPage({ label }: EmptyPageProps) {
  return (
    <main className={pageMainClassName} aria-label={label}>
      <MotionEnter className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 xl:px-20">
        <p className="text-sm font-semibold tracking-wide text-primary">{label}</p>
        <h1 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-snug tracking-tight text-foreground">
          페이지 준비 중
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          이 메뉴의 본문은 아직 공개 전입니다. 곧 업데이트됩니다.
        </p>
      </MotionEnter>
    </main>
  )
}
