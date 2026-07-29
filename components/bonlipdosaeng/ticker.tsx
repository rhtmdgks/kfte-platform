import { cn } from "@/lib/utils"
import { TICKER_PHRASE } from "./data"

/** 네온 티커 테이프 — 화면 폭을 넘겨 잘리고, 살짝 기울어진 채 무한 스크롤 */
export function TickerTape({
  variant = "neon",
  rotate = "-rotate-[2.5deg]",
  phrase,
  className,
}: {
  variant?: "neon" | "dark"
  rotate?: string
  phrase?: readonly string[]
  className?: string
}) {
  const line = (phrase ?? TICKER_PHRASE).join(" ✦ ")
  const run = `${line} ✦ `

  return (
    <div
      className={cn(
        "overflow-hidden py-2.5",
        rotate,
        variant === "neon"
          ? "bg-[var(--neon)] text-[var(--bonlip-ink)] shadow-[0_14px_44px_rgba(198,255,58,0.28)]"
          : "bonlip-ticker--dark border-y border-[var(--neon)]/20",
        className,
      )}
      aria-hidden
    >
      <div className="bonlip-ticker-track">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="whitespace-nowrap px-3 font-unbounded text-[11px] font-bold uppercase tracking-[0.14em] md:text-[13px]"
          >
            {run.repeat(4)}
          </span>
        ))}
      </div>
    </div>
  )
}
