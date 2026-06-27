"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import {
  ArrowLeft,
  ArrowUpRight,
  Archive,
  CalendarDays,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react"
import {
  MotionEnter,
  MotionPage,
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/motion"
import {
  formatArchiveMonthDay,
  getEventYear,
  groupArchivesByYear,
  type EventArchivePageConfig,
  type EventArchivePost,
} from "@/lib/event-archive-types"
import { formatEventDateRange } from "@/lib/event-types"
import { pageMainClassName } from "@/lib/page-layout"
import { fadeUpHero, springGentle, tweenSmooth } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
}

function ArchiveThumbnail({ post, className }: { post: EventArchivePost; className?: string }) {
  if (post.thumbnailUrl) {
    return (
      <Image
        src={post.thumbnailUrl}
        alt={post.title}
        fill
        className={cn(
          "object-cover transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0",
          "grayscale-[35%] sepia-[12%]",
          className,
        )}
        sizes="(max-width: 768px) 100vw, 420px"
      />
    )
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-end bg-gradient-to-br from-[#001a52] via-primary to-primary/80 p-6 transition-all duration-700 group-hover:grayscale-0",
        className,
      )}
    >
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary-foreground/60">
          Archive
        </p>
        <p className="mt-2 text-xl font-bold text-primary-foreground">{post.category}</p>
      </div>
    </div>
  )
}

function StatBlock({
  label,
  value,
  delay,
}: {
  label: string
  value: string | number
  delay: number
}) {
  return (
    <MotionEnter delay={delay} className="text-center md:text-left">
      <p className="text-[clamp(2rem,4vw,3rem)] font-bold tabular-nums text-primary-foreground">
        {value}
      </p>
      <p className="mt-1 text-sm text-primary-foreground/65">{label}</p>
    </MotionEnter>
  )
}

function ArchiveTimelineCard({
  post,
  index,
  align,
}: {
  post: EventArchivePost
  index: number
  align: "left" | "right"
}) {
  const reduceMotion = useReducedMotion()

  return (
    <MotionStaggerItem index={index}>
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -6 }}
        transition={springGentle}
        className={cn(
          "group relative",
          align === "right" ? "md:pl-12 lg:pl-20" : "md:pr-12 lg:pr-20",
        )}
      >
        <Link
          href={`/activities/events/archive/${post.id}`}
          className="relative block overflow-hidden rounded-[28px] border border-white/10 bg-white/95 shadow-[0_20px_60px_rgba(0,32,101,0.12)] backdrop-blur-sm transition-shadow hover:shadow-[0_28px_80px_rgba(0,32,101,0.18)]"
        >
          <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[240px]">
              <ArchiveThumbnail post={post} />
              <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-white backdrop-blur-sm">
                ARCHIVE
              </div>
              <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                {getEventYear(post.eventDate)}
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  {post.category}
                </span>
                {post.subcategory ? (
                  <span className="text-xs text-muted-foreground">{post.subcategory}</span>
                ) : null}
              </div>
              <h3 className="mt-3 text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-2xl">
                {post.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {post.summary}
              </p>
              <div className="mt-5 space-y-1.5 text-xs text-muted-foreground md:text-sm">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                  {formatEventDateRange(post.eventDate, post.eventEndDate)}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                  {post.location}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                기록 보기
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </Link>

        <div
          className={cn(
            "pointer-events-none absolute top-8 hidden text-[clamp(4rem,8vw,6rem)] font-bold leading-none text-primary/[0.04] md:block",
            align === "left" ? "-left-4 lg:-left-8" : "-right-4 lg:-right-8",
          )}
          aria-hidden
        >
          {formatArchiveMonthDay(post.eventDate)}
        </div>
      </motion.div>
    </MotionStaggerItem>
  )
}

export function EventArchivePageContent({ config }: { config: EventArchivePageConfig }) {
  const [selectedYear, setSelectedYear] = useState<number | "all">("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("전체")
  const reduceMotion = useReducedMotion()
  const timelineRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress: pageProgress } = useScroll()
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.7", "end 0.3"],
  })

  const heroY = useTransform(pageProgress, [0, 0.35], [0, -120])
  const heroOpacity = useTransform(pageProgress, [0, 0.28], [1, 0])
  const heroScale = useTransform(pageProgress, [0, 0.35], [1, 0.96])
  const heroProgressWidth = useTransform(pageProgress, [0, 1], ["0%", "100%"])
  const timelineScaleY = useSpring(useTransform(timelineProgress, [0, 1], [0, 1]), {
    stiffness: 100,
    damping: 30,
  })

  const filteredPosts = useMemo(() => {
    return config.posts.filter((post) => {
      const yearMatch = selectedYear === "all" || getEventYear(post.eventDate) === selectedYear
      const categoryMatch =
        selectedCategory === "전체" || post.category === selectedCategory
      return yearMatch && categoryMatch
    })
  }, [config.posts, selectedCategory, selectedYear])

  const grouped = useMemo(() => groupArchivesByYear(filteredPosts), [filteredPosts])

  const years = useMemo(
    () => [...new Set(config.posts.map((post) => getEventYear(post.eventDate)))].sort((a, b) => b - a),
    [config.posts],
  )

  const stats = useMemo(() => {
    const categorySet = new Set(config.posts.map((post) => post.category))
    return {
      total: config.posts.length,
      years: years.length,
      categories: categorySet.size,
    }
  }, [config.posts, years.length])

  return (
    <MotionPage className={cn(pageMainClassName, "overflow-x-clip bg-[#F4F7FF]")}>
      <section
        ref={heroRef}
        className="relative overflow-hidden border-b border-primary/10 bg-primary text-primary-foreground"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#003080]/40 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <motion.div
          style={reduceMotion ? undefined : { y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative mx-auto max-w-[1280px] px-6 pb-20 pt-28 md:px-10 md:pb-24 md:pt-32 lg:px-16 xl:px-20"
        >
          <motion.div
            variants={reduceMotion ? undefined : heroStagger}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
          >
            <motion.div variants={fadeUpHero} transition={springGentle}>
              <Link
                href={config.eventsPath}
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                진행 중인 행사
              </Link>
            </motion.div>

            <motion.p
              variants={fadeUpHero}
              transition={springGentle}
              className="mt-10 flex items-center gap-2 text-sm font-semibold tracking-[0.22em] uppercase text-primary-foreground/60"
            >
              <Archive className="h-4 w-4" />
              KFTE Event Archive
            </motion.p>

            <motion.h1
              variants={fadeUpHero}
              transition={springGentle}
              className="mt-6 max-w-3xl text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight"
            >
              {config.pageHeading}
            </motion.h1>

            <motion.p
              variants={fadeUpHero}
              transition={springGentle}
              className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/75 md:text-lg"
            >
              {config.description}
            </motion.p>

            <motion.div
              variants={fadeUpHero}
              transition={springGentle}
              className="mt-12 grid grid-cols-3 gap-6 border-t border-white/15 pt-10 md:max-w-xl md:grid-cols-3"
            >
              <StatBlock label="아카이브 행사" value={stats.total} delay={0.05} />
              <StatBlock label="연도" value={stats.years} delay={0.1} />
              <StatBlock label="카테고리" value={stats.categories} delay={0.15} />
            </motion.div>
          </motion.div>
        </motion.div>

        {!reduceMotion && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-white/20"
            style={{ width: heroProgressWidth }}
          />
        )}
      </section>

      <div className="sticky top-[96px] z-40 border-b border-border/60 bg-[#F4F7FF]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16 xl:px-20">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setSelectedYear("all")}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                selectedYear === "all"
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {selectedYear === "all" && (
                <motion.span
                  layoutId="archive-year-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={springGentle}
                />
              )}
              <span className="relative z-10">전체 연도</span>
            </button>
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  selectedYear === year
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {selectedYear === year && (
                  <motion.span
                    layoutId="archive-year-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={springGentle}
                  />
                )}
                <span className="relative z-10">{year}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {config.categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                  selectedCategory === category
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white text-muted-foreground hover:border-primary/30 hover:text-foreground",
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={timelineRef} className="relative mx-auto max-w-[1280px] px-6 pb-24 md:px-10 lg:px-16 xl:px-20">
        {!reduceMotion && (
          <div className="pointer-events-none absolute bottom-0 left-[22px] top-0 hidden w-px bg-border md:block lg:left-[28px]">
            <motion.div
              className="absolute left-0 top-0 w-full origin-top bg-primary"
              style={{ height: "100%", scaleY: timelineScaleY }}
            />
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <MotionReveal className="py-32 text-center">
            <Clock3 className="mx-auto h-12 w-12 text-primary/30" />
            <p className="mt-6 text-lg text-muted-foreground">조건에 맞는 아카이브가 없습니다.</p>
          </MotionReveal>
        ) : (
          <div className="space-y-20 md:space-y-28">
            <AnimatePresence mode="popLayout">
              {grouped.map(({ year, items }) => (
                <motion.section
                  key={year}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={tweenSmooth}
                  className="relative"
                >
                  <MotionReveal className="mb-10 flex items-end gap-6 md:mb-14 md:pl-16 lg:pl-20">
                    <div className="relative">
                      <span className="text-[clamp(3rem,8vw,5.5rem)] font-bold leading-none tracking-tight text-primary">
                        {year}
                      </span>
                      {!reduceMotion && (
                        <motion.span
                          className="absolute -right-3 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={springGentle}
                        >
                          {items.length}
                        </motion.span>
                      )}
                    </div>
                    <p className="pb-2 text-sm text-muted-foreground">{items.length}개의 기록</p>
                  </MotionReveal>

                  <MotionStagger className="space-y-8 md:space-y-10 md:pl-16 lg:pl-20">
                    {items.map((post, index) => (
                      <ArchiveTimelineCard
                        key={post.id}
                        post={post}
                        index={index}
                        align={index % 2 === 0 ? "left" : "right"}
                      />
                    ))}
                  </MotionStagger>
                </motion.section>
              ))}
            </AnimatePresence>
          </div>
        )}

        <MotionEnter delay={0.1} className="mt-20 md:pl-16 lg:pl-20">
          <div className="overflow-hidden rounded-[28px] bg-primary px-8 py-10 text-primary-foreground md:px-12 md:py-14">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.16em] uppercase text-primary-foreground/70">
                  <Sparkles className="h-4 w-4" />
                  Upcoming Events
                </p>
                <h2 className="mt-3 text-2xl font-bold md:text-3xl">다음 현장에서 만나요</h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/75 md:text-base">
                  아카이브는 지나간 기록입니다. KFTE의 다음 프로그램·네트워킹·포럼 일정은 행사
                  페이지에서 확인하세요.
                </p>
              </div>
              <Link
                href={config.eventsPath}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-primary transition-transform hover:scale-[1.02]"
              >
                진행 중인 행사 보기
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </MotionEnter>
      </div>
    </MotionPage>
  )
}
