"use client"

import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { cn } from "@/lib/utils"
import { EVENTS, type BonlipEvent } from "./data"
import { SectionEyebrow } from "./section-eyebrow"

function EventCard({ event, index }: { event: BonlipEvent; index: number }) {
  return (
    <div className={cn("relative", index === 0 ? "-rotate-1" : "rotate-1")}>
      {/* 스티커 필은 유리 바깥 — 유리는 overflow:hidden */}
      <span
        className={cn(
          "absolute -right-1.5 -top-3 z-10 rotate-[7deg] rounded-full bg-[var(--neon)] px-3.5 py-1.5",
          "font-unbounded text-[11px] font-bold tracking-[0.14em] text-[var(--bonlip-ink)]",
          "shadow-[0_14px_30px_rgba(198,255,58,0.35)] md:text-[11px]",
        )}
      >
        {event.startPill}
      </span>

      <div className={cn("bonlip-glass p-6 md:p-9", index === 1 && "bonlip-glass--neon")}>
        <p className="font-unbounded text-[11px] font-semibold tracking-[0.3em] text-[var(--neon)] md:text-[12px]">
          {event.label}
        </p>

        <div className="mt-4 flex items-end gap-3">
          <span className="font-unbounded text-[clamp(3rem,7vw,4.5rem)] font-extrabold leading-[0.85] tracking-[-0.03em] text-[var(--paper)]">
            {event.day}
          </span>
          <span className="pb-1.5 font-unbounded text-[12px] font-semibold tracking-[0.2em] text-[var(--neon)]">
            {event.weekday}
          </span>
        </div>

        <h3 className="mt-3 text-[1.25rem] font-bold tracking-[-0.03em] text-[var(--paper)] md:text-[1.4rem]">
          {event.name}
        </h3>
        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-[var(--paper)]/65">
          {event.note}
        </p>

        <dl className="mt-7 grid grid-cols-[4.25rem_1fr] gap-x-3 gap-y-3 border-t border-white/15 pt-5 text-[15px]">
          <dt className="font-unbounded text-[11px] font-semibold tracking-[0.2em] text-[var(--neon)]">
            TIME
          </dt>
          <dd className="font-unbounded text-[14px] font-bold tracking-wide text-[var(--paper)]">
            {event.time}
          </dd>
          <dt className="font-unbounded text-[11px] font-semibold tracking-[0.2em] text-[var(--neon)]">
            PLACE
          </dt>
          <dd className="leading-snug text-[var(--paper)]/85">{event.place}</dd>
        </dl>
      </div>
    </div>
  )
}

export function Events() {
  return (
    <section className="relative px-[clamp(1.25rem,4vw,4.5rem)] py-16 md:py-24">
      <MotionReveal>
        <SectionEyebrow label="EVENTS" aside="two days, one foundation" />
        <h2 className="mt-4 max-w-2xl break-keep text-[clamp(1.6rem,3.6vw,2.5rem)] font-extrabold leading-[1.35] tracking-[-0.04em] text-[var(--paper)]">
          이틀, 대전컨벤션센터
        </h2>
      </MotionReveal>

      <MotionStagger className="mt-10 grid gap-9 md:mt-14 md:grid-cols-2 md:gap-10">
        {EVENTS.map((event, i) => (
          <MotionStaggerItem key={event.id} index={i}>
            <EventCard event={event} index={i} />
          </MotionStaggerItem>
        ))}
      </MotionStagger>
    </section>
  )
}
