import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

type ApplicationStatus = Database["public"]["Enums"]["application_status"]

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "대기",
  reviewing: "검토중",
  approved: "승인",
  rejected: "거부",
}

const statusVariants: Record<
  ApplicationStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "secondary",
  reviewing: "default",
  approved: "outline",
  rejected: "destructive",
}

export default async function MembershipApplicationsPage() {
  const supabase = await createClient()
  const { data: applications } = await supabase
    .from("membership_applications")
    .select("*")
    .order("submitted_at", { ascending: false })

  const pendingCount = applications?.filter((a) => a.status === "pending").length ?? 0

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <h1 className="text-lg font-semibold text-[#002065]">회원사 가입 신청</h1>
        {pendingCount > 0 && (
          <Badge variant="secondary" className="ml-1">
            대기 {pendingCount}건
          </Badge>
        )}
      </header>

      <main className="flex-1 p-6">
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>안내:</strong> 회원사 가입 공개 신청 폼은 추후 구현 예정입니다. 현재는 관리자가
          직접 Supabase에서 데이터를 입력하거나, 추후 공개 폼 연동 시 이 화면에서 신청 내역을
          확인할 수 있습니다.
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>신청자</TableHead>
                <TableHead>기관명</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead className="w-24">상태</TableHead>
                <TableHead className="w-32">신청일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(applications ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    신청 내역이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                (applications ?? []).map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.applicant_name ?? "—"}
                    </TableCell>
                    <TableCell>{app.company_name ?? "—"}</TableCell>
                    <TableCell>{app.email ?? "—"}</TableCell>
                    <TableCell>{app.phone ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[app.status]}>
                        {statusLabels[app.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(app.submitted_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}
