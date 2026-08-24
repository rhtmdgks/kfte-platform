"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
  Pin,
  Search,
  Sparkles,
} from "lucide-react"
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import {
  formatEventDateRange,
  formatEventListDate,
  type EventCategory,
  type EventPost,
  type EventsPageConfig,
} from "@/lib/event-types"
import { EventStatusBadge } from "@/components/events/event-status-badge"
import { EventBannerCarousel } from "@/components/events/event-banner-carousel"
import { fadeUpHero, listItem, springGentle, tweenSmooth } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const OVERVIEW_ITEMS_PER_PAGE = 3
const CATEGORY_ITEMS_PER_PAGE = 8

function EventThumbnail({
  event,
  className,
  priority = false,
}: {
  event: EventPost
  className?: string
  priority?: boolean
}) {
  if (event.thumbnailUrl) {
    return (
      <Image
        src={event.thumbnailUrl}
        alt={event.title}
        fill
        className={cn("object-cover", className)}
        sizes="(max-width: 768px) 100vw, 280px"
        priority={priority}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-end bg-gradient-to-br from-primary/90 via-primary to-[#001a52] p-5",
        className,
      )}
    >
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] uppercase text-primary-foreground/70">
          KFTE Event
        </p>
        <p className="mt-1 line-clamp-2 text-lg font-bold leading-snug text-primary-foreground">
          {event.category}
        </p>
      </div>
    </div>
  )
}

function FeaturedEventCard({ event }: { event: EventPost }) {
  return (
    <MotionReveal delay={0.08}>
      <Link
        href={`/activities/events/${event.id}`}
        className="group grid overflow-hidden rounded-[24px] border border-border/60 bg-surface shadow-[0_8px_32px_rgba(0,32,101,0.06)] transition-shadow hover:shadow-[0_16px_48px_rgba(0,32,101,0.1)] md:grid-cols-2"
      >
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[320px]">
          <EventThumbnail event={event} priority className="transition-transform duration-500 group-hover:scale-[1.02]" />
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-md ring-2 ring-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              Featured
            </span>
            <EventStatusBadge event={event} overlay />
          </div>
        </div>
        <div className="flex flex-col justify-center p-6 md:p-10">
          <p className="text-sm font-semibold text-primary">{event.category}</p>
          <h2 className="mt-3 text-2xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-3xl">
            {event.title}
          </h2>
          <p className="mt-4 line-clamp-3 text-base leading-relaxed text-muted-foreground">
            {event.summary}
          </p>
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-primary/70" />
              {formatEventDateRange(event.eventDate, event.eventEndDate)}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
              {event.location}
              {event.locationDetail ? ` · ${event.locationDetail}` : ""}
            </p>
          </div>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            자세히 보기
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </MotionReveal>
  )
}

function EventCompactCard({ event, index }: { event: EventPost; index: number }) {
  return (
    <MotionStaggerItem index={index}>
      <Link
        href={`/activities/events/${event.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-border/60 bg-background shadow-[0_4px_20px_rgba(0,32,101,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,32,101,0.1)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <EventThumbnail event={event} className="transition-transform duration-500 group-hover:scale-[1.03]" />
          <div className="absolute left-3 top-3">
            <EventStatusBadge event={event} overlay />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4 md:p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary">
              {event.category}
            </span>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {formatEventListDate(event.eventDate)}
            </span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-lg">
            {event.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
            {event.summary}
          </p>
        </div>
      </Link>
    </MotionStaggerItem>
  )
}

function EventListRow({ event }: { event: EventPost }) {
  return (
    <motion.article
      layout
      variants={listItem}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={tweenSmooth}
    >
      <Link
        href={`/activities/events/${event.id}`}
        className="group flex flex-col gap-4 rounded-[20px] bg-white p-4 transition-shadow hover:shadow-[0_8px_30px_rgba(0,32,101,0.08)] sm:flex-row sm:gap-8 sm:p-5"
      >
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-[16px] sm:w-[240px] md:w-[280px] md:rounded-[20px]">
          <EventThumbnail event={event} className="transition-transform duration-500 group-hover:scale-[1.03]" />
          <div className="absolute left-3 top-3">
            <EventStatusBadge event={event} overlay />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 md:py-2">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-sm font-semibold text-primary">{event.category}</span>
              {event.subcategory ? (
                <span className="text-sm text-muted-foreground">{event.subcategory}</span>
              ) : null}
              <EventStatusBadge event={event} className="sm:hidden" />
            </div>
            <h2 className="mt-2 inline-flex items-start gap-2 text-[18px] font-bold leading-snug text-black transition-colors group-hover:text-[#002065] md:text-[24px] md:leading-[1.35]">
              {event.pinned ? (
                <Pin
                  className="mt-1 h-4 w-4 shrink-0 fill-[#002065] text-[#002065] md:h-5 md:w-5"
                  aria-label="상단 고정"
                />
              ) : null}
              <span>{event.title}</span>
            </h2>
            {event.summary ? (
              <p className="mt-3 line-clamp-2 text-[14px] leading-[1.7] text-[#555555] md:text-[16px] md:leading-[1.75]">
                {event.summary}
              </p>
            ) : null}
          </div>

          <div className="mt-4 space-y-1.5 text-[13px] text-[#7B7B7B] md:mt-6 md:text-[14px]">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0" />
              {formatEventDateRange(event.eventDate, event.eventEndDate)}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {event.location}
              {event.locationDetail ? ` · ${event.locationDetail}` : ""}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-1 disabled:opacity-30"
        aria-label="첫 페이지"
      >
        <ChevronsLeft className="h-4 w-4 text-muted-foreground" />
      </button>
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-1 disabled:opacity-30"
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
      </button>
      {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
        const pageNumber = index + 1
        return (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={cn(
              "px-2 text-sm font-medium",
              currentPage === pageNumber ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {pageNumber}
          </button>
        )
      })}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-1 disabled:opacity-30"
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-4 w-4 text-foreground" />
      </button>
      <button
        type="button"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-1 disabled:opacity-30"
        aria-label="마지막 페이지"
      >
        <ChevronsRight className="h-4 w-4 text-foreground" />
      </button>
    </div>
  )
}

export function EventsPageContent({ config }: { config: EventsPageConfig }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("전체")
  const [currentPage, setCurrentPage] = useState(1)
  const reduceMotion = useReducedMotion()

  const isOverviewMode = selectedCategory === "전체" && !searchQuery.trim()
  const itemsPerPage = isOverviewMode ? OVERVIEW_ITEMS_PER_PAGE : CATEGORY_ITEMS_PER_PAGE

  const featuredEvent = useMemo(
    () => config.posts.find((post) => post.featured) ?? config.posts[0] ?? null,
    [config.posts],
  )

  const filteredPosts = useMemo(() => {
    return config.posts.filter((item) => {
      const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [config.posts, searchQuery, selectedCategory])

  const showFeatured = useMemo(() => {
    if (!isOverviewMode || !featuredEvent) return false
    return filteredPosts.some((post) => post.id === featuredEvent.id)
  }, [filteredPosts, featuredEvent, isOverviewMode])

  const listPosts = useMemo(() => {
    if (showFeatured && featuredEvent) {
      return filteredPosts.filter((post) => post.id !== featuredEvent.id)
    }
    return filteredPosts
  }, [filteredPosts, featuredEvent, showFeatured])

  const totalPages = Math.ceil(listPosts.length / itemsPerPage) || 1
  const currentItems = listPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const banners = config.banners ?? []

  return (
    <main className="min-h-screen bg-[#FBFCFF] pb-20 md:pb-28">
      {/* 헤더와 동일 bg-surface로 이어 붙여 헤더 아래 이질적인 빈 띠 제거 */}
      <section
        className={cn(
          "bg-surface pt-[calc(clamp(3.75rem,3.4rem+1vw,6rem)+3.5rem)] md:pt-[calc(clamp(3.75rem,3.4rem+1vw,6rem)+4.5rem)]",
          banners.length === 0 && "border-b border-border",
        )}
      >
        <div className="mx-auto max-w-[1280px] px-6 pb-10 md:px-10 md:pb-12 lg:px-16 xl:px-20">
          <motion.div
            variants={reduceMotion ? undefined : heroStagger}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
          >
            <motion.p
              variants={fadeUpHero}
              transition={springGentle}
              className="text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground"
            >
              KFTE Events
            </motion.p>
            <motion.h1
              variants={fadeUpHero}
              transition={springGentle}
              className="mt-6 text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-foreground"
            >
              {isOverviewMode ? config.pageHeading : selectedCategory}
            </motion.h1>
            <motion.p
              variants={fadeUpHero}
              transition={springGentle}
              className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              {isOverviewMode
                ? config.description
                : `${selectedCategory} 카테고리 행사 ${filteredPosts.length}건`}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {banners.length > 0 ? (
        <div className="border-b border-border">
          <EventBannerCarousel banners={banners} />
        </div>
      ) : null}

      <div className="mx-auto max-w-[1280px] px-6 pb-20 md:px-10 lg:px-16 xl:px-20">
        <MotionReveal className="mt-10 md:mt-12">
          <div className="flex justify-center">
            <div className="relative w-full max-w-[500px]">
              <Search className="absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 text-foreground" />
              <input
                type="text"
                placeholder="행사명, 장소로 검색"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setCurrentPage(1)
                }}
                className="w-full border-b border-foreground bg-transparent py-2 pl-11 pr-4 text-[17px] text-foreground placeholder:text-foreground/60 focus:outline-none"
              />
            </div>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.05} className="mt-8">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 md:gap-x-10">
            {config.categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category)
                  setCurrentPage(1)
                }}
                className={cn(
                  "text-base font-semibold transition-colors md:text-lg",
                  selectedCategory === category
                    ? "text-foreground"
                    : "text-[#C4C4C4] hover:text-foreground/70",
                )}
              >
                {category}
                {category === "전체" && (
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    ({filteredPosts.length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </MotionReveal>

        {isOverviewMode ? (
          <>
            {showFeatured && featuredEvent ? (
              <div className="mt-12 md:mt-16">
                <FeaturedEventCard event={featuredEvent} />
              </div>
            ) : null}

            <div className="mt-10 md:mt-12">
              {currentItems.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">
                  등록된 행사가 없습니다.
                </div>
              ) : (
                <MotionStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {currentItems.map((event, index) => (
                      <motion.div
                        key={event.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={tweenSmooth}
                      >
                        <EventCompactCard event={event} index={index} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </MotionStagger>
              )}
            </div>
          </>
        ) : (
          <div className="mx-auto mt-12 max-w-[960px] md:mt-16">
            {currentItems.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                등록된 행사가 없습니다.
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {currentItems.map((event) => (
                    <EventListRow key={event.id} event={event} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <MotionReveal delay={0.1} className="mt-16 border-t border-border pt-10 text-center">
          <p className="text-sm text-muted-foreground">지난 행사를 찾고 계신가요?</p>
          <Link
            href={config.archivePath}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            행사 아카이브 보기
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </MotionReveal>
      </div>
    </main>
  )
}
