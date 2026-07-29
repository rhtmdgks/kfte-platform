import { cn } from "@/lib/utils"

/** 섹션 아이브로우: Unbounded 레이블 + 우측 이탤릭 세리프 소문자 */
export function SectionEyebrow({
  label,
  aside,
  tone = "dark",
}: {
  label: string
  aside?: string
  tone?: "dark" | "light"
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <p
        className={cn(
          "font-unbounded text-[12px] font-semibold tracking-[0.3em] md:text-[13px]",
          tone === "dark" ? "text-[var(--neon)]" : "text-[var(--green-deep)]",
        )}
      >
        {label}
      </p>
      {aside && (
        <p
          className={cn(
            "font-instrument-serif text-[15px] italic",
            tone === "dark"
              ? "text-[var(--neon-soft)]/80"
              : "text-[var(--green-mid)]",
          )}
        >
          {aside}
        </p>
      )}
    </div>
  )
}
