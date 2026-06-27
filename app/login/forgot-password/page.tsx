import type { Metadata } from "next"
import { ForgotPasswordContent } from "@/components/auth/forgot-password-content"

export const metadata: Metadata = {
  title: "비밀번호 재설정",
}

export default function MemberForgotPasswordPage() {
  return <ForgotPasswordContent portal="member" />
}
