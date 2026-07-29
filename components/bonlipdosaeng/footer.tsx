import Link from "next/link"
import { BRAND } from "./data"
import { TickerTape } from "./ticker"

export function BonlipFooter() {
  return (
    <footer className="relative">
      <TickerTape
        variant="dark"
        rotate="rotate-0"
        phrase={[BRAND.hanja, BRAND.en, BRAND.program, "8.16 - 8.17"]}
      />

      <div className="px-[clamp(1.25rem,4vw,4.5rem)] py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-unbounded text-[11px] font-semibold tracking-[0.24em] text-[var(--neon)]">
              ORGANIZER
            </p>
            <div className="mt-3 flex min-h-[3.75rem] items-center gap-4 rounded-2xl border border-dashed border-white/25 bg-white/[0.04] px-5 py-3.5 backdrop-blur-md">
              <span className="text-[13px] text-[var(--paper)]/55">주최 · 주관 로고 영역</span>
            </div>
          </div>

          <div className="md:text-right">
            <p className="font-unbounded text-[11px] font-semibold tracking-[0.2em] text-[var(--paper)]/55">
              {BRAND.en}
            </p>
            <p className="mt-1.5 text-[13px] text-[var(--paper)]/55">
              {BRAND.program} · 대전컨벤션센터
            </p>
            <Link
              href="/"
              className="mt-3 inline-block rounded-full text-[14px] font-semibold text-[var(--neon)] transition-colors hover:text-[var(--neon-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon)]"
            >
              KFTE로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
