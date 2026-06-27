"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import {
  ArrowLeft,
  CalendarDays,
  Eye,
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
import { sharePageLink } from "@/lib/share-page-link"
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

  const handleShare = async () => {
    const result = await sharePageLink({
      url: window.location.href,
      title: post.title,
    })

    if (result === "copied") {
      window.alert("링크가 복사되었습니다.")
      return
    }

    if (result === "failed") {
      window.alert("링크를 복사하지 못했습니다. 주소창 URL을 직접 복사해 주세요.")
    }
  }

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

                  <motion.button
                    type="button"
                    onClick={handleShare}
                    whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                    transition={springGentle}
                    className="flex w-full items-center justify-center gap-2 bg-primary/5 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    <Share2 className="h-4 w-4" />
                    공유하기
                  </motion.button>
                </div>
              </motion.aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
