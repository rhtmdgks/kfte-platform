import type { Metadata } from "next"
import { ResetPasswordContent } from "@/components/auth/reset-password-content"

export const metadata: Metadata = {
  title: "새 비밀번호 설정 | KFTE OS 파트너",
}

export default function PartnerResetPasswordPage() {
  return <ResetPasswordContent portal="partner" />
}
