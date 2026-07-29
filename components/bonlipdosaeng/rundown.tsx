"use client"

import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { cn } from "@/lib/utils"
import { RUNDOWN } from "./data"
import { SectionEyebrow } from "./section-eyebrow"

export function Rundown() {
  return (
    <section className="relative px-[clamp(1.25rem,4vw,4.5rem)] py-16 md:py-24">
      <MotionReveal>
        <SectionEyebrow label="RUNDOWN" aside="how the two days run" />
      </MotionReveal>

      <MotionStagger className="mt-8 grid gap-7 md:mt-12 md:grid-cols-2 md:gap-8">
        {RUNDOWN.map((day, i) => (
          <MotionStaggerItem key={day.day} index={i}>
            <div className="bonlip-glass p-6 md:p-8">
              <div className="flex items-baseline gap-2.5">
                <span className="font-unbounded text-[1.6rem] font-extrabold leading-none tracking-tight text-[var(--paper)]">
                  {day.day}
                </span>
                <span className="font-unbounded text-[11px] font-semibold tracking-[0.2em] text-[var(--neon)]">
                  {day.weekday}
                </span>
                <span className="ml-auto text-[14px] font-semibold text-[var(--paper)]/70">
                  {day.name}
                </span>
              </div>

              <ul className="mt-6">
                {day.rows.map((row) => (
                  <li
                    key={`${day.day}-${row.time}-${row.title}`}
                    className="flex items-baseline gap-4 border-t border-white/[0.12] py-3.5 first:border-t-0 first:pt-0"
                  >
                    <span
                      className={cn(
                        "w-[3.75rem] shrink-0 font-unbounded text-[13px] font-bold tracking-wide",
                        row.pending ? "text-[var(--neon)]/45" : "text-[var(--neon)]",
                      )}
                    >
                      {row.time}
                    </span>
                    <span
                      className={cn(
                        "font-semibold",
                        row.pending
                          ? "text-[var(--paper)]/50"
                          : "text-[var(--paper)]",
                      )}
                    >
                      {row.title}
                    </span>
                    {row.note && (
                      <span className="ml-auto text-right text-[13px] leading-snug text-[var(--paper)]/55">
                        {row.note}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </MotionStaggerItem>
        ))}
      </MotionStagger>
    </section>
  )
}
