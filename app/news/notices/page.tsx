import type { Metadata } from "next"
import { NewsListPageContent } from "@/components/news/news-list-page-content"
import { noticesPage } from "@/lib/notices-content"

export const metadata: Metadata = {
  title: "공지사항 | 한국기술창업진흥재단(KFTE)",
  description: "한국기술창업진흥재단(KFTE) 공지사항. 이벤트, 아티클, 채용 등 재단 소식을 확인하세요.",
}

export default function NoticesPage() {
  return <NewsListPageContent config={noticesPage} />
}
