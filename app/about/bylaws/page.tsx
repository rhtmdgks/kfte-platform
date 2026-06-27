import type { Metadata } from "next"
import { BylawsPageContent } from "@/components/bylaws-page-content"

export const metadata: Metadata = {
  title: "정관 | 한국기술창업진흥재단(KFTE)",
  description:
    "한국기술창업진흥재단(KFTE) 표준정관. 재단의 설립 목적, 조직, 회원·임원, 이사회·총회, 회계 및 재정 등 운영의 기본 규범을 확인하세요.",
}

export default function BylawsPage() {
  return <BylawsPageContent />
}
