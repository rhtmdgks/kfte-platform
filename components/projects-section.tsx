"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
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

  return (
    <MotionStaggerItem
      index={index}
      className="group overflow-hidden rounded-xl border border-ink/8 bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={program.image}
          alt={program.title}
          className="aspect-[16/9] w-full object-cover"
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/70 to-transparent p-4 pt-12">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/70">
            {program.category}
          </p>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold tracking-tight text-ink md:text-xl">
            {program.title}
          </h3>
          <ArrowUpRight
            className={`mt-0.5 h-4 w-4 shrink-0 text-ci-gray transition-all duration-300 ${
              hovered ? "translate-x-0.5 -translate-y-0.5 text-ink" : ""
            }`}
          />
        </div>
        <p className="mt-2 text-sm leading-[1.65] text-ci-gray">{program.description}</p>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-4 rounded-lg border-ink/15 text-ink hover:bg-ink/5"
        >
          <Link href={program.href}>{program.cta}</Link>
        </Button>
      </div>
    </MotionStaggerItem>
  )
}

export function ProgramsSection() {
  return (
    <section id="programs" className="bg-mist px-5 py-12 sm:px-6 md:px-12 md:py-20 lg:px-20">
      <MotionReveal className="mb-8 max-w-2xl md:mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ci-gray md:text-sm">
          {programsContent.eyebrow}
        </p>
        <h2 className="text-display-ko text-[clamp(1.5rem,3vw,2.25rem)] text-ink">
          {programsContent.headline}
        </h2>
        <p className="mt-3 text-sm leading-[1.65] text-ci-gray md:text-base">
          {programsContent.description}
        </p>
      </MotionReveal>

      <MotionStagger className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {programsContent.items.map((program, index) => (
          <ProgramCard key={program.title} program={program} index={index} />
        ))}
      </MotionStagger>
    </section>
  )
}

export { ProgramsSection as ProjectsSection }
