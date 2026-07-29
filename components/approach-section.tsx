"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { whatWeDo } from "@/lib/kfte-content"

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof whatWeDo.pillars)[number]
  index: number
}) {
  return (
    <MotionStaggerItem
      index={index}
      className="group rounded-xl border border-ink/8 bg-white p-5 md:p-6"
    >
      <span className="text-[0.65rem] font-semibold tracking-[0.16em] text-ci-gray tabular-nums">
        {pillar.number}
      </span>
      <h3 className="mt-3 text-lg font-bold tracking-tight text-ink md:text-xl">
        {pillar.title}
      </h3>
      <p className="mt-2 text-sm leading-[1.65] text-ci-gray">{pillar.description}</p>
    </MotionStaggerItem>
  )
}

export function WhatWeDoSection() {
  return (
    <section id="what-we-do" className="bg-mist px-5 py-12 sm:px-6 md:px-12 md:py-20 lg:px-20">
      <MotionReveal className="mb-8 max-w-2xl md:mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ci-gray md:text-sm">
          {whatWeDo.eyebrow}
        </p>
        <h2 className="text-display-ko text-[clamp(1.5rem,3vw,2.25rem)] text-ink">
          {whatWeDo.headline}
        </h2>
        <p className="mt-3 text-sm leading-[1.65] text-ci-gray md:text-base">
          {whatWeDo.description}
        </p>
        <Link
          href="/about/what-we-do"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 transition-colors hover:text-ink"
        >
          자세히 보기
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </MotionReveal>

      <MotionStagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {whatWeDo.pillars.map((pillar, index) => (
          <PillarCard key={pillar.title} pillar={pillar} index={index} />
        ))}
      </MotionStagger>
    </section>
  )
}
