import type { Metadata } from "next"
import { ForgotPasswordContent } from "@/components/auth/forgot-password-content"

export const metadata: Metadata = {
  title: "비밀번호 재설정 | KFTE OS 파트너",
}

export default function PartnerForgotPasswordPage() {
  return <ForgotPasswordContent portal="partner" />
}
