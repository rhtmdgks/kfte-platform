"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { news as newsContent } from "@/lib/kfte-content"

function NewsEntry({
  entry,
  index,
}: {
  entry: (typeof newsContent.entries)[number]
  index: number
}) {
  return (
    <MotionStaggerItem index={index}>
      <Link href="#" className="group block py-7 md:py-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-sm tracking-[0.12em] uppercase font-semibold text-primary">
                {entry.tag}
              </span>
              <span className="text-sm tracking-[0.12em] text-muted-foreground/50 tabular-nums">
                {entry.date}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
              {entry.title}
            </h3>
            <p className="text-base leading-[1.75] text-muted-foreground max-w-2xl">
              {entry.summary}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm tracking-[0.08em] uppercase font-semibold text-muted-foreground group-hover:text-primary shrink-0 transition-colors">
            자세히 보기
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </Link>
    </MotionStaggerItem>
  )
}

export function NewsSection() {
  return (
    <section id="news" className="px-6 py-28 md:px-12 lg:px-20 md:py-36">
      <MotionReveal className="mb-20 pb-6 border-b border-border">
        <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-muted-foreground mb-3">
          {newsContent.eyebrow}
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-[3rem] font-semibold tracking-tight text-foreground">
          {newsContent.headline}
        </h2>
      </MotionReveal>

      <MotionStagger className="divide-y divide-border">
        {newsContent.entries.map((entry, index) => (
          <NewsEntry key={entry.title} entry={entry} index={index} />
        ))}
      </MotionStagger>
    </section>
  )
}

export { NewsSection as JournalSection }
