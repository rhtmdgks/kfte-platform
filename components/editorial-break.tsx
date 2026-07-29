"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { MotionReveal } from "@/components/motion"
import { manifesto } from "@/lib/kfte-content"

/** Manifesto band — monochrome navy glass. Accent reserved for CTA link only. */
export function ManifestoSection() {
  return (
    <section
      id="manifesto"
      className="bg-primary px-5 py-12 text-primary-foreground sm:px-6 md:px-12 md:py-20 lg:px-20"
    >
      <div className="mx-auto max-w-3xl">
        <MotionReveal>
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl md:p-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40 md:text-sm">
              {manifesto.eyebrow}
            </p>
            <h2 className="text-display-ko text-[clamp(1.5rem,3vw,2.15rem)] text-balance text-white">
              {manifesto.headline}
            </h2>
            <div className="mt-6 space-y-4">
              {manifesto.paragraphs.map((p) => (
                <p
                  key={p}
                  className="break-keep text-sm leading-[1.85] text-white/60 md:text-base md:leading-[1.9]"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.08} className="mt-3 grid gap-3 sm:grid-cols-3">
          {manifesto.principles.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-md"
            >
              <h3 className="text-sm font-semibold tracking-tight text-white/90">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-[1.7] text-white/45">
                {item.description}
              </p>
            </div>
          ))}
        </MotionReveal>

        <MotionReveal delay={0.12} className="mt-6">
          <Link
            href="/about/manifesto"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/55 transition-colors hover:text-white"
          >
            선언문 전문 읽기
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </MotionReveal>
      </div>
    </section>
  )
}

export { ManifestoSection as EditorialBreak }
