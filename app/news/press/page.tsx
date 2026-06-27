import type { Metadata } from "next"
import { NewsListPageContent } from "@/components/news/news-list-page-content"
import { getPublishedNewsPosts } from "@/lib/content-posts"
import { pressPageConfig } from "@/lib/press-content"
import type { NewsListConfig } from "@/lib/news-types"

export const metadata: Metadata = {
  title: "언론보도 | 한국기술창업진흥재단(KFTE)",
  description: "한국기술창업진흥재단(KFTE) 언론보도. 보도자료, 인터뷰, 협약 관련 기사를 확인하세요.",
}

export const dynamic = "force-dynamic"

export default async function PressPage() {
  const posts = await getPublishedNewsPosts("press")
  const config: NewsListConfig = { ...pressPageConfig, posts }

  return <NewsListPageContent config={config} />
}
