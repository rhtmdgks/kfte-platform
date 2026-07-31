"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { EventsPageBanner } from "@/lib/event-types"
import { cn } from "@/lib/utils"

const AUTO_MS = 3000

type EventBannerCarouselProps = {
  banners: readonly EventsPageBanner[]
}

export function EventBannerCarousel({ banners }: EventBannerCarouselProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const count = banners.length

  const goNext = useCallback(() => {
    if (count <= 1) return
    setIndex((current) => (current + 1) % count)
  }, [count])

  const goPrev = useCallback(() => {
    if (count <= 1) return
    setIndex((current) => (current - 1 + count) % count)
  }, [count])

  useEffect(() => {
    if (count <= 1 || hovered || reduceMotion) return
    const timer = window.setInterval(goNext, AUTO_MS)
    return () => window.clearInterval(timer)
  }, [count, hovered, reduceMotion, goNext])

  if (count === 0) return null

  const current = banners[index] ?? banners[0]
  const href = current.linkUrl?.trim() || null

  const slideInner = (
    <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col items-stretch gap-8 px-6 py-10 md:flex-row md:items-center md:gap-12 md:px-10 md:py-12 lg:px-16 xl:px-20">
      <div className="flex min-w-0 flex-1 flex-col justify-center text-white">
        <h2 className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-snug tracking-tight">
          {current.title}
        </h2>
        {current.description ? (
          <p className="mt-4 max-w-xl whitespace-pre-line text-sm leading-relaxed text-white/80 md:text-base">
            {current.description}
          </p>
        ) : null}
        {current.metaText ? (
          <p className="mt-5 text-sm font-medium text-white/70 md:text-[15px]">{current.metaText}</p>
        ) : null}
      </div>

      <div className="relative mx-auto w-full max-w-[420px] shrink-0 md:mx-0 md:w-[42%] md:max-w-[480px]">
        {/* eslint-disable-next-line @next/next/no-img-element -- remote banner art */}
        <img
          src={current.imageUrl}
          alt={current.title}
          className="h-auto w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
        />
      </div>
    </div>
  )

  return (
    <section
      className="relative w-full overflow-hidden bg-[#111111]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-roledescription="carousel"
      aria-label="행사 배너"
    >
      <div className="relative min-h-[280px] md:min-h-[340px] lg:min-h-[380px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {href ? (
              <Link href={href} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                {slideInner}
              </Link>
            ) : (
              slideInner
            )}
          </motion.div>
        </AnimatePresence>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                goPrev()
              }}
              aria-label="이전 배너"
              className={cn(
                "absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-opacity md:left-5 md:h-11 md:w-11",
                hovered ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                goNext()
              }}
              aria-label="다음 배너"
              className={cn(
                "absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-opacity md:right-5 md:h-11 md:w-11",
                hovered ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 right-5 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold tabular-nums text-neutral-800 shadow-sm md:bottom-5 md:right-8">
              {index + 1} / {count}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}
