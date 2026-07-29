"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PrismStack } from "@/components/prism-stack"
import { fadeUpHero, springGentle } from "@/lib/animation-presets"
import { site } from "@/lib/kfte-content"

const heroStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
}

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      data-hero-section
      className="relative flex min-h-[85svh] items-end overflow-hidden bg-primary text-primary-foreground"
    >
      <PrismStack />

      <motion.div
        className="relative z-10 w-full px-5 pb-10 pt-28 sm:px-6 md:px-12 md:pb-14 md:pt-32 lg:px-20"
        variants={reduceMotion ? undefined : heroStagger}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        <motion.div
          className="relative max-w-xl overflow-hidden rounded-xl border border-white/12 bg-white/[0.07] p-6 backdrop-blur-xl md:max-w-2xl md:p-8"
          variants={fadeUpHero}
          transition={springGentle}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/45 md:text-sm">
            {site.fullName}
          </p>

          <h1 className="break-keep text-[clamp(1.75rem,4.2vw,3.25rem)] font-extrabold leading-[1.35] tracking-tight text-white">
            청소년과 청년의 기술창업을 현실로 연결합니다
          </h1>

          <p className="mt-4 max-w-md text-sm leading-[1.65] text-white/65 md:text-base">
            교육·멘토링·네트워크·커뮤니티로, 기술이 창업이 되는 순간을 만듭니다.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="default"
              className="rounded-lg bg-white text-primary hover:bg-white/90"
            >
              <Link href="/activities/events">
                행사 보기
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="default"
              variant="outline"
              className="rounded-lg border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/about">재단 소개</Link>
            </Button>
          </div>
        </motion.div>

        <motion.p
          className="mt-8 text-xs font-extralight tracking-[0.18em] text-white/25 md:text-sm"
          variants={fadeUpHero}
          transition={springGentle}
          aria-hidden
        >
          {site.concept.toUpperCase()}
        </motion.p>
      </motion.div>
    </section>
  )
}
