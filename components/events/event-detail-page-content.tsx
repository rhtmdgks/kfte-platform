"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Copy,
  Eye,
  Link2,
  MapPin,
  Share2,
  Ticket,
} from "lucide-react"
import { MotionReveal } from "@/components/motion"
import { NaverMap } from "@/components/naver-map"
import { EventStatusBadge } from "@/components/events/event-status-badge"
import {
  formatEventDateRange,
  formatEventDateTime,
  getEventRegistrationStatus,
  type EventPost,
  type EventsPageConfig,
} from "@/lib/event-types"
import { copyTextToClipboard, sharePageLink, shouldUseNativeShare } from "@/lib/share-page-link"
import { createShortLink } from "@/lib/short-link"
import { site } from "@/lib/kfte-content"
import { pageMainClassName } from "@/lib/page-layout"
import { springGentle } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

type EventDetailPageContentProps = {
  config: Omit<EventsPageConfig, "posts">
  post: EventPost
  mode?: "live" | "archive"
}

function formatRegistrationPeriod(start?: string, end?: string) {
  if (!start || !end) return "추후 공지"
  return `${formatEventDateTime(start)} ~ ${formatEventDateTime(end)}`
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-0">
      <span className="w-24 shrink-0 text-base font-medium text-muted-foreground">{label}</span>
      <span className="flex-1 text-base font-medium text-foreground">{children}</span>
    </div>
  )
}

function EventHeroImage({ post, archive = false }: { post: EventPost; archive?: boolean }) {
  if (post.thumbnailUrl) {
    return (
      <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[20px] border border-border/60 bg-muted shadow-sm">
        <Image
          src={post.thumbnailUrl}
          alt={post.title}
          fill
          className={cn("object-cover", archive && "grayscale-[30%] sepia-[10%]")}
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        {archive ? (
          <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold tracking-[0.14em] text-white backdrop-blur-sm">
            ARCHIVE
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[20px] border border-border/60 bg-gradient-to-br from-primary via-primary to-[#001a52] shadow-sm">
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
        <p className="text-sm font-semibold tracking-[0.16em] uppercase text-primary-foreground/70">
          KFTE Event
        </p>
        <p className="mt-2 text-2xl font-bold text-primary-foreground md:text-3xl">{post.category}</p>
      </div>
    </div>
  )
}

function EventDetailPoster({ post }: { post: EventPost }) {
  if (!post.detailImageUrl) return null

  const hasSize =
    typeof post.detailImageWidth === "number" &&
    typeof post.detailImageHeight === "number" &&
    post.detailImageWidth > 0 &&
    post.detailImageHeight > 0

  return (
    <MotionReveal delay={0.2}>
      <section className="mt-10 border-t border-border pt-10">
        <h2 className="mb-6 text-xl font-bold text-foreground">상세 포스터</h2>
        <div className="mx-auto max-w-[560px]">
          <div className="overflow-hidden rounded-[16px] border border-primary/15 bg-white shadow-[0_12px_40px_-16px_rgba(0,32,101,0.18)]">
            {hasSize ? (
              <Image
                src={post.detailImageUrl}
                alt={`${post.title} 상세 포스터`}
                width={post.detailImageWidth}
                height={post.detailImageHeight}
                className="h-auto w-full"
                sizes="(max-width: 640px) 100vw, 560px"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.detailImageUrl}
                alt={`${post.title} 상세 포스터`}
                className="h-auto w-full"
              />
            )}
          </div>
          <a
            href={post.detailImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            원본 크게 보기 →
          </a>
        </div>
      </section>
    </MotionReveal>
  )
}

function EventShareMenu({ post }: { post: EventPost }) {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [copyState, setCopyState] = useState<"idle" | "loading" | "copied" | "failed">("idle")
  const [supportsNative, setSupportsNative] = useState(false)

  useEffect(() => {
    setSupportsNative(shouldUseNativeShare())
  }, [])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("touchstart", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("touchstart", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (copyState !== "copied") return
    const timer = window.setTimeout(() => setCopyState("idle"), 2200)
    return () => window.clearTimeout(timer)
  }, [copyState])

  const handleCopyShortLink = async () => {
    if (copyState === "loading") return
    setCopyState("loading")

    const path = `${window.location.pathname}${window.location.search}`
    const result = await createShortLink(path)

    if (!result.ok) {
      setCopyState("failed")
      window.alert(result.error)
      return
    }

    const shortUrl = `${window.location.origin}/s/${result.code}`
    const copied = await copyTextToClipboard(shortUrl)
    if (!copied) {
      setCopyState("failed")
      window.alert("링크를 복사하지 못했습니다. 주소창 URL을 직접 복사해 주세요.")
      return
    }

    setCopyState("copied")
  }

  const handleNativeShare = async () => {
    const path = `${window.location.pathname}${window.location.search}`
    const short = await createShortLink(path)
    const url = short.ok
      ? `${window.location.origin}/s/${short.code}`
      : window.location.href

    const result = await sharePageLink({ url, title: post.title })
    if (result === "failed") {
      window.alert("공유에 실패했습니다. 링크 복사를 이용해 주세요.")
    }
    if (result === "shared" || result === "copied") {
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        whileHover={reduceMotion ? undefined : { scale: 1.01 }}
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
        transition={springGentle}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex w-full items-center justify-center gap-2 bg-primary/5 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
      >
        <Share2 className="h-4 w-4" />
        공유하기
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="share-menu"
            role="menu"
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 6, scale: 0.98 }}
            transition={springGentle}
            className="absolute bottom-[calc(100%+0.5rem)] left-0 right-0 z-20 overflow-hidden rounded-2xl border border-border/70 bg-background p-1.5 shadow-[0_16px_40px_-12px_rgba(0,32,101,0.22)]"
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleCopyShortLink}
              disabled={copyState === "loading"}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-primary/5 disabled:opacity-60"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/8 text-primary">
                <AnimatePresence mode="wait" initial={false}>
                  {copyState === "copied" ? (
                    <motion.span
                      key="check"
                      initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={reduceMotion ? undefined : { scale: 0.6, opacity: 0 }}
                      transition={springGentle}
                    >
                      <Check className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={reduceMotion ? undefined : { scale: 0.6, opacity: 0 }}
                      transition={springGentle}
                    >
                      {copyState === "loading" ? (
                        <Link2 className="h-4 w-4 animate-pulse" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="flex-1">
                {copyState === "copied"
                  ? "복사됨"
                  : copyState === "loading"
                    ? "단축링크 생성 중…"
                    : "링크 복사"}
              </span>
            </button>

            {supportsNative ? (
              <button
                type="button"
                role="menuitem"
                onClick={handleNativeShare}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-primary/5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/8 text-primary">
                  <Share2 className="h-4 w-4" />
                </span>
                <span className="flex-1">기기 공유</span>
              </button>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function EventDetailPageContent({
  config,
  post,
  mode = "live",
}: EventDetailPageContentProps) {
  const reduceMotion = useReducedMotion()
  const isArchive = mode === "archive"
  const status = getEventRegistrationStatus(post)
  const canRegister =
    !isArchive && status === "open" && post.registrationUrl && post.registrationUrl !== "#"

  const handleRegister = () => {
    if (!post.registrationUrl || post.registrationUrl === "#") {
      window.alert("신청 링크는 추후 연결 예정입니다.")
      return
    }
    window.open(post.registrationUrl, "_blank", "noopener,noreferrer")
  }

  const mapQuery = encodeURIComponent(
    `${post.location}${post.locationDetail ? ` ${post.locationDetail}` : ""}`,
  )

  return (
    <main className={cn(pageMainClassName, "bg-[#FBFCFF]")}>
      <div className="relative z-10 px-6 pb-20 pt-28 md:px-10 md:pt-32 lg:px-[72px]">
        <MotionReveal>
          <Link
            href={config.basePath}
            className="mb-8 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        </MotionReveal>

        <div className="mx-auto max-w-7xl">
          <MotionReveal delay={0.03}>
            <h1 className="sr-only">{post.title}</h1>
          </MotionReveal>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <MotionReveal delay={0.05}>
                <EventHeroImage post={post} archive={isArchive} />
              </MotionReveal>

              <MotionReveal delay={0.1}>
                <section>
                  <h2 className="mb-8 text-2xl font-bold text-foreground/80">행사 상세 정보</h2>
                  <div className="space-y-6">
                    <DetailRow label="일시">
                      {formatEventDateRange(post.eventDate, post.eventEndDate)}
                    </DetailRow>
                    <DetailRow label="신청">
                      {formatRegistrationPeriod(post.registrationStart, post.registrationEnd)}
                    </DetailRow>
                    <DetailRow label="비용">{post.cost ?? "무료"}</DetailRow>
                    <DetailRow label="장소">
                      {post.location}
                      {post.locationDetail ? ` (${post.locationDetail})` : ""}
                    </DetailRow>
                  </div>
                </section>
              </MotionReveal>

              <MotionReveal delay={0.14}>
                <section className="mt-10">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">위치</h3>
                  <NaverMap
                    address={`${post.location}${post.locationDetail ? ` ${post.locationDetail}` : ""}`}
                    markerTitle={post.title}
                    className="aspect-[21/9] h-auto min-h-[240px] overflow-hidden rounded-[16px] md:min-h-[320px] md:rounded-[20px]"
                  />
                  <a
                    href={`https://map.naver.com/v5/search/${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                  >
                    네이버 지도에서 크게 보기 →
                  </a>
                </section>
              </MotionReveal>

              <MotionReveal delay={0.18}>
                <div className="mt-10 border-t border-border pt-10">
                  <h2 className="mb-6 text-xl font-bold text-foreground">프로그램 안내</h2>
                  <div className="whitespace-pre-wrap text-base leading-[2] text-muted-foreground">
                    {post.content}
                  </div>
                </div>
              </MotionReveal>

              <EventDetailPoster post={post} />
            </div>

            <div className="lg:col-span-1">
              <motion.aside
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springGentle, delay: 0.12 }}
                className="sticky top-28 rounded-[20px] border border-border/60 bg-background p-6 shadow-[0_8px_32px_rgba(0,32,101,0.06)] md:p-7"
              >
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold text-primary">{post.category}</span>
                  {post.subcategory ? (
                    <>
                      <div className="h-4 w-px bg-border" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {post.subcategory}
                      </span>
                    </>
                  ) : null}
                  {!isArchive ? <EventStatusBadge event={post} className="ml-auto" /> : null}
                </div>

                <div className="mb-4 border-t border-border" />

                {isArchive ? (
                  <p className="mb-4 inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                    종료된 행사 기록
                  </p>
                ) : null}

                <h2 className="text-xl font-bold leading-snug tracking-tight text-foreground md:text-2xl">
                  {post.title}
                </h2>

                {post.summary ? (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{post.summary}</p>
                ) : null}

                <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                    {formatEventDateRange(post.eventDate, post.eventEndDate)}
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                    {post.location}
                  </p>
                  <p className="flex items-start gap-2">
                    <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                    {post.cost ?? "무료"}
                  </p>
                  <p className="flex items-start gap-2">
                    <Eye className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                    {post.views}회 조회
                  </p>
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="mb-4 text-base font-semibold text-foreground">문의</h3>
                  <div className="space-y-1 text-sm text-foreground">
                    <p className="font-medium">{site.fullName}</p>
                    <p className="text-muted-foreground">T. {site.phone}</p>
                    <p className="text-muted-foreground">E. {site.email}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {isArchive ? (
                    <Link
                      href={"/activities/events"}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      진행 중인 행사 보기
                    </Link>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={handleRegister}
                      whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                      transition={springGentle}
                      className={cn(
                        "w-full py-3.5 text-sm font-semibold transition-colors",
                        canRegister || post.registrationUrl
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-primary/80 text-primary-foreground hover:bg-primary/90",
                      )}
                    >
                      {status === "closed" ? "모집 마감" : "참가하기"}
                    </motion.button>
                  )}

                  <EventShareMenu post={post} />
                </div>
              </motion.aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
