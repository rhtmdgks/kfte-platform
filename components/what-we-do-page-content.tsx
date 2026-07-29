"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import {
  ArrowUpRight,
  ChevronRight,
  GraduationCap,
  Handshake,
  Lightbulb,
  Network,
  Rocket,
  Sparkles,
} from "lucide-react"
import { MotionEnter, MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { whatWeDoPage, type WhatWeDoPillar } from "@/lib/what-we-do-content"
import { pageMainClassName } from "@/lib/page-layout"
import { fadeUpHero, springGentle, tweenSmooth } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

const flowIcons = [Lightbulb, Rocket, Network, Handshake] as const

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

function FloatingOrb({
  className,
  delay = 0,
}: {
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={cn("absolute rounded-full bg-primary-foreground/10 blur-3xl", className)} />
  }

  return (
    <motion.div
      className={cn("absolute rounded-full bg-primary-foreground/10 blur-3xl", className)}
      animate={{
        y: [0, -18, 0],
        x: [0, 12, 0],
        scale: [1, 1.06, 1],
      }}
      transition={{
        duration: 9 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  )
}

function HeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <FloatingOrb className="left-[8%] top-[18%] h-48 w-48 md:h-72 md:w-72" delay={0} />
      <FloatingOrb className="right-[12%] top-[32%] h-36 w-36 md:h-56 md:w-56" delay={1.2} />
      <FloatingOrb className="bottom-[12%] left-[38%] h-28 w-28 md:h-40 md:w-40" delay={2.4} />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1280px] px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40 lg:px-16 xl:px-20">
        <motion.div
          variants={reduceMotion ? undefined : heroStagger}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <motion.p
            variants={fadeUpHero}
            transition={springGentle}
            className="text-sm tracking-[0.22em] uppercase font-semibold text-primary-foreground/50"
          >
            {whatWeDoPage.hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUpHero}
            transition={springGentle}
            className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.08] tracking-tight"
          >
            <span className="font-light">{whatWeDoPage.hero.titleLight}</span>
            <br />
            <span className="font-bold">{whatWeDoPage.hero.titleBold}</span>
          </motion.h1>

          <motion.p
            variants={fadeUpHero}
            transition={springGentle}
            className="mt-8 max-w-2xl text-base leading-[1.85] text-primary-foreground/70 md:text-lg"
          >
            {whatWeDoPage.hero.description}
          </motion.p>

          <motion.div
            variants={fadeUpHero}
            transition={springGentle}
            className="mt-10 flex flex-wrap gap-2.5"
          >
            {whatWeDoPage.hero.chips.map((chip, index) => (
              <motion.span
                key={chip}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...springGentle, delay: 0.5 + index * 0.06 }}
                className="rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-1.5 text-sm font-medium text-primary-foreground/85 backdrop-blur-sm"
              >
                {chip}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function FlowSection() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 py-20 md:px-10 md:py-28 lg:px-16 xl:px-20">
        <MotionReveal className="mb-14 md:mb-20">
          <p className="text-sm tracking-[0.2em] uppercase font-semibold text-muted-foreground">
            {whatWeDoPage.flow.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl lg:text-4xl">
            {whatWeDoPage.flow.headline}
          </h2>
        </MotionReveal>

        <MotionStagger className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          <div
            className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-border md:block"
            aria-hidden
          />
          {whatWeDoPage.flow.steps.map((step, index) => {
            const Icon = flowIcons[index] ?? Sparkles
            return (
              <MotionStaggerItem key={step.id} index={index} className="relative">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={springGentle}
                  className="group relative rounded-none border border-border bg-background p-6 md:p-7"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-[0.16em] text-muted-foreground/50">
                      {step.number}
                    </span>
                    <motion.div
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary"
                      whileHover={{ rotate: 8, scale: 1.05 }}
                      transition={springGentle}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {step.label}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                  <motion.div
                    className="mt-5 h-0.5 w-0 bg-primary group-hover:w-full"
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </motion.div>
              </MotionStaggerItem>
            )
          })}
        </MotionStagger>
      </div>
    </section>
  )
}

function PillarPanel({ pillar }: { pillar: WhatWeDoPillar }) {
  return (
    <motion.div
      key={pillar.number}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={tweenSmooth}
      className="rounded-none border border-border bg-background p-8 md:p-10 lg:p-12"
    >
      <span className="text-sm tracking-[0.14em] text-muted-foreground/45">
        Pillar {pillar.number}
      </span>
      <h3 className="mt-4 text-2xl font-bold tracking-tight text-primary md:text-3xl">
        {pillar.title}
      </h3>
      <p className="mt-5 max-w-xl text-base leading-[1.85] text-muted-foreground">
        {pillar.description}
      </p>
      <ul className="mt-8 space-y-3">
        {pillar.highlights.map((item, index) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springGentle, delay: 0.08 + index * 0.06 }}
            className="flex items-center gap-3 text-sm font-medium text-foreground/85 md:text-base"
          >
            <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

function PillarsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const pillars = whatWeDoPage.pillars
  const active = pillars[activeIndex]

  useEffect(() => {
    if (isPaused) return

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % pillars.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [isPaused, pillars.length])

  return (
    <section
      className="bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false)
        }
      }}
    >
      <div className="mx-auto max-w-[1280px] px-6 py-20 md:px-10 md:py-28 lg:px-16 xl:px-20">
        <MotionReveal className="mb-12 md:mb-16">
          <p className="text-sm tracking-[0.2em] uppercase font-semibold text-muted-foreground">
            핵심 영역
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            네 개의 기둥으로 지탱하는 KFTE
          </h2>
        </MotionReveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(240px,300px)_1fr] lg:gap-12">
          <MotionReveal delay={0.05}>
            <nav className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {pillars.map((pillar, index) => {
                const isActive = index === activeIndex
                return (
                  <button
                    key={pillar.number}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "relative shrink-0 overflow-hidden rounded-none border px-5 py-4 text-left transition-colors lg:w-full",
                      isActive
                        ? "border-primary text-primary-foreground"
                        : "border-border bg-surface text-foreground hover:border-primary/30",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="pillar-active"
                        className="absolute inset-0 bg-primary"
                        transition={springGentle}
                      />
                    )}
                    <span className="relative z-10 block">
                      <span
                        className={cn(
                          "text-xs tracking-[0.14em]",
                          isActive ? "text-primary-foreground/60" : "text-muted-foreground",
                        )}
                      >
                        {pillar.number}
                      </span>
                      <span className="mt-1 block text-base font-semibold">{pillar.title}</span>
                    </span>
                  </button>
                )
              })}
            </nav>
          </MotionReveal>

          <AnimatePresence mode="wait">
            <PillarPanel key={active.number} pillar={active} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function ProgramsSection() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 py-20 md:px-10 md:py-28 lg:px-16 xl:px-20">
        <MotionReveal className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-muted-foreground">
              {whatWeDoPage.programs.eyebrow}
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              {whatWeDoPage.programs.headline}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            {whatWeDoPage.programs.description}
          </p>
        </MotionReveal>

        <MotionStagger className="grid gap-px bg-border md:grid-cols-2">
          {whatWeDoPage.programs.items.map((program, index) => (
            <ProgramCard key={program.title} program={program} index={index} />
          ))}
        </MotionStagger>

        {/* HIDDEN: 전체 프로그램 보기 — 복구 시 주석 해제
        <MotionReveal delay={0.1} className="mt-10">
          <Button asChild variant="outline" className="rounded-none border-primary text-primary">
            <Link href="/activities/programs">
              전체 프로그램 보기
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </MotionReveal>
        */}
      </div>
    </section>
  )
}

function ProgramCard({
  program,
  index,
}: {
  program: (typeof whatWeDoPage.programs.items)[number]
  index: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <MotionStaggerItem index={index} className="group relative overflow-hidden bg-background">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.img
          src={program.image}
          alt=""
          className="h-full w-full object-cover"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-primary-foreground/70">
            {program.category}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-primary-foreground md:text-2xl">
            {program.title}
          </h3>
        </div>
      </div>
      <div className="p-6 md:p-8">
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          {program.description}
        </p>
        {/* HIDDEN: 프로그램 상세 링크 (/activities/programs) — 복구 시 주석 해제
        <Link
          href={program.href.startsWith("#") ? "/activities/programs" : program.href}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          {program.cta}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
        */}
      </div>
      </div>
    </MotionStaggerItem>
  )
}

function JourneySection() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section ref={ref} className="bg-background">
      <div className="mx-auto max-w-[1280px] px-6 py-20 md:px-10 md:py-28 lg:px-16 xl:px-20">
        <MotionReveal className="mb-14">
          <p className="text-sm tracking-[0.2em] uppercase font-semibold text-muted-foreground">
            {whatWeDoPage.journey.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            {whatWeDoPage.journey.headline}
          </h2>
        </MotionReveal>

        <div className="relative">
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-border md:left-1/2 md:-translate-x-px">
            {!reduceMotion && (
              <motion.div
                className="w-full origin-top bg-primary"
                style={{ scaleY: lineScale, height: "100%" }}
              />
            )}
          </div>

          <div className="space-y-12 md:space-y-16">
            {whatWeDoPage.journey.milestones.map((item, index) => (
              <MotionReveal
                key={item.year}
                delay={index * 0.06}
                className={cn(
                  "relative grid gap-4 md:grid-cols-2 md:gap-16",
                  index % 2 === 1 && "md:[&>div:first-child]:order-2",
                )}
              >
                <div className={cn("pl-10 md:pl-0", index % 2 === 0 ? "md:text-right md:pr-8" : "md:pl-8")}>
                  <span className="text-3xl font-bold tabular-nums text-primary/25 md:text-4xl">
                    {item.year}
                  </span>
                </div>
                <div className="relative pl-10 md:pl-8">
                  <span className="absolute left-0 top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-primary bg-background md:left-[-11px]">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground md:text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {item.description}
                  </p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function EcosystemSection() {
  const hub = whatWeDoPage.ecosystem.nodes.find((n) => n.role === "허브")
  const others = whatWeDoPage.ecosystem.nodes.filter((n) => n.role !== "허브")

  return (
    <section className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1280px] px-6 py-20 md:px-10 md:py-28 lg:px-16 xl:px-20">
        <MotionReveal className="mb-14 max-w-2xl">
          <p className="text-sm tracking-[0.2em] uppercase font-semibold text-primary-foreground/45">
            {whatWeDoPage.ecosystem.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            {whatWeDoPage.ecosystem.headline}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-primary-foreground/65">
            {whatWeDoPage.ecosystem.description}
          </p>
        </MotionReveal>

        <div className="relative mx-auto max-w-3xl">
          {hub && (
            <MotionEnter className="relative z-10 mx-auto mb-12 flex w-fit flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={springGentle}
                className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/10 backdrop-blur-sm md:h-32 md:w-32"
              >
                <GraduationCap className="h-10 w-10 text-primary-foreground" strokeWidth={1.5} />
              </motion.div>
              <p className="mt-4 text-lg font-bold">{hub.label}</p>
              <p className="text-xs tracking-[0.14em] uppercase text-primary-foreground/50">
                {hub.role}
              </p>
            </MotionEnter>
          )}

          <MotionStagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
            {others.map((node, index) => (
              <MotionStaggerItem key={node.label} index={index}>
                <motion.div
                  whileHover={{ y: -6, borderColor: "rgba(248,250,255,0.35)" }}
                  transition={springGentle}
                  className="rounded-none border border-primary-foreground/15 bg-primary-foreground/5 p-5 text-center backdrop-blur-sm"
                >
                  <p className="text-sm font-semibold md:text-base">{node.label}</p>
                  <p className="mt-1 text-[11px] tracking-[0.12em] uppercase text-primary-foreground/45">
                    {node.role}
                  </p>
                </motion.div>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-10 md:py-20 lg:px-16 xl:px-20">
        <MotionReveal>
          <MotionStagger className="grid grid-cols-2 gap-8 border border-border bg-background p-8 md:grid-cols-5 md:gap-6 md:p-12">
            {whatWeDoPage.stats.map((stat, index) => (
              <MotionStaggerItem key={stat.label} index={index} className="text-center md:text-left">
                <p className="text-2xl font-bold tabular-nums text-primary md:text-3xl">
                  {stat.value}
                  <span className="ml-0.5 text-base font-semibold text-muted-foreground">
                    {stat.suffix}
                  </span>
                </p>
                <p className="mt-2 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">
                  {stat.label}
                </p>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </MotionReveal>
      </div>
    </section>
  )
}

function CtaSection() {
  const { cta } = whatWeDoPage

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1280px] px-6 pb-24 pt-8 md:px-10 md:pb-32 lg:px-16 xl:px-20">
        <MotionEnter>
          <div className="relative overflow-hidden border border-border bg-surface px-8 py-14 md:px-14 md:py-16">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/5 blur-2xl"
              aria-hidden
            />
            <h2 className="max-w-xl text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {cta.headline}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              {cta.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {/* HIDDEN: 프로그램·회원사 CTA — 복구 시 what-we-do-content primary/secondary와 함께 주석 해제
              <Button asChild className="rounded-none bg-primary hover:bg-primary/90">
                <Link href={cta.primary.href}>{cta.primary.label}</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-none border-primary text-primary">
                <Link href={cta.secondary.href}>{cta.secondary.label}</Link>
              </Button>
              */}
              <Button asChild className="rounded-none bg-primary hover:bg-primary/90">
                <Link href={cta.tertiary.href}>{cta.tertiary.label}</Link>
              </Button>
            </div>
          </div>
        </MotionEnter>
      </div>
    </section>
  )
}

export function WhatWeDoPageContent() {
  return (
    <main className={cn(pageMainClassName, "bg-background pt-0 md:pt-0 lg:pt-0 pb-0 md:pb-0")}>
      <HeroSection />
      <FlowSection />
      <PillarsSection />
      <ProgramsSection />
      <JourneySection />
      <EcosystemSection />
      <StatsSection />
      <CtaSection />
    </main>
  )
}
