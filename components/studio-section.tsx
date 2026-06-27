"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { impact } from "@/lib/kfte-content"

export function ImpactSection() {
  const { ref: headRef, isVisible: headVisible } = useScrollReveal(0.15)
  const { ref: bodyRef, isVisible: bodyVisible } = useScrollReveal(0.1)

  return (
    <section id="impact" className="px-6 py-28 md:px-12 lg:px-20 md:py-36 bg-primary text-primary-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
        <div
          ref={headRef}
          className={`transition-all duration-1000 ${
            headVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-primary-foreground/40 mb-8">
            {impact.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold leading-[1.15] tracking-tight text-balance">
            {impact.headline}
          </h2>
          <p className="text-base leading-[1.75] text-primary-foreground/55 mt-8 max-w-lg">
            {impact.description}
          </p>
        </div>

        <div
          ref={bodyRef}
          className={`transition-all duration-1000 delay-200 ${
            bodyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-primary-foreground/10">
            {impact.stats.map((stat) => (
              <div key={stat.label} className={stat.label.includes("멘토") ? "col-span-2 md:col-span-1" : ""}>
                <p className="text-3xl md:text-4xl font-bold text-primary-foreground tracking-tight">
                  {stat.value}
                  <span className="text-lg md:text-xl text-primary-foreground/50 ml-1">
                    {stat.suffix}
                  </span>
                </p>
                <p className="text-sm tracking-[0.08em] uppercase font-semibold text-primary-foreground/35 mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { ImpactSection as StudioSection }
