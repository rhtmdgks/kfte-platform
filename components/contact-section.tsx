"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { MotionReveal } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { finalCta, site } from "@/lib/kfte-content"

export function FinalCtaSection() {
  return (
    <section id="contact" className="px-6 py-28 md:px-12 lg:px-20 md:py-36 bg-primary text-primary-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
        <MotionReveal>
          <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-primary-foreground/40 mb-8">
            {finalCta.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold leading-[1.15] tracking-tight text-balance mb-6">
            {finalCta.headline}
          </h2>
          <p className="text-base leading-[1.75] text-primary-foreground/55 mb-10 max-w-lg">
            {finalCta.description}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            {finalCta.actions.map((action) => (
              <Button
                key={action.label}
                asChild
                variant="secondary"
                className="rounded-none bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Link href={action.href}>
                  {action.label}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal delay={0.12} className="flex flex-col justify-end">
          <p className="text-2xl md:text-3xl font-bold tracking-tight mb-10">
            {finalCta.primaryCta}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-primary-foreground/10">
            <div>
              <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-primary-foreground/35 mb-5">
                Email
              </p>
              <a
                href={`mailto:${site.email}`}
                className="text-base leading-[1.75] text-primary-foreground/55 hover:text-primary-foreground transition-colors"
              >
                {site.email}
              </a>
            </div>
            <div>
              <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-primary-foreground/35 mb-5">
                Tel
              </p>
              <a
                href={`tel:${site.phone.replace(/-/g, "")}`}
                className="text-base leading-[1.75] text-primary-foreground/55 hover:text-primary-foreground transition-colors"
              >
                {site.phone}
              </a>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-primary-foreground/35 mb-5">
                Address
              </p>
              <p className="text-base leading-[1.75] text-primary-foreground/55">
                {site.address}
              </p>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}

export { FinalCtaSection as ContactSection }
