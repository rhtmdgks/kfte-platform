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
    <section id="partners" className="px-5 py-14 sm:px-6 md:px-12 md:py-28 lg:px-20 lg:py-36 bg-secondary/40">
      <MotionReveal className="mb-8 border-b border-border pb-4 md:mb-20 md:pb-6">
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

      <MotionReveal delay={0.12} className="text-center">
        <Button asChild size="lg" className="rounded-none">
          <Link href="#contact">{partnersContent.cta}</Link>
        </Button>
      </MotionReveal>
    </section>
  )
}
