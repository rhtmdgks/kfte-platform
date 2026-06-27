"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Button } from "@/components/ui/button"
import { programs as programsContent } from "@/lib/kfte-content"

function ProgramCard({
  program,
  index,
}: {
  program: (typeof programsContent.items)[number]
  index: number
}) {
  const [hovered, setHovered] = useState(false)
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <div
      ref={ref}
      className={`bg-background group transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${(index % 2) * 150}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="overflow-hidden">
        <img
          src={program.image}
          alt={program.title}
          className={`w-full aspect-[4/3] object-cover transition-all duration-[800ms] ease-out ${
            hovered ? "scale-[1.04]" : "scale-100"
          }`}
        />
      </div>
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4 flex-1">
            <span className="text-sm tracking-[0.12em] text-muted-foreground/50 mt-1.5 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm tracking-[0.08em] uppercase font-semibold text-primary mb-2">
                {program.category}
              </p>
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
                {program.title}
              </h3>
            </div>
          </div>
          <ArrowUpRight
            className={`h-4 w-4 text-muted-foreground/40 shrink-0 transition-all duration-300 mt-1.5 ${
              hovered ? "translate-x-0.5 -translate-y-0.5 text-primary" : ""
            }`}
          />
        </div>
        <p className="text-base leading-[1.75] text-muted-foreground mb-6 pl-10">
          {program.description}
        </p>
        <Button asChild variant="outline" size="sm" className="rounded-none ml-10">
          <Link href={program.href}>{program.cta}</Link>
        </Button>
      </div>
    </div>
  )
}

export function ProgramsSection() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section id="programs" className="px-6 py-28 md:px-12 lg:px-20 md:py-36">
      <div
        ref={ref}
        className={`mb-12 md:mb-20 pb-6 border-b border-border transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-muted-foreground mb-3">
          {programsContent.eyebrow}
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-[3rem] font-semibold tracking-tight text-foreground mb-6">
          {programsContent.headline}
        </h2>
        <p className="text-base leading-[1.8] text-muted-foreground max-w-3xl">
          {programsContent.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
        {programsContent.items.map((program, index) => (
          <ProgramCard key={program.title} program={program} index={index} />
        ))}
      </div>
    </section>
  )
}

export { ProgramsSection as ProjectsSection }
