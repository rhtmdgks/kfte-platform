"use client"

import { MotionReveal } from "@/components/motion"
import { cn } from "@/lib/utils"
import { BRAND } from "./data"

const BARCODE_WIDTHS = [2, 4, 3, 6, 2, 5, 3, 4, 2, 6, 3, 2, 5, 4, 3, 2, 6, 3, 4, 2, 5, 3]

/** 손그림 화살표 — 버튼을 가리킨다 */
function HandArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M92 6C74 4 44 8 26 26c-6 6-9 13-8 19" />
      <path d="M8 34l10 12M18 46l14-6" />
    </svg>
  )
}

function Barcode({ className }: { className?: string }) {
  return (
    <div className={cn("bonlip-barcode flex h-9 items-stretch gap-[3px]", className)} aria-hidden>
      {BARCODE_WIDTHS.map((w, i) => (
        <span key={`${w}-${i}`} style={{ width: w }} />
      ))}
    </div>
  )
}

export function Apply() {
  return (
    <section className="relative px-[clamp(1.25rem,4vw,4.5rem)] py-16 md:py-24">
      <MotionReveal>
        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#D6FF6B] via-[#C6FF3A] to-[#A8E822] p-7 shadow-[0_28px_70px_rgba(198,255,58,0.28)] md:p-12">
          <span
            className="bonlip-echo--ink pointer-events-none absolute -right-6 bottom-2 select-none font-extrabold leading-none tracking-[-0.06em] text-[clamp(4.5rem,15vw,11rem)]"
            aria-hidden
          >
            {BRAND.hanja}
          </span>

          <div className="relative">
            <p className="font-unbounded text-[11px] font-semibold tracking-[0.3em] text-[var(--bonlip-ink)]/65 md:text-[12px]">
              APPLY
            </p>
            <h2 className="mt-3 max-w-lg break-keep text-[clamp(1.5rem,3.8vw,2.4rem)] font-extrabold leading-snug tracking-[-0.045em] text-[var(--bonlip-ink)]">
              바로 지금, 참가 신청
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--bonlip-ink)]/75">
              신청 링크는 준비 중입니다. 열리면 이 버튼이 신청 페이지로 바로 이어집니다.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <span
                className={cn(
                  "inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-[var(--bonlip-ink)] px-6 py-3.5",
                  "text-[15px] font-bold text-[var(--neon)] opacity-90",
                )}
                aria-disabled
              >
                <span aria-hidden>✦</span>
                신청 준비 중
              </span>

              <div className="flex items-center gap-2 text-[var(--bonlip-ink)]/55">
                <HandArrow className="h-10 w-14 -scale-x-100" />
                <span className="font-unbounded text-[11px] font-semibold tracking-[0.24em]">
                  OPENING SOON
                </span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
              <Barcode className="opacity-35" />
              <p className="font-unbounded text-[11px] font-semibold tracking-[0.22em] text-[var(--bonlip-ink)]/60">
                DCC · DAEJEON
              </p>
            </div>
          </div>
        </div>
      </MotionReveal>
    </section>
  )
}
