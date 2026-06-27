"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fadeUpHero, springGentle, tweenSmooth } from "@/lib/animation-presets"
import { site } from "@/lib/kfte-content"

const heroStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      data-hero-section
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <motion.img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
          alt="청년 창업가들의 협업과 네트워킹"
          className="h-full w-full object-cover"
          initial={reduceMotion ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 bg-primary/75" />
      </div>

      <motion.div
        className="relative z-10 px-6 pb-16 md:px-12 lg:px-20 md:pb-24"
        variants={reduceMotion ? undefined : heroStagger}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        <div className="max-w-6xl">
          <motion.div className="mb-6" variants={fadeUpHero} transition={springGentle}>
            <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-primary-foreground/60">
              {site.fullName}
            </p>
          </motion.div>

          <motion.div variants={fadeUpHero} transition={springGentle}>
            <h1 className="text-[clamp(2.25rem,6vw,5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-primary-foreground">
              {site.tagline.split("\n").map((line, index) => (
                <span key={line}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-8 text-base md:text-lg leading-[1.8] text-primary-foreground/75 max-w-2xl">
              {site.description}
            </p>
          </motion.div>

          <motion.p
            className="mt-6 text-xs tracking-[0.12em] text-primary-foreground/40 font-medium"
            variants={fadeUpHero}
            transition={springGentle}
          >
            민간 비영리 재단 · 고유번호 316-82-77638
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3"
            variants={fadeUpHero}
            transition={springGentle}
          >
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-none bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link href="/activities/events">
                행사·프로그램 보기
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-none border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="#programs">프로그램 둘러보기</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-none text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/about">재단 소개 보기</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 md:mt-20 flex items-center gap-6"
          variants={fadeUpHero}
          transition={tweenSmooth}
        >
          <div className="w-12 h-px bg-primary-foreground/30" />
          <span className="text-sm tracking-[0.15em] uppercase font-semibold text-primary-foreground/50">
            {site.concept}
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
