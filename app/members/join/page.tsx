import type { Metadata } from "next"
import { JoinPageContent } from "@/components/join-page-content"

export const metadata: Metadata = {
  title: "가입안내 | 한국기술창업진흥재단(KFTE)",
  description:
    "한국기술창업진흥재단(KFTE) 회원가입 안내. 회원가입 절차, 회원 구분, 회비 납부 및 FAQ를 확인할 수 있습니다.",
}

export default function JoinPage() {
  return <JoinPageContent />
}
