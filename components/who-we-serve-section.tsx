"use client"

import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { whoWeServe } from "@/lib/kfte-content"

function AudienceCard({
  audience,
  index,
}: {
  audience: (typeof whoWeServe.audiences)[number]
  index: number
}) {
  return (
    <MotionStaggerItem index={index} className="bg-background p-8 md:p-10 group">
      <span className="text-sm tracking-[0.12em] text-muted-foreground/40">
        ({audience.number})
      </span>
      <h3 className="text-lg md:text-xl font-medium tracking-tight text-foreground mb-4 mt-8 group-hover:translate-x-1 transition-transform duration-500">
        {audience.title}
      </h3>
      <div className="w-8 h-px bg-border mb-4 group-hover:w-12 transition-all duration-500" />
      <p className="text-base leading-[1.75] text-muted-foreground">
        {audience.description}
      </p>
    </MotionStaggerItem>
  )
}

export function WhoWeServeSection() {
  return (
    <section id="who-we-serve" className="px-6 py-28 md:px-12 lg:px-20 md:py-36 bg-secondary/40">
      <MotionReveal className="mb-20 pb-6 border-b border-border">
        <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-muted-foreground mb-3">
          {whoWeServe.eyebrow}
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-[3rem] font-semibold tracking-tight text-foreground">
          {whoWeServe.headline}
        </h2>
      </MotionReveal>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {whoWeServe.audiences.map((audience, index) => (
          <AudienceCard key={audience.number} audience={audience} index={index} />
        ))}
      </MotionStagger>
    </section>
  )
}
