"use client"

import Link from "next/link"
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { partners as partnersContent } from "@/lib/kfte-content"

function PartnerTypeTag({
  type,
  index,
}: {
  type: (typeof partnersContent.types)[number]
  index: number
}) {
  return (
    <MotionStaggerItem
      index={index}
      className="border border-border bg-background p-6"
    >
      <p className="text-sm tracking-[0.12em] uppercase font-semibold text-primary mb-2">
        {type.label}
      </p>
      <p className="text-base leading-[1.7] text-muted-foreground">{type.description}</p>
    </MotionStaggerItem>
  )
}

export function PartnersSection() {
  return (
    <section id="partners" className="px-6 py-28 md:px-12 lg:px-20 md:py-36 bg-secondary/40">
      <MotionReveal className="mb-12 md:mb-20 pb-6 border-b border-border">
        <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-muted-foreground mb-3">
          {partnersContent.eyebrow}
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-[3rem] font-semibold tracking-tight text-foreground mb-6">
          {partnersContent.headline}
        </h2>
        <p className="text-base leading-[1.8] text-muted-foreground max-w-3xl">
          {partnersContent.description}
        </p>
      </MotionReveal>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border mb-12">
        {partnersContent.types.map((type, index) => (
          <PartnerTypeTag key={type.label} type={type} index={index} />
        ))}
      </MotionStagger>

      <MotionReveal delay={0.08}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-12">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-center bg-background p-10 border-0"
            >
              <span className="text-sm tracking-[0.15em] uppercase font-semibold text-muted-foreground/40">
                Partner {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </MotionReveal>

      <MotionReveal delay={0.12} className="text-center">
        <Button asChild size="lg" className="rounded-none">
          <Link href="#contact">{partnersContent.cta}</Link>
        </Button>
      </MotionReveal>
    </section>
  )
}
