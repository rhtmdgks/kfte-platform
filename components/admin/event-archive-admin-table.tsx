"use client"

import Link from "next/link"
import { Archive, CalendarDays, Pencil, Plus } from "lucide-react"
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
import { formatEventListDate } from "@/lib/event-types"
import type { AdminEventArchiveRow } from "@/lib/event-archive-admin"

type EventArchiveAdminTableProps = {
  rows: AdminEventArchiveRow[]
}

const statusLabels = {
  draft: "초안",
  published: "공개",
  archived: "보관",
} as const

export function EventArchiveAdminTable({ rows }: EventArchiveAdminTableProps) {
  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          모집이 마감된 공개 행사는 별도 등록 없이 아카이브에 자동 노출됩니다. 행사 일정 기준으로
          정렬됩니다.
        </p>
        <Button asChild className="shrink-0 bg-[#002065] hover:bg-[#002065]/90">
          <Link href="/admin/event-archives/new">
            <Plus className="mr-2 h-4 w-4" />
            수동 아카이브 등록
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead className="w-24">출처</TableHead>
              <TableHead className="w-24">상태</TableHead>
              <TableHead className="w-32">행사일</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  아카이브에 노출되는 항목이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={`${row.archiveSource}-${row.id}`}>
                  <TableCell className="font-medium">{row.title}</TableCell>
                  <TableCell>
                    <Badge variant={row.archiveSource === "manual" ? "default" : "secondary"}>
                      {row.archiveSource === "manual" ? "수동" : "자동"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.status === "published" ? "default" : "outline"}>
                      {statusLabels[row.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatEventListDate(row.eventDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={row.editPath} aria-label={`${row.title} 수정`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/10 bg-primary/[0.03] px-4 py-3 text-sm text-muted-foreground">
        <Archive className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          <span className="font-medium text-foreground">자동</span> 항목은 행사 관리에서 모집
          마감일(또는 행사일)이 지나면 공개 아카이브에 반영됩니다. 별도 기록 페이지가 필요한 경우에만
          수동 아카이브를 추가하세요.
        </p>
      </div>
    </>
  )
}
