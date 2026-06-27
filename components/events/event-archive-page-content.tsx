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
  ArrowUpRight,
  Archive,
  CalendarDays,
  Clock3,
  LayoutGrid,
  MapPin,
  Sparkles,
  type LucideIcon,
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
import { fadeUpHero, springGentle, tweenSmooth } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
}

const archiveCategoryIcons: Record<string, LucideIcon> = {
  전체: LayoutGrid,
}

function ArchiveCategoryFilter({
  categories,
  selectedCategory,
  onSelect,
  counts,
}: {
  categories: readonly string[]
  selectedCategory: string
  onSelect: (category: string) => void
  counts: Record<string, number>
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="flex shrink-0 gap-1 overflow-x-auto rounded-2xl border border-primary/10 bg-white/70 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_32px_rgba(0,32,101,0.06)] backdrop-blur-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const isActive = selectedCategory === category
        const Icon = archiveCategoryIcons[category]
        const count = counts[category] ?? 0

        return (
          <motion.button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            whileHover={reduceMotion || isActive ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className={cn(
              "relative shrink-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="archive-category-pill"
                className="absolute inset-0 rounded-xl bg-primary shadow-[0_6px_20px_rgba(0,32,101,0.22)]"
                transition={springGentle}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5">
              {Icon ? (
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-colors",
                    isActive ? "text-primary-foreground/90" : "text-primary/45",
                  )}
                />
              ) : null}
              <span className="whitespace-nowrap text-xs font-semibold md:text-sm">{category}</span>
              <motion.span
                layout
                className={cn(
                  "min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold tabular-nums leading-none",
                  isActive
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "bg-primary/[0.06] text-primary/55",
                )}
              >
                {count}
              </motion.span>
            </span>
          </motion.button>
        )
      })}
    </div>
  )
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
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-[#001a52] via-primary to-primary/80 transition-all duration-700 group-hover:grayscale-0",
        className,
      )}
    >
      <Archive className="h-10 w-10 text-primary-foreground/25" aria-hidden />
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
      <p className="mt-3 text-sm text-primary-foreground/65 md:mt-4">{label}</p>
    </MotionEnter>
  )
}

function ArchiveTimelineCard({
  post,
  index,
}: {
  post: EventArchivePost
  index: number
}) {
  const reduceMotion = useReducedMotion()

  return (
    <MotionStaggerItem index={index}>
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={springGentle}
        className="group relative"
      >
        <Link
          href={`/activities/events/archive/${post.id}`}
          className="relative block overflow-hidden rounded-[28px] border border-white/10 bg-white/95 shadow-[0_20px_60px_rgba(0,32,101,0.12)] backdrop-blur-sm transition-shadow hover:shadow-[0_28px_80px_rgba(0,32,101,0.18)]"
        >
          <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[240px]">
              <ArchiveThumbnail post={post} />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
                <span className="rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-white backdrop-blur-sm">
                  ARCHIVE
                </span>
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                  {getEventYear(post.eventDate)}
                </span>
              </div>
              <div
                className="pointer-events-none absolute bottom-3 right-4 text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-none text-white/10"
                aria-hidden
              >
                {formatArchiveMonthDay(post.eventDate)}
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
      categories: categorySet.size,
    }
  }, [config.posts])

  const categoryCounts = useMemo(() => {
    const postsForYear =
      selectedYear === "all"
        ? config.posts
        : config.posts.filter((post) => getEventYear(post.eventDate) === selectedYear)

    const counts: Record<string, number> = { 전체: postsForYear.length }
    for (const category of config.categories) {
      if (category === "전체") continue
      counts[category] = postsForYear.filter((post) => post.category === category).length
    }
    return counts
  }, [config.categories, config.posts, selectedYear])

  return (
    <MotionPage className="min-h-screen overflow-x-clip bg-[#F4F7FF] pb-20 md:pb-28">
      <section
        ref={heroRef}
        className="relative overflow-hidden border-b border-primary/10 bg-primary pt-24 text-primary-foreground"
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
          className="relative mx-auto max-w-[1280px] px-6 pb-20 pt-8 md:px-10 md:pb-24 md:pt-10 lg:px-16 xl:px-20"
        >
          <motion.div
            variants={reduceMotion ? undefined : heroStagger}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
          >
            <motion.p
              variants={fadeUpHero}
              transition={springGentle}
              className="flex items-center gap-2 text-sm font-semibold tracking-[0.22em] uppercase text-primary-foreground/60"
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
              className="mt-12 grid grid-cols-2 gap-8 border-t border-white/15 pt-10 md:max-w-md md:gap-10"
            >
              <StatBlock label="아카이브 행사" value={stats.total} delay={0.05} />
              <StatBlock label="카테고리" value={stats.categories} delay={0.1} />
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
        <div className="mx-auto max-w-[1280px] px-6 py-4 md:px-10 lg:px-16 xl:px-20">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex min-w-0 shrink-0 items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

            <div className="ml-4 shrink-0 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:ml-6">
              <ArchiveCategoryFilter
                categories={config.categories}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
                counts={categoryCounts}
              />
            </div>
          </div>
        </div>
      </div>

      <div ref={timelineRef} className="relative mx-auto max-w-[1280px] px-6 pb-24 pt-10 md:px-10 md:pb-24 md:pt-14 lg:px-16 lg:pt-16 xl:px-20">
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
                  className="relative md:grid md:grid-cols-[48px_minmax(0,1fr)] md:gap-x-8 lg:grid-cols-[56px_minmax(0,1fr)] lg:gap-x-10"
                >
                  <div className="relative hidden md:block">
                    {!reduceMotion && (
                      <div className="absolute bottom-0 left-1/2 top-6 w-px -translate-x-1/2 bg-border">
                        <motion.div
                          className="absolute left-0 top-0 w-full origin-top bg-primary"
                          style={{ height: "100%", scaleY: timelineScaleY }}
                        />
                      </div>
                    )}
                    <div className="relative z-10 mx-auto mt-6 flex h-3 w-3 rounded-full border-2 border-primary bg-[#F4F7FF]" />
                  </div>

                  <div>
                    <MotionReveal className="mb-10 flex flex-wrap items-baseline gap-x-4 gap-y-2 md:mb-14">
                      <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-none tracking-tight text-primary">
                        {year}
                      </h2>
                      <p className="text-sm font-medium text-muted-foreground">
                        {items.length}개의 기록
                      </p>
                    </MotionReveal>

                    <MotionStagger className="space-y-8 md:space-y-10">
                      {items.map((post, index) => (
                        <ArchiveTimelineCard key={post.id} post={post} index={index} />
                      ))}
                    </MotionStagger>
                  </div>
                </motion.section>
              ))}
            </AnimatePresence>
          </div>
        )}

        <MotionEnter delay={0.1} className="mt-20 md:grid md:grid-cols-[48px_minmax(0,1fr)] md:gap-x-8 lg:grid-cols-[56px_minmax(0,1fr)] lg:gap-x-10">
          <div className="hidden md:block" aria-hidden />
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
