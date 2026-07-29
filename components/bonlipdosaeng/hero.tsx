"use client"

import Link from "next/link"
import { MotionEnter } from "@/components/motion"
import { cn } from "@/lib/utils"
import { BRAND, EVENTS } from "./data"

function MulticolorWordmark({ className }: { className?: string }) {
  return (
    <h1
      className={cn(
        "break-keep font-extrabold leading-[0.95] tracking-[-0.055em] text-[clamp(3.75rem,13vw,9.5rem)]",
        className,
      )}
    >
      <span className="text-[var(--paper)]">본</span>
      <span className="text-[var(--neon)]">립</span>
      <span className="text-[var(--paper)]">도</span>
      <span className="bonlip-title-stroke">생</span>
    </h1>
  )
}

function Stamp() {
  return (
    <div
      className="bonlip-stamp flex h-[104px] w-[104px] shrink-0 flex-col items-center justify-center gap-0.5 text-center md:h-[124px] md:w-[124px]"
      aria-hidden
    >
      <span className="font-unbounded text-[11px] font-semibold tracking-[0.18em] text-[var(--neon)]/75">
        BIZCOOL
      </span>
      <span className="font-instrument-serif text-[1.35rem] italic leading-none text-[var(--neon)] md:text-[1.6rem]">
        {BRAND.hanja}
      </span>
      <span className="font-unbounded text-[11px] font-semibold tracking-[0.18em] text-[var(--neon)]/75">
        2026
      </span>
    </div>
  )
}

function DateChip({
  day,
  weekday,
  name,
  index,
}: {
  day: string
  weekday: string
  name: string
  index: number
}) {
  return (
    <div
      className={cn(
        "flex items-baseline gap-2.5 border-t border-[var(--neon)]/25 pt-3",
        index > 0 && "sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0",
      )}
    >
      <span className="font-unbounded text-[1.5rem] font-extrabold leading-none tracking-tight text-[var(--neon)] md:text-[1.75rem]">
        {day}
      </span>
      <span className="font-unbounded text-[11px] font-semibold tracking-[0.2em] text-[var(--paper)]/60">
        {weekday}
      </span>
      <span className="text-[14px] font-semibold text-[var(--paper)]/85">{name}</span>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col px-[clamp(1.25rem,4vw,4.5rem)] pb-8">
      <header className="flex items-center justify-between gap-4 py-6">
        <p className="font-unbounded text-[11px] font-semibold tracking-[0.24em] text-[var(--neon)] md:text-[12px]">
          {BRAND.program}
        </p>
        <Link
          href="/"
          className="rounded-full px-1 font-unbounded text-[11px] font-semibold tracking-[0.18em] text-[var(--paper)]/65 transition-colors hover:text-[var(--neon-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon)]"
        >
          KFTE HOME
        </Link>
      </header>

      <div className="flex flex-1 flex-col justify-center py-8">
        <MotionEnter delay={0.02}>
          <p className="font-instrument-serif text-[clamp(1.2rem,2.4vw,1.8rem)] italic text-[var(--neon-soft)]">
            {BRAND.serifLine}
          </p>
        </MotionEnter>

        <MotionEnter delay={0.08} className="mt-2 flex items-start gap-3 md:gap-7">
          <MulticolorWordmark />
          <span
            className="mt-6 hidden origin-center rotate-90 font-instrument-serif text-[1.4rem] italic tracking-[0.3em] text-[var(--neon)]/75 lg:inline-block"
            aria-hidden
          >
            {BRAND.hanja}
          </span>
        </MotionEnter>

        <MotionEnter
          delay={0.16}
          className="mt-7 flex flex-col gap-7 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <p className="text-[clamp(1.15rem,2vw,1.5rem)] font-bold leading-snug tracking-[-0.03em] text-[var(--paper)]">
              {BRAND.slogan}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--paper)]/65 md:text-base">
              창업톤 참가주제 · {BRAND.theme}
            </p>
          </div>
          <div className="shrink-0 md:pb-1">
            <Stamp />
          </div>
        </MotionEnter>

        <MotionEnter
          delay={0.24}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-0"
        >
          {EVENTS.map((event, i) => (
            <DateChip
              key={event.id}
              day={event.day}
              weekday={event.weekday}
              name={event.name}
              index={i}
            />
          ))}
        </MotionEnter>
      </div>

      <MotionEnter delay={0.32} className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="bonlip-arrow-down" aria-hidden />
          <span className="bonlip-arrow-down bonlip-arrow-down--trail opacity-30" aria-hidden />
        </div>
        <span className="font-unbounded text-[11px] font-semibold tracking-[0.26em] text-[var(--paper)]/55">
          SCROLL
        </span>
      </MotionEnter>
    </section>
  )
}
