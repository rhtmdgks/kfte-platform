import Link from "next/link"
import { ExternalLink, Pencil, Plus, Radio, Vote } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createPoll } from "@/app/admin/polls/actions"
import { listPolls, getPollVoteCount } from "@/lib/polls/queries"
import { publicPollPath } from "@/lib/polls/types"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

const STATUS_LABEL: Record<string, string> = {
  draft: "임시저장",
  open: "진행 중",
  closed: "마감",
}

function statusBadgeVariant(status: string) {
  if (status === "open") return "default" as const
  if (status === "closed") return "outline" as const
  return "secondary" as const
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

export default async function AdminPollsPage() {
  const supabase = await createClient()
  let polls: Awaited<ReturnType<typeof listPolls>> = []
  let loadError: string | null = null

  try {
    polls = await listPolls(supabase)
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "polls 테이블을 불러오지 못했습니다. 마이그레이션을 적용해 주세요."
  }

  const voteCountEntries = await Promise.all(
    polls.map(async (p) => {
      const count = await getPollVoteCount(supabase, p.id).catch(() => 0)
      return [p.id, count] as const
    }),
  )
  const voteCountMap = Object.fromEntries(voteCountEntries)

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-[#002065]">청중 투표</h1>
          <p className="truncate text-sm text-muted-foreground">
            Live Poll 목록 · 총 {polls.length}개
          </p>
        </div>
        <form action={createPoll} className="ml-auto shrink-0">
          <Button
            type="submit"
            className="h-11 rounded-full bg-[#002065] px-5 hover:bg-[#002065]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            새 투표
          </Button>
        </form>
      </header>

      <main className="flex-1 space-y-5 px-3 py-5 md:px-5 md:py-6">
        {loadError && (
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
            {loadError}
            <p className="mt-1 text-xs text-amber-900/80">
              Supabase SQL Editor에서{" "}
              <code className="rounded bg-white/80 px-1">
                supabase/migrations/20260815000000_polls.sql
              </code>{" "}
              를 실행해 주세요.
            </p>
          </div>
        )}

        <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Live Polls
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#002065]">투표 관리</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              QR 코드로 공유하고, 실황 대시보드에서 결과를 확인합니다.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead className="w-28">상태</TableHead>
                  <TableHead className="hidden md:table-cell">공개 URL</TableHead>
                  <TableHead className="w-20 text-right">투표수</TableHead>
                  <TableHead className="hidden w-36 lg:table-cell">수정일</TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {polls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#002065]/10 text-[#002065]">
                          <Vote className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-medium text-slate-800">투표가 없습니다</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            새 투표를 만들어 행사에서 실시간으로 운영해 보세요.
                          </p>
                        </div>
                        <form action={createPoll}>
                          <Button
                            type="submit"
                            className="h-11 rounded-full bg-[#002065] px-5 hover:bg-[#002065]/90"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            새 투표 만들기
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  polls.map((poll) => (
                    <TableRow key={poll.id} className="group">
                      <TableCell>
                        <Link
                          href={`/admin/polls/${poll.id}/edit`}
                          className="font-medium text-slate-900 transition-colors hover:text-[#002065]"
                        >
                          {poll.title}
                        </Link>
                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground md:hidden">
                          {publicPollPath(poll.slug)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusBadgeVariant(poll.status)}
                          className={cn(
                            poll.status === "open" && "bg-[#002065] hover:bg-[#002065]/90",
                          )}
                        >
                          {poll.status === "open" && (
                            <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                          )}
                          {STATUS_LABEL[poll.status] ?? poll.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Link
                          href={publicPollPath(poll.slug)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex max-w-[220px] items-center gap-1 truncate font-mono text-xs text-muted-foreground transition-colors hover:text-[#002065]"
                        >
                          <span className="truncate">{publicPollPath(poll.slug)}</span>
                          <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                        </Link>
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium text-slate-700">
                        {voteCountMap[poll.id] ?? 0}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                        {formatDate(poll.updated_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-10 min-w-10 rounded-full px-3"
                          >
                            <Link href={`/admin/polls/${poll.id}/edit`}>
                              <Pencil className="h-3.5 w-3.5 sm:mr-1.5" />
                              <span className="hidden sm:inline">편집</span>
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-10 min-w-10 rounded-full px-3"
                          >
                            <Link href={`/admin/polls/${poll.id}/live`}>
                              <Radio className="h-3.5 w-3.5 sm:mr-1.5" />
                              <span className="hidden sm:inline">실황</span>
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>
    </div>
  )
}
