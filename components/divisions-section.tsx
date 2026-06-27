"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { divisions } from "@/lib/kfte-content"

function DivisionCard({
  division,
  index,
}: {
  division: (typeof divisions.items)[number]
  index: number
}) {
  const { ref, isVisible } = useScrollReveal(0.15)

  return (
    <div
      ref={ref}
      className={`bg-background p-8 md:p-12 group transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${(index % 2) * 120}ms` }}
    >
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
    </div>
  )
}

export function DivisionsSection() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section id="divisions" className="px-6 py-28 md:px-12 lg:px-20 md:py-36">
      <div
        ref={ref}
        className={`mb-20 pb-6 border-b border-border transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-muted-foreground mb-3">
          {divisions.eyebrow}
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-[3rem] font-semibold tracking-tight text-foreground">
          {divisions.headline}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
        {divisions.items.map((division, index) => (
          <DivisionCard key={division.number} division={division} index={index} />
        ))}
      </div>
    </section>
  )
}
