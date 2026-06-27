import type { Metadata } from "next"
import { NewsListPageContent } from "@/components/news/news-list-page-content"
import { pressPage } from "@/lib/press-content"

export const metadata: Metadata = {
  title: "언론보도 | 한국기술창업진흥재단(KFTE)",
  description: "한국기술창업진흥재단(KFTE) 언론보도. 보도자료, 인터뷰, 협약 관련 기사를 확인하세요.",
}

export default function PressPage() {
  return <NewsListPageContent config={pressPage} />
}
