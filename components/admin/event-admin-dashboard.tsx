"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import {
  ArrowUpRight,
  CalendarClock,
  ClipboardList,
  Inbox,
} from "lucide-react"
import { MotionReveal } from "@/components/motion"
import { ContentViewsChart } from "@/components/admin/content-views-chart"
import { Badge } from "@/components/ui/badge"
import {
  registrationStatusLabel,
  type EventRegistrationStatus,
} from "@/lib/event-types"
import type { EventAdminDashboardData } from "@/lib/admin-event-dashboard"
import { springGentle } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

const formStatusLabel: Record<string, string> = {
  draft: "임시저장",
  published: "게시중",
  closed: "마감",
}

const eventStatusTone: Record<EventRegistrationStatus, string> = {
  open: "bg-[#002065] text-white",
  soon: "bg-[#002065]/10 text-[#002065]",
  closed: "bg-slate-100 text-slate-600",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function EventAdminDashboard({ data }: { data: EventAdminDashboardData }) {
  const reduceMotion = useReducedMotion()

  const primaryStats = [
    { label: "전체", value: data.total, hot: false },
    { label: "공개", value: data.published, hot: false },
    { label: "모집중", value: data.open, hot: true },
    { label: "모집예정", value: data.soon, hot: false },
    { label: "마감", value: data.closed, hot: false },
    { label: "초안", value: data.drafts, hot: false },
    { label: "총 신청", value: data.applicationsTotal, hot: true },
    { label: "이번 주", value: data.applicationsThisWeek, hot: false },
  ]

  const secondaryStats = [
    { label: "폼 연동", value: data.linkedForms, href: "/admin/forms" },
    { label: "미연동", value: data.unlinkedEvents, href: "#manage" },
    { label: "아카이브", value: data.archive, href: "/admin/event-archives" },
    { label: "30일 조회", value: data.eventViewsTotal, href: undefined as string | undefined },
  ]

  return (
    <div className="space-y-5">
      <MotionReveal>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Dashboard
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#002065]">
              행사 현황
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              모집·신청·조회를 한눈에 확인합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="#manage"
              className="inline-flex h-10 items-center gap-1 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-[#002065]/30 hover:text-[#002065]"
            >
              행사 관리
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="#register"
              className="inline-flex h-10 items-center gap-1 rounded-full bg-[#002065] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              행사 등록
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal>
        <div className="glass-pane overflow-hidden rounded-2xl">
          <div className="flex flex-wrap items-stretch divide-x divide-slate-200/70">
            {primaryStats.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  "flex min-w-[5.5rem] flex-1 items-baseline justify-between gap-3 px-4 py-3 sm:min-w-0 sm:justify-start sm:gap-2",
                  item.hot && "bg-[#002065] text-white",
                )}
              >
                <span
                  className={cn(
                    "shrink-0 text-xs font-medium sm:text-sm",
                    item.hot ? "text-white/75" : "text-slate-500",
                  )}
                >
                  {item.label}
                </span>
                <motion.span
                  className={cn(
                    "text-xl font-bold tabular-nums tracking-tight sm:text-2xl",
                    item.hot ? "text-white" : "text-[#002065]",
                  )}
                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springGentle, delay: 0.02 * index }}
                >
                  {item.value.toLocaleString("ko-KR")}
                </motion.span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-stretch border-t border-slate-200/70 divide-x divide-slate-200/70">
            {secondaryStats.map((item) => {
              const className =
                "flex min-w-[6rem] flex-1 items-baseline justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-white/50 sm:min-w-0 sm:justify-start sm:gap-2"
              const body = (
                <>
                  <span className="shrink-0 text-xs text-slate-500 sm:text-sm">{item.label}</span>
                  <span className="text-lg font-bold tabular-nums text-[#002065]">
                    {item.value.toLocaleString("ko-KR")}
                  </span>
                </>
              )
              return item.href ? (
                <Link key={item.label} href={item.href} className={className}>
                  {body}
                </Link>
              ) : (
                <div key={item.label} className={className}>
                  {body}
                </div>
              )
            })}
          </div>
        </div>
      </MotionReveal>

      {data.upcomingOpen.length > 0 ? (
        <MotionReveal>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
              <CalendarClock className="h-4 w-4 text-[#002065]" />
              <p className="text-sm font-semibold text-[#002065]">모집 중·예정 일정</p>
            </div>
            <ul className="divide-y divide-slate-100 sm:grid sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5">
              {data.upcomingOpen.map((event) => (
                <li key={event.eventId} className="sm:border-r sm:border-slate-100 sm:last:border-r-0">
                  <Link
                    href={`/admin/events/${event.eventId}/edit`}
                    className="block px-4 py-3 transition-colors hover:bg-slate-50"
                  >
                    <p className="truncate text-sm font-semibold text-slate-900">{event.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(event.eventDate)} · {event.location}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[#002065]">
                      신청 {event.responseCount.toLocaleString("ko-KR")}건
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </MotionReveal>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-3">
        <MotionReveal className="xl:col-span-1">
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002065]/10 text-[#002065]">
                  <ClipboardList className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-base font-semibold text-[#002065]">신청 현황</p>
                  <p className="text-xs text-muted-foreground">폼 연동 · 응답 수</p>
                </div>
              </div>
              <Link
                href="/admin/forms"
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-[#002065]"
              >
                전체
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {data.applications.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
                <p className="text-base font-medium text-slate-800">연동된 신청이 없습니다</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  행사에 신청 폼을 연결하면 응답 수가 표시됩니다.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {data.applications.map((row) => (
                  <li key={`${row.eventId}-${row.formId}`}>
                    <Link
                      href={`/admin/forms/${row.formId}/responses`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {row.eventTitle}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                              eventStatusTone[row.registrationStatus],
                            )}
                          >
                            {registrationStatusLabel[row.registrationStatus]}
                          </span>
                          <Badge variant="outline" className="text-[11px]">
                            {formStatusLabel[row.formStatus] ?? row.formStatus}
                          </Badge>
                        </div>
                      </div>
                      <p className="shrink-0 text-xl font-bold tabular-nums text-[#002065]">
                        {row.responseCount.toLocaleString("ko-KR")}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </MotionReveal>

        <MotionReveal className="xl:col-span-1">
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002065]/10 text-[#002065]">
                  <Inbox className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-base font-semibold text-[#002065]">최근 신청</p>
                  <p className="text-xs text-muted-foreground">최신 응답 8건</p>
                </div>
              </div>
            </div>

            {data.recentResponses.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
                <p className="text-base font-medium text-slate-800">아직 신청이 없습니다</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  공개 폼으로 응답이 들어오면 여기에 쌓입니다.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {data.recentResponses.map((row) => (
                  <li key={row.id}>
                    <Link
                      href={`/admin/forms/${row.formId}/responses`}
                      className="block px-4 py-3 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {row.eventTitle ?? row.formTitle}
                        </p>
                        <span className="shrink-0 text-xs tabular-nums text-slate-500">
                          {formatDateTime(row.submittedAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {row.email || "이메일 없음"}
                        {row.eventTitle ? ` · ${row.formTitle}` : null}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </MotionReveal>

        <div className="xl:col-span-1">
          <ContentViewsChart
            title="행사 조회수"
            description="최근 30일"
            data={data.eventViews}
            totalViews={data.eventViewsTotal}
          />
        </div>
      </div>
    </div>
  )
}
