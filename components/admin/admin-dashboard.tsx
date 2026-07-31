"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Megaphone,
  Newspaper,
  Users,
} from "lucide-react"
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { ContentViewsChart } from "@/components/admin/content-views-chart"
import { Badge } from "@/components/ui/badge"
import {
  registrationStatusLabel,
  type EventRegistrationStatus,
} from "@/lib/event-types"
import type { AdminDashboardData } from "@/lib/admin-dashboard"
import { springGentle } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"
import type { Database } from "@/types/database"

type ApplicationStatus = Database["public"]["Enums"]["application_status"]

const pipelineSteps: {
  key: ApplicationStatus
  label: string
  hint: string
}[] = [
  { key: "pending", label: "대기", hint: "신규 접수" },
  { key: "reviewing", label: "검토중", hint: "확인 중" },
  { key: "approved", label: "승인", hint: "완료" },
  { key: "rejected", label: "거부", hint: "반려" },
]

const statusBadge: Record<
  ApplicationStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "secondary",
  reviewing: "default",
  approved: "outline",
  rejected: "destructive",
}

const statusLabel: Record<ApplicationStatus, string> = {
  pending: "대기",
  reviewing: "검토중",
  approved: "승인",
  rejected: "거부",
}

const eventStatusTone: Record<EventRegistrationStatus, string> = {
  open: "bg-primary text-primary-foreground",
  soon: "bg-primary/10 text-primary",
  closed: "bg-muted text-muted-foreground",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

function SectionHeading({
  eyebrow,
  title,
  href,
  hrefLabel,
}: {
  eyebrow: string
  title: string
  href?: string
  hrefLabel?: string
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-[#002065]">{title}</h2>
      </div>
      {href && hrefLabel ? (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-base font-medium text-muted-foreground transition-colors hover:text-[#002065]"
        >
          {hrefLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  )
}

export function AdminDashboard({ data }: { data: AdminDashboardData }) {
  const reduceMotion = useReducedMotion()
  const pending = data.membership.pending
  const needsAttention = pending > 0

  return (
    <div className="space-y-8">
      {needsAttention ? (
        <MotionReveal>
          <Link
            href="/admin/membership-applications"
            className="flex items-center justify-between gap-4 rounded-xl border border-[#002065]/15 bg-[#002065] px-5 py-4 text-primary-foreground transition-opacity hover:opacity-95"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                확인 필요
              </p>
              <p className="mt-1 text-lg font-semibold">
                가입 신청 대기 {pending}건 — 검토가 필요합니다
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-base font-medium text-white/80">
              바로가기
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </MotionReveal>
      ) : null}

      {/* Signature: membership pipeline */}
      <section>
        <SectionHeading
          eyebrow="참여자"
          title="가입 신청 현황"
          href="/admin/membership-applications"
          hrefLabel="전체 보기"
        />
        <MotionStagger className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {pipelineSteps.map((step, index) => {
            const count = data.membership[step.key]
            const isHot = step.key === "pending" && count > 0
            return (
              <MotionStaggerItem key={step.key} index={index}>
                <Link
                  href="/admin/membership-applications"
                  className={cn(
                    "block rounded-xl border px-4 py-4 transition-colors",
                    isHot
                      ? "border-[#002065]/25 bg-[#002065]/[0.04]"
                      : "border-border/70 bg-white hover:border-[#002065]/20",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold tracking-[0.14em] text-muted-foreground tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs text-muted-foreground">{step.hint}</span>
                  </div>
                  <p className="mt-3 text-base font-medium text-muted-foreground">{step.label}</p>
                  <motion.p
                    className="mt-1 text-4xl font-bold tabular-nums text-[#002065]"
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springGentle, delay: 0.05 * index }}
                  >
                    {count}
                  </motion.p>
                </Link>
              </MotionStaggerItem>
            )
          })}
        </MotionStagger>
        <p className="mt-2 text-sm text-muted-foreground">
          총 {data.membershipTotal}건 · 계정 admin {data.accounts.admin} / user {data.accounts.user}{" "}
          / partner {data.accounts.partner}
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Events pulse */}
        <section>
          <SectionHeading
            eyebrow="행사"
            title="모집·공개 현황"
            href="/admin/events"
            hrefLabel="행사 관리"
          />
          <MotionStagger className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "공개", value: data.events.published },
              { label: "모집중", value: data.events.open },
              { label: "모집예정", value: data.events.soon },
              { label: "마감", value: data.events.closed },
            ].map((item, index) => (
              <MotionStaggerItem key={item.label} index={index}>
                <div className="rounded-xl border border-border/70 bg-white px-3 py-3">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-[#002065]">
                    {item.value}
                  </p>
                </div>
              </MotionStaggerItem>
            ))}
          </MotionStagger>

          <div className="overflow-hidden rounded-xl border border-border/70 bg-white">
            {data.events.recent.length === 0 ? (
              <p className="px-4 py-8 text-center text-base text-muted-foreground">
                공개된 행사가 없습니다.
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {data.events.recent.map((event) => (
                  <li key={event.id}>
                    <Link
                      href={`/admin/events`}
                      className="flex items-start justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-foreground">
                          {event.title}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {formatDate(event.eventDate)} · 조회 {event.views}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                          eventStatusTone[event.status],
                        )}
                      >
                        {registrationStatusLabel[event.status]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {data.events.archive > 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              아카이브 {data.events.archive}건
            </p>
          ) : null}
        </section>

        {/* Recent applications */}
        <section>
          <SectionHeading
            eyebrow="참여자"
            title="최근 가입 신청"
            href="/admin/membership-applications"
            hrefLabel="전체 보기"
          />
          <div className="overflow-hidden rounded-xl border border-border/70 bg-white">
            {data.recentApplications.length === 0 ? (
              <p className="px-4 py-8 text-center text-base text-muted-foreground">
                신청 내역이 없습니다.
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {data.recentApplications.map((app) => (
                  <li
                    key={app.id}
                    className="flex items-start justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-foreground">
                        {app.applicantName}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {app.companyName} · {formatDate(app.submittedAt)}
                      </p>
                    </div>
                    <Badge variant={statusBadge[app.status]} className="shrink-0">
                      {statusLabel[app.status]}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Content inventory */}
      <section>
        <SectionHeading eyebrow="콘텐츠" title="게시 현황" />
        <MotionStagger className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "공지사항",
              href: "/admin/notices",
              icon: Bell,
              primary: `${data.content.noticePublished} 공개`,
              secondary: `초안 ${data.content.noticeDraft}`,
            },
            {
              label: "언론보도",
              href: "/admin/press",
              icon: Newspaper,
              primary: `${data.content.pressPublished} 공개`,
              secondary: "목록 관리",
            },
            {
              label: "블로그",
              href: "/admin/blog",
              icon: Megaphone,
              primary: `${data.content.blogPublished} 공개`,
              secondary: "목록 관리",
            },
            {
              label: "행사",
              href: "/admin/events",
              icon: CalendarDays,
              primary: `${data.content.eventPublished} 공개`,
              secondary: `아카이브 ${data.content.eventArchive}`,
            },
          ].map((item, index) => (
            <MotionStaggerItem key={item.href} index={index}>
              <Link
                href={item.href}
                className="flex items-start gap-3 rounded-xl border border-border/70 bg-white p-4 transition-colors hover:border-[#002065]/25"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#002065]/5 text-[#002065]">
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-foreground">{item.label}</span>
                  <span className="mt-0.5 block text-xl font-bold tabular-nums text-[#002065]">
                    {item.primary}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.secondary}</span>
                </span>
              </Link>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </section>

      {/* Views */}
      <section>
        <SectionHeading eyebrow="조회" title="최근 30일 조회수" />
        <div className="grid gap-4 lg:grid-cols-3">
          <ContentViewsChart
            title="공지사항"
            description="공개 페이지 조회"
            data={data.noticeViews}
            totalViews={data.noticeViewsTotal}
          />
          <ContentViewsChart
            title="언론보도"
            description="공개 페이지 조회"
            data={data.pressViews}
            totalViews={data.pressViewsTotal}
          />
          <ContentViewsChart
            title="행사"
            description="공개 페이지 조회"
            data={data.eventViews}
            totalViews={data.eventViewsTotal}
          />
        </div>
      </section>

      <MotionReveal delay={0.06}>
        <div className="flex flex-wrap gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-3 text-base text-muted-foreground">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#002065]/70" />
          <p>
            행사 신청자·뉴스레터 구독자 DB는 아직 없습니다. 현재 참여자 현황은{" "}
            <strong className="font-semibold text-foreground">가입 신청 파이프라인</strong>과{" "}
            <strong className="font-semibold text-foreground">행사 모집 상태·조회</strong> 기준입니다.
          </p>
        </div>
      </MotionReveal>
    </div>
  )
}
