"use client"

import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import { QRCodeSVG } from "qrcode.react"
import { ExternalLink, Maximize2, Minimize2 } from "lucide-react"
import Link from "next/link"
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { getPollResultsAction } from "@/app/vote/actions"
import { publicPollPath, type PollQuestion, type PollResults } from "@/lib/polls/types"
import { springGentle } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

const POLL_INTERVAL_MS = 3000 // ponytail: 3 s polling — switch to Realtime broadcast if > 200 concurrent viewers
const TREND_MAX_POINTS = 40

const GOLD = "#f5b301"
const BLUES = ["#4d7cfe", "#7ea4ff", "#2f5fe0", "#a9c3ff", "#1b46b8", "#6b8dff"]

type LiveOption = {
  optionId: string
  label: string
  count: number
  pct: number
}

type LiveQuestion = {
  questionId: string
  title: string
  total: number
  options: LiveOption[]
}

function buildLiveQuestions(
  questions: PollQuestion[],
  results: PollResults | null,
): LiveQuestion[] {
  return questions.map((q) => {
    const qResult = results?.questions.find((r) => r.questionId === q.id)
    const total = qResult
      ? Object.values(qResult.optionCounts).reduce((a, b) => a + b, 0)
      : 0
    const options: LiveOption[] = q.options.map((opt) => {
      const count = qResult?.optionCounts[opt.id] ?? 0
      const pct = total > 0 ? Math.round((count / total) * 100) : 0
      return { optionId: opt.id, label: opt.label, count, pct }
    })
    options.sort((a, b) => b.count - a.count)
    return { questionId: q.id, title: q.title, total, options }
  })
}

/** Spring-animated rolling number */
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const shouldReduceMotion = useReducedMotion()
  const spring = useSpring(value, { stiffness: 70, damping: 18 })
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString("ko-KR"))

  useEffect(() => {
    if (shouldReduceMotion) spring.jump(value)
    else spring.set(value)
  }, [spring, value, shouldReduceMotion])

  return <motion.span className={className}>{display}</motion.span>
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/40">
      <span className="h-2.5 w-1 bg-[#f5b301]" aria-hidden />
      {children}
    </p>
  )
}

function Clock() {
  const [now, setNow] = useState("")
  useEffect(() => {
    const tick = () =>
      setNow(new Date().toLocaleTimeString("ko-KR", { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="font-mono text-sm text-white/50 tabular-nums">{now}</span>
}

type Props = {
  pollId: string
  pollSlug: string
  pollTitle: string
  questions: PollQuestion[]
  initialResults: PollResults | null
}

export function PollLiveDashboard({ pollId, pollSlug, pollTitle, questions, initialResults }: Props) {
  const shouldReduceMotion = useReducedMotion()
  const [results, setResults] = useState<PollResults | null>(initialResults)
  const [trend, setTrend] = useState<{ t: number; total: number }[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${publicPollPath(pollSlug)}`
      : publicPollPath(pollSlug)

  const liveQuestions = buildLiveQuestions(questions, results)
  const activeQuestion = liveQuestions[activeQuestionIdx] ?? liveQuestions[0]
  const totalVoters = results?.totalVoters ?? 0
  const isLive = results?.status === "open"
  const statusLabel = isLive ? "LIVE" : results?.status === "closed" ? "CLOSED" : "STANDBY"

  useEffect(() => {
    const refresh = async () => {
      const r = await getPollResultsAction(pollId)
      if (r) {
        setResults(r)
        setTrend((prev) =>
          [...prev, { t: Date.now(), total: r.totalVoters }].slice(-TREND_MAX_POINTS),
        )
      }
    }
    refresh()
    const interval = setInterval(refresh, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [pollId])

  function toggleFullscreen() {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen()
    else document.exitFullscreen()
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  const maxCount = Math.max(...(activeQuestion?.options.map((o) => o.count) ?? [1]), 1)
  const donutData =
    activeQuestion?.options.filter((o) => o.count > 0).map((o) => ({
      name: o.label,
      value: o.count,
    })) ?? []
  const tickerText = liveQuestions
    .flatMap((q) => q.options)
    .map((o) => `${o.label} ${o.count.toLocaleString("ko-KR")}표`)
    .join("  ·  ")

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen flex-col bg-[#020d24] text-white"
      style={{ fontFamily: "var(--font-paperlogy, sans-serif)" }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="flex items-center gap-5 border-b border-white/10 px-6 py-4 md:px-10">
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1 text-xs font-bold tracking-[0.25em]",
            isLive ? "bg-[#d92d20] text-white" : "bg-white/10 text-white/50",
          )}
        >
          {isLive && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />}
          {statusLabel}
        </div>

        <h1 className="min-w-0 flex-1 truncate text-xl font-bold tracking-tight md:text-2xl">
          {pollTitle}
        </h1>

        <Clock />

        <div className="hidden items-baseline gap-2 border-l border-white/10 pl-5 sm:flex">
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">참여</span>
          <AnimatedNumber
            value={totalVoters}
            className="text-3xl font-bold tabular-nums text-[#f5b301]"
          />
          <span className="text-sm text-white/50">명</span>
        </div>

        <div className="flex gap-1.5 border-l border-white/10 pl-5">
          <Link
            href={publicPollPath(pollSlug)}
            target="_blank"
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="투표 페이지 열기"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <button
            onClick={toggleFullscreen}
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="전체화면 전환"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* ── Main grid ──────────────────────────────────────── */}
      <main className="grid flex-1 grid-cols-1 gap-px bg-white/10 lg:grid-cols-12">
        {/* Left: ranking */}
        <section className="flex flex-col gap-6 bg-[#020d24] p-6 md:p-10 lg:col-span-8">
          {/* Question tabs */}
          {liveQuestions.length > 1 && (
            <div className="flex flex-wrap gap-px self-start border border-white/15 bg-white/15 p-px">
              {liveQuestions.map((q, i) => (
                <button
                  key={q.questionId}
                  onClick={() => setActiveQuestionIdx(i)}
                  className={cn(
                    "relative px-5 py-2 text-sm font-bold tracking-wide transition-colors",
                    i === activeQuestionIdx ? "text-[#020d24]" : "bg-[#020d24] text-white/50 hover:text-white",
                  )}
                >
                  {i === activeQuestionIdx && (
                    <motion.span
                      layoutId="poll-tab-indicator"
                      className="absolute inset-0 bg-[#f5b301]"
                      transition={springGentle}
                    />
                  )}
                  <span className="relative z-10">Q{i + 1}</span>
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.h2
              key={activeQuestion?.questionId}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={springGentle}
              className="text-2xl font-bold leading-snug md:text-4xl"
            >
              {activeQuestion?.title}
            </motion.h2>
          </AnimatePresence>

          {/* Broadcast-style rank rows: the bar IS the row background */}
          <div className="flex flex-1 flex-col justify-center gap-2.5">
            <AnimatePresence>
              {activeQuestion?.options.map((opt, rank) => {
                const isLeader = rank === 0 && opt.count > 0
                const barPct = (opt.count / maxCount) * 100

                return (
                  <motion.div
                    key={opt.optionId}
                    layout={!shouldReduceMotion}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springGentle, layout: springGentle }}
                    className="relative flex h-16 items-center overflow-hidden border border-white/10 md:h-20"
                  >
                    {/* fill bar behind content */}
                    <motion.div
                      className={cn(
                        "absolute inset-y-0 left-0",
                        isLeader ? "bg-[#f5b301]/90" : "bg-[#1d4ed8]/45",
                      )}
                      initial={shouldReduceMotion ? false : { width: 0 }}
                      animate={{ width: `${barPct}%` }}
                      transition={{ type: "spring", stiffness: 80, damping: 24 }}
                    />

                    <div className="relative z-10 flex w-full items-center gap-4 px-4 md:px-6">
                      <span
                        className={cn(
                          "w-8 text-center text-xl font-bold tabular-nums md:text-2xl",
                          isLeader ? "text-[#020d24]" : "text-white/40",
                        )}
                      >
                        {rank + 1}
                      </span>
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-lg font-bold md:text-2xl",
                          isLeader ? "text-[#020d24]" : "text-white",
                        )}
                      >
                        {opt.label}
                      </span>

                      <motion.span
                        key={opt.count}
                        initial={shouldReduceMotion ? false : { scale: 1.3 }}
                        animate={{ scale: 1 }}
                        transition={springGentle}
                        className={cn(
                          "text-sm tabular-nums md:text-base",
                          isLeader ? "text-[#020d24]/70" : "text-white/50",
                        )}
                      >
                        {opt.count.toLocaleString("ko-KR")}표
                      </motion.span>

                      <span
                        className={cn(
                          "w-24 text-right text-3xl font-bold tabular-nums md:text-4xl",
                          isLeader ? "text-[#020d24]" : "text-white",
                        )}
                      >
                        <AnimatedNumber value={opt.pct} />
                        <span className="text-lg md:text-xl">%</span>
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </section>

        {/* Right: charts + QR */}
        <aside className="grid grid-rows-[auto_auto_1fr] gap-px bg-white/10 lg:col-span-4">
          {/* Donut — vote share */}
          <div className="bg-[#020d24] p-6">
            <PanelLabel>득표 비율</PanelLabel>
            <div className="relative mt-2 h-[220px]">
              {donutData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="62%"
                        outerRadius="92%"
                        paddingAngle={2}
                        stroke="none"
                        isAnimationActive={!shouldReduceMotion}
                      >
                        {donutData.map((entry, i) => (
                          <Cell
                            key={entry.name}
                            fill={i === 0 ? GOLD : BLUES[(i - 1) % BLUES.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <AnimatedNumber
                      value={activeQuestion?.total ?? 0}
                      className="text-3xl font-bold tabular-nums"
                    />
                    <span className="text-xs text-white/40">총 득표</span>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/30">
                  아직 득표가 없습니다
                </div>
              )}
            </div>
          </div>

          {/* Trend — participation over time */}
          <div className="bg-[#020d24] p-6">
            <PanelLabel>참여 추이</PanelLabel>
            <div className="mt-2 h-[120px]">
              {trend.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="poll-trend-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke={GOLD}
                      strokeWidth={2}
                      fill="url(#poll-trend-fill)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/30">
                  데이터 수집 중…
                </div>
              )}
            </div>
          </div>

          {/* QR */}
          <div className="flex items-center gap-5 bg-[#020d24] p-6">
            <div className="shrink-0 bg-white p-2.5">
              <QRCodeSVG value={publicUrl} size={110} />
            </div>
            <div className="min-w-0">
              <PanelLabel>지금 참여하세요</PanelLabel>
              <p className="mt-2 break-all font-mono text-xs text-white/60">{publicUrl}</p>
              <p className="mt-1.5 text-sm text-white/40">휴대폰 카메라로 QR을 스캔하세요</p>
            </div>
          </div>
        </aside>
      </main>

      {/* ── Ticker ─────────────────────────────────────────── */}
      <footer className="flex items-stretch overflow-hidden border-t border-white/10 bg-[#01081a]">
        <span className="z-10 flex shrink-0 items-center bg-[#f5b301] px-4 text-xs font-bold tracking-[0.2em] text-[#020d24]">
          실시간
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div
            className={cn(
              "ticker-track flex h-full w-max items-center gap-16 whitespace-nowrap py-2.5 text-sm text-white/70",
              shouldReduceMotion && "!animate-none",
            )}
          >
            <span>{tickerText}</span>
            <span aria-hidden>{tickerText}</span>
          </div>
        </div>
      </footer>

      <style>{`
        .ticker-track { animation: poll-ticker 30s linear infinite; }
        @keyframes poll-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>
    </div>
  )
}
