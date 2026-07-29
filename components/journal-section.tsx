"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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
      <Link
        href="/news/notices"
        className="group grid gap-2 rounded-xl border border-ink/8 bg-white px-4 py-4 transition-colors hover:border-ink/20 md:grid-cols-[6.5rem_1fr_auto] md:items-center md:gap-6 md:px-5"
      >
        <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-0.5">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ci-gray">
            {entry.tag}
          </span>
          <span className="text-xs text-ci-gray/70 tabular-nums">{entry.date}</span>
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-tight text-ink transition-colors group-hover:text-primary md:text-base">
            {entry.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-[1.65] text-ci-gray">
            {entry.summary}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-ci-gray transition-colors group-hover:text-ink">
          보기
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    </MotionStaggerItem>
  )
}

export function NewsSection() {
  return (
    <section id="news" className="bg-mist px-5 py-12 sm:px-6 md:px-12 md:py-20 lg:px-20">
      <MotionReveal className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ci-gray md:text-sm">
            {newsContent.eyebrow}
          </p>
          <h2 className="text-display-ko text-[clamp(1.5rem,3vw,2.25rem)] text-ink">
            {newsContent.headline}
          </h2>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="shrink-0 self-start rounded-lg border-ink/15 text-ink hover:bg-ink/5"
        >
          <Link href="/news/notices">
            모든 소식
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </MotionReveal>

      <MotionStagger className="flex flex-col gap-2.5">
        {newsContent.entries.map((entry, index) => (
          <NewsEntry key={entry.title} entry={entry} index={index} />
        ))}
      </MotionStagger>
    </section>
  )
}

export { NewsSection as JournalSection }
