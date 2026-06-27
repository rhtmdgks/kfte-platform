"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowUpRight,
  Building2,
  ExternalLink,
  Heart,
  Quote,
  Sparkles,
  Target,
  Telescope,
} from "lucide-react"
import { MotionEnter, MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { aboutPage, type AboutIdentityItem } from "@/lib/about-content"
import { pageMainClassName } from "@/lib/page-layout"
import { fadeUpHero, springGentle, tweenSmooth } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

const identityIcons = [Target, Telescope, Heart] as const

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
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
    return <div className={cn("absolute rounded-full bg-primary/5 blur-3xl", className)} />
  }

  return (
    <motion.div
      className={cn("absolute rounded-full bg-primary/5 blur-3xl", className)}
      animate={{ y: [0, -14, 0], x: [0, 10, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 10 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  )
}

function HeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <FloatingOrb className="right-[10%] top-[20%] h-56 w-56 md:h-80 md:w-80" />
      <FloatingOrb className="bottom-[10%] left-[5%] h-40 w-40" delay={1.5} />

      <div className="relative mx-auto max-w-[1280px] px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40 lg:px-16 xl:px-20">
        <motion.div
          variants={reduceMotion ? undefined : heroStagger}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <motion.p
            variants={fadeUpHero}
            transition={springGentle}
            className="text-sm tracking-[0.22em] uppercase font-semibold text-muted-foreground"
          >
            {aboutPage.hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUpHero}
            transition={springGentle}
            className="mt-6 text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.1] tracking-tight text-foreground"
          >
            <span className="font-light">{aboutPage.hero.titleLight}</span>
            <br />
            <span className="font-bold text-primary">{aboutPage.hero.titleBold}</span>
          </motion.h1>

          <motion.div variants={fadeUpHero} transition={springGentle} className="mt-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {aboutPage.hero.concept}
            </span>
            <span className="text-sm text-muted-foreground md:text-base">{aboutPage.hero.tagline}</span>
          </motion.div>

          <motion.p
            variants={fadeUpHero}
            transition={springGentle}
            className="mt-8 max-w-3xl whitespace-pre-line text-base leading-[1.85] text-muted-foreground md:text-lg"
          >
            {aboutPage.hero.description}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

function ChairmanSection() {
  const { chairmanGreeting: greeting } = aboutPage

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1280px] px-6 py-20 md:px-10 md:py-28 lg:px-16 xl:px-20">
        <MotionReveal className="mb-12 md:mb-16">
          <p className="text-sm tracking-[0.2em] uppercase font-semibold text-muted-foreground">
            {greeting.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            이사장 {greeting.name}의 인사
          </h2>
        </MotionReveal>

        <div className="grid gap-10 lg:grid-cols-[minmax(320px,440px)_1fr] lg:gap-16 xl:gap-20">
          <MotionReveal delay={0.05}>
            <div className="relative lg:sticky lg:top-28">
              <div className="flex min-h-[420px] items-end justify-center overflow-hidden bg-surface px-2 pt-4 md:min-h-[480px] md:px-4 lg:min-h-[520px]">
                <Image
                  src={greeting.image}
                  alt={greeting.imageAlt}
                  width={720}
                  height={900}
                  className="h-auto w-full max-w-[400px] object-contain object-bottom md:max-w-[440px] lg:max-w-full"
                  priority
                />
              </div>
              <div className="mt-5 border-l-2 border-primary pl-4">
                <p className="text-lg font-bold text-foreground">{greeting.name}</p>
                <p className="text-sm text-muted-foreground">{greeting.role}</p>
                {greeting.linkedin && (
                  <a
                    href={greeting.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    LinkedIn
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <div className="relative">
              <Quote className="absolute -left-2 -top-4 h-12 w-12 text-primary/10 md:-left-6" aria-hidden />
              <div className="space-y-6 text-base leading-[1.9] text-foreground/90 md:text-[17px]">
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={springGentle}
                  className="text-lg font-semibold text-foreground"
                >
                  {greeting.salutation}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ ...springGentle, delay: 0.06 }}
                >
                  {greeting.opening}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ ...springGentle, delay: 0.12 }}
                >
                  {greeting.body}
                </motion.p>
                {greeting.closing.map((line, index) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ ...springGentle, delay: 0.18 + index * 0.06 }}
                    className={index === 0 ? "pt-2 font-medium text-foreground" : undefined}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ ...springGentle, delay: 0.45 }}
                className="mt-10 space-y-1 text-right text-sm leading-relaxed text-foreground md:text-base"
              >
                <p className="text-muted-foreground">{greeting.date}</p>
                <p className="font-medium">{greeting.signatureRole}</p>
                <p className="text-lg font-semibold text-primary">{greeting.signatureName}</p>
              </motion.div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  )
}

function IdentityPanel({ item }: { item: AboutIdentityItem }) {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={tweenSmooth}
      className="border border-border bg-background p-8 md:p-10"
    >
      <p className="text-xs font-semibold tracking-[0.18em] uppercase text-primary">{item.label}</p>
      <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground">{item.title}</h3>
      <p className="mt-5 text-base leading-[1.85] text-muted-foreground">{item.description}</p>
    </motion.div>
  )
}

function IdentitySection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const items = aboutPage.identity.items
  const active = items[activeIndex]

  useEffect(() => {
    if (isPaused) return
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [isPaused, items.length])

  return (
    <section
      className="border-y border-border bg-surface"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1280px] px-6 py-20 md:px-10 md:py-28 lg:px-16 xl:px-20">
        <MotionReveal className="mb-12 md:mb-16">
          <p className="text-sm tracking-[0.2em] uppercase font-semibold text-muted-foreground">
            {aboutPage.identity.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            {aboutPage.identity.headline}
          </h2>
        </MotionReveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(220px,280px)_1fr] lg:gap-12">
          <MotionStagger className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {items.map((item, index) => {
              const Icon = identityIcons[index] ?? Sparkles
              const isActive = index === activeIndex
              return (
                <MotionStaggerItem key={item.id} index={index} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "relative flex w-full items-center gap-3 overflow-hidden rounded-none border px-4 py-4 text-left transition-colors min-w-[200px] lg:min-w-0",
                      isActive
                        ? "border-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/30",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="about-identity-active"
                        className="absolute inset-0 bg-primary"
                        transition={springGentle}
                      />
                    )}
                    <span
                      className={cn(
                        "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        isActive
                          ? "bg-primary-foreground/15 text-primary-foreground"
                          : "bg-primary/10 text-primary",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="relative z-10">
                      <span className="block text-xs tracking-[0.14em] uppercase opacity-70">{item.label}</span>
                      <span className="block text-sm font-semibold">{item.title}</span>
                    </span>
                  </button>
                </MotionStaggerItem>
              )
            })}
          </MotionStagger>

          <AnimatePresence mode="wait">
            <IdentityPanel key={active.id} item={active} />
          </AnimatePresence>
        </div>

        <MotionStagger className="mt-10 grid gap-px bg-border md:grid-cols-3 lg:hidden">
          {items.map((item, index) => (
            <MotionStaggerItem key={item.id} index={index} className="bg-background p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{item.label}</p>
              <p className="mt-2 font-semibold text-foreground">{item.title}</p>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  )
}

function StorySection() {
  const { story } = aboutPage

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1280px] px-6 py-20 md:px-10 md:py-28 lg:px-16 xl:px-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <MotionReveal>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-primary-foreground/45">
              {story.eyebrow}
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              {story.headline}
            </h2>
            <blockquote className="mt-10 border-l-2 border-primary-foreground/30 pl-6 text-xl font-light leading-snug text-primary-foreground/90 md:text-2xl">
              {story.pullQuote}
            </blockquote>
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <div className="space-y-6 text-base leading-[1.85] text-primary-foreground/75 md:text-lg">
              {story.paragraphs.map((paragraph, index) => (
                <p key={index}>
                  <strong className="font-semibold text-primary-foreground">{paragraph.lead}</strong>
                  {" — "}
                  {paragraph.text}
                </p>
              ))}
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  )
}

function FactsSection() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1280px] px-6 py-20 md:px-10 md:py-28 lg:px-16 xl:px-20">
        <MotionReveal className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-muted-foreground">
              {aboutPage.facts.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              {aboutPage.facts.headline}
            </h2>
          </div>
          <Building2 className="hidden h-10 w-10 text-primary/20 md:block" strokeWidth={1.25} />
        </MotionReveal>

        <MotionStagger className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {aboutPage.facts.items.map((item, index) => (
            <MotionStaggerItem key={item.label} index={index} className="bg-surface p-6 md:p-8">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-foreground md:text-base">
                {item.value}
              </p>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  )
}

function ExploreCard({
  link,
  index,
}: {
  link: (typeof aboutPage.explore.links)[number]
  index: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <MotionStaggerItem index={index}>
      <Link
        href={link.href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group flex h-full flex-col justify-between border border-border bg-background p-6 transition-colors hover:border-primary/40 md:p-8"
      >
        <div>
          <motion.div
            animate={{ x: hovered ? 4 : 0 }}
            transition={springGentle}
            className="flex items-start justify-between gap-3"
          >
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary md:text-xl">
              {link.title}
            </h3>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" />
          </motion.div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{link.description}</p>
        </div>
        <span className="mt-6 text-xs font-semibold tracking-[0.12em] uppercase text-primary/70">
          자세히 보기
        </span>
      </Link>
    </MotionStaggerItem>
  )
}

function ExploreSection() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 py-20 md:px-10 md:py-28 lg:px-16 xl:px-20">
        <MotionReveal className="mb-12">
          <p className="text-sm tracking-[0.2em] uppercase font-semibold text-muted-foreground">
            {aboutPage.explore.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            {aboutPage.explore.headline}
          </h2>
        </MotionReveal>

        <MotionStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aboutPage.explore.links.map((link, index) => (
            <ExploreCard key={link.href} link={link} index={index} />
          ))}
        </MotionStagger>
      </div>
    </section>
  )
}

function CtaSection() {
  const { cta } = aboutPage

  return (
    <section className="bg-background pb-24 md:pb-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 xl:px-20">
        <MotionEnter>
          <div className="relative overflow-hidden border border-primary/15 bg-primary px-8 py-14 text-primary-foreground md:px-14 md:py-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/5 blur-3xl" />
            <h2 className="relative max-w-xl text-2xl font-bold tracking-tight md:text-3xl">{cta.headline}</h2>
            <p className="relative mt-4 max-w-lg text-base leading-relaxed text-primary-foreground/75">
              {cta.description}
            </p>
            <div className="relative mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-none bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Link href={cta.primary.href}>{cta.primary.label}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href={cta.secondary.href}>{cta.secondary.label}</Link>
              </Button>
            </div>
          </div>
        </MotionEnter>
      </div>
    </section>
  )
}

export function AboutPageContent() {
  return (
    <main className={cn(pageMainClassName, "bg-background pt-0 md:pt-0 lg:pt-0 pb-0 md:pb-0")}>
      <HeroSection />
      <ChairmanSection />
      <IdentitySection />
      <StorySection />
      <FactsSection />
      <ExploreSection />
      <CtaSection />
    </main>
  )
}
