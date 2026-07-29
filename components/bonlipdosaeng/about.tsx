"use client"

import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { BRAND, PRINCIPLES } from "./data"
import { SectionEyebrow } from "./section-eyebrow"

/** 프로스트 라이트 섹션 — 선명한 컬러 원판 위에 전면 시트를 덮는다 */
export function About() {
  return (
    <section className="bonlip-frost relative px-[clamp(1.25rem,4vw,4.5rem)] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="bonlip-disc -left-[8%] top-[6%] h-[280px] w-[280px] bg-[var(--neon)] md:h-[400px] md:w-[400px]" />
        <span className="bonlip-disc bottom-[-12%] left-[38%] h-[240px] w-[240px] bg-[var(--green-mid)] md:h-[340px] md:w-[340px]" />
        <span className="bonlip-disc -right-[6%] top-[28%] h-[300px] w-[300px] bg-[var(--neon-deep)] md:h-[420px] md:w-[420px]" />
        <div className="bonlip-frost-sheet" />
      </div>

      <div className="relative">
        <MotionReveal>
          <SectionEyebrow label="ABOUT" aside="from the Analects" tone="light" />
          <h2 className="mt-4 max-w-3xl break-keep text-[clamp(1.75rem,4.2vw,2.9rem)] font-extrabold leading-[1.32] tracking-[-0.045em] text-[var(--green-deep)]">
            근본이 서면{" "}
            <span className="inline-block rounded-[14px] bg-[var(--neon)] px-3.5 py-0.5 text-[var(--bonlip-ink)]">
              길이 생긴다
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--green-deep)]/75 md:text-base">
            {BRAND.hanja} · {BRAND.source}. 네 글자를 이틀의 순서로 옮긴 것이 {BRAND.ko}입니다.
          </p>
        </MotionReveal>

        <MotionStagger className="mt-12 max-w-3xl md:mt-16">
          {PRINCIPLES.map((item, i) => (
            <MotionStaggerItem
              key={item.glyph}
              index={i}
              className="flex gap-4 border-b border-[var(--green-deep)]/20 py-5 first:border-t md:gap-7 md:py-6"
            >
              <div className="flex w-11 shrink-0 flex-col items-center md:w-14">
                <span className="bonlip-stroke-ink font-instrument-serif text-[1.9rem] leading-none md:text-[2.4rem]">
                  {item.glyph}
                </span>
                <span className="mt-1.5 font-unbounded text-[11px] font-semibold tracking-[0.1em] text-[var(--green-mid)]">
                  {item.reading}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-[1.05rem] font-bold tracking-[-0.025em] text-[var(--green-deep)] md:text-[1.2rem]">
                    {item.title}
                  </h3>
                  <span className="font-instrument-serif text-[14px] italic text-[var(--green-mid)]">
                    {item.keyword}
                  </span>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--green-deep)]/70">
                  {item.desc}
                </p>
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  )
}
