"use client"

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
      className="bg-background p-8 md:p-12 group"
    >
      <span className="text-sm tracking-[0.12em] text-muted-foreground/40">
        ({pillar.number})
      </span>
      <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground mb-5 mt-10 group-hover:translate-x-1 transition-transform duration-500">
        {pillar.title}
      </h3>
      <div className="w-8 h-px bg-border mb-5 group-hover:w-12 transition-all duration-500" />
      <p className="text-base leading-[1.75] text-muted-foreground max-w-sm">
        {pillar.description}
      </p>
    </MotionStaggerItem>
  )
}

export function WhatWeDoSection() {
  return (
    <section id="what-we-do" className="px-6 py-28 md:px-12 lg:px-20 md:py-36">
      <MotionReveal className="mb-12 md:mb-20 pb-6 border-b border-border">
        <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-muted-foreground mb-3">
          {whatWeDo.eyebrow}
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-[3rem] font-semibold tracking-tight text-foreground mb-6">
          {whatWeDo.headline}
        </h2>
        <p className="text-base leading-[1.8] text-muted-foreground max-w-3xl">
          {whatWeDo.description}
        </p>
      </MotionReveal>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
        {whatWeDo.pillars.map((pillar, index) => (
          <PillarCard key={pillar.title} pillar={pillar} index={index} />
        ))}
      </MotionStagger>
    </section>
  )
}
