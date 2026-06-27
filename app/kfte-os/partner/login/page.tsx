import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginPageContent } from "@/components/auth/login-page-content"

export const metadata: Metadata = {
  title: "파트너 포털 로그인 | KFTE OS",
}

export default function PartnerLoginPage() {
  return (
    <Suspense>
      <LoginPageContent portal="partner" />
    </Suspense>
  )
}
