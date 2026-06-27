import type { Metadata } from "next"
import { Suspense } from "react"
import { InternalLoginPageContent } from "@/components/auth/internal-login-page-content"

export const metadata: Metadata = {
  title: "내부용 로그인 | KFTE OS",
}

export default function InternalLoginPage() {
  return (
    <Suspense>
      <InternalLoginPageContent />
    </Suspense>
  )
}
