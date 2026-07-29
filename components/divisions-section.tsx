"use client"

import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { divisions } from "@/lib/kfte-content"

function DivisionCard({
  division,
  index,
}: {
  division: (typeof divisions.items)[number]
  index: number
}) {
  return (
    <MotionStaggerItem index={index} className="bg-background p-8 md:p-12 group">
      <span className="text-sm tracking-[0.12em] text-muted-foreground/40">
        ({division.number})
      </span>
      <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground mb-5 mt-10 group-hover:translate-x-1 transition-transform duration-500">
        {division.title}
      </h3>
      <div className="w-8 h-px bg-border mb-5 group-hover:w-12 transition-all duration-500" />
      <p className="text-base leading-[1.75] text-muted-foreground max-w-sm">
        {division.description}
      </p>
    </MotionStaggerItem>
  )
}

export function DivisionsSection() {
  return (
    <section id="divisions" className="px-5 py-14 sm:px-6 md:px-12 md:py-28 lg:px-20 lg:py-36">
      <MotionReveal className="mb-8 pb-4 md:mb-20 md:pb-6 border-b border-border">
        <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-muted-foreground mb-3">
          {divisions.eyebrow}
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-[3rem] font-semibold tracking-tight text-foreground">
          {divisions.headline}
        </h2>
      </MotionReveal>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
        {divisions.items.map((division, index) => (
          <DivisionCard key={division.number} division={division} index={index} />
        ))}
      </MotionStagger>
    </section>
  )
}
