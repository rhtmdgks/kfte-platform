import type { Metadata } from "next"
import { NewsListPageContent } from "@/components/news/news-list-page-content"
import { getPublishedNewsPosts } from "@/lib/content-posts"
import { noticesPageConfig } from "@/lib/notices-content"
import type { NewsListConfig } from "@/lib/news-types"

export const metadata: Metadata = {
  title: "공지사항 | 한국기술창업진흥재단(KFTE)",
  description: "한국기술창업진흥재단(KFTE) 공지사항. 이벤트, 아티클, 채용 등 재단 소식을 확인하세요.",
}

export const dynamic = "force-dynamic"

export default async function NoticesPage() {
  const posts = await getPublishedNewsPosts("notice")
  const config: NewsListConfig = { ...noticesPageConfig, posts }

  return <NewsListPageContent config={config} />
}
