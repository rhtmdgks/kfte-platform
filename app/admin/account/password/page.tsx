import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ChangePasswordForm } from "@/components/admin/change-password-form"

export default function AdminChangePasswordPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <h1 className="text-lg font-semibold text-[#002065]">비밀번호 변경</h1>
      </header>

      <main className="flex-1 p-6">
        <p className="mb-6 max-w-md text-sm text-muted-foreground">
          로그인한 본인 계정의 비밀번호만 변경할 수 있습니다. 다른 관리자 비밀번호는 변경할 수
          없습니다.
        </p>
        <ChangePasswordForm />
      </main>
    </div>
  )
}
