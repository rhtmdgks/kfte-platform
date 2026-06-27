import type { Metadata } from "next"
import { CiPageContent } from "@/components/ci-page-content"

export const metadata: Metadata = {
  title: "CI | 한국기술창업진흥재단(KFTE)",
  description:
    "한국기술창업진흥재단(KFTE) CI 아카이브. KFTE 2.0 및 1.0 브랜드 자산을 확인하고 다운로드할 수 있습니다.",
}

export default function CiPage() {
  return <CiPageContent />
}
