"use client"

import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { whoWeServe } from "@/lib/kfte-content"

function AudienceRow({
  audience,
  index,
}: {
  audience: (typeof whoWeServe.audiences)[number]
  index: number
}) {
  return (
    <MotionStaggerItem
      index={index}
      className="group grid gap-2 rounded-xl border border-ink/8 bg-white px-4 py-4 md:grid-cols-[3.5rem_11rem_1fr] md:items-baseline md:gap-6 md:px-5"
    >
      <span className="text-[0.65rem] font-semibold tracking-[0.16em] text-ci-gray tabular-nums">
        {audience.number}
      </span>
      <h3 className="text-base font-bold tracking-tight text-ink md:text-lg">
        {audience.title}
      </h3>
      <p className="text-sm leading-[1.65] text-ci-gray md:col-start-3">
        {audience.description}
      </p>
    </MotionStaggerItem>
  )
}

export function WhoWeServeSection() {
  return (
    <section id="who-we-serve" className="bg-mist px-5 py-12 sm:px-6 md:px-12 md:py-20 lg:px-20">
      <MotionReveal className="mb-8 max-w-2xl md:mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ci-gray md:text-sm">
          {whoWeServe.eyebrow}
        </p>
        <h2 className="text-display-ko text-[clamp(1.5rem,3vw,2.25rem)] text-ink">
          {whoWeServe.headline}
        </h2>
      </MotionReveal>

      <MotionStagger className="flex flex-col gap-2.5">
        {whoWeServe.audiences.map((audience, index) => (
          <AudienceRow key={audience.number} audience={audience} index={index} />
        ))}
      </MotionStagger>
    </section>
  )
}
