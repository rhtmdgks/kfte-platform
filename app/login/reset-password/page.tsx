import type { Metadata } from "next"
import { ResetPasswordContent } from "@/components/auth/reset-password-content"

export const metadata: Metadata = {
  title: "새 비밀번호 설정",
}

export default function MemberResetPasswordPage() {
  return <ResetPasswordContent portal="member" />
}
