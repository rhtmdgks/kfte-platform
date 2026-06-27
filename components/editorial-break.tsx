"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { manifesto } from "@/lib/kfte-content"

export function ManifestoSection() {
  const { ref: imgRef, isVisible: imgVisible } = useScrollReveal(0.15)
  const { ref: quoteRef, isVisible: quoteVisible } = useScrollReveal(0.2)

  return (
    <section id="manifesto" className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-start">
        <div
          ref={imgRef}
          className={`lg:col-span-7 overflow-hidden transition-all duration-1000 ${
            imgVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80"
            alt="청년 기술창업가 협업"
            className="w-full aspect-[16/10] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>
        <div
          ref={quoteRef}
          className={`lg:col-span-5 transition-all duration-1000 delay-200 ${
            quoteVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-muted-foreground mb-6">
            {manifesto.eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold leading-[1.2] tracking-tight text-foreground text-balance mb-8">
            {manifesto.headline}
          </h2>
          <div className="space-y-5 mb-10">
            {manifesto.paragraphs.map((p) => (
              <p key={p} className="text-base leading-[1.8] text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
          <div className="space-y-6 pt-8 border-t border-border">
            {manifesto.principles.map((item) => (
              <div key={item.title}>
                <h3 className="text-base font-medium text-foreground mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { ManifestoSection as EditorialBreak }
