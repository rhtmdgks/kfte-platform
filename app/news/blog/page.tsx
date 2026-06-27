import type { Metadata } from "next"
import { BlogListPageContent } from "@/components/news/blog-list-page-content"
import { getPublishedBlogPosts } from "@/lib/content-posts"
import { blogPageConfig } from "@/lib/blog-content"
import type { BlogListConfig } from "@/lib/blog-types"

export const metadata: Metadata = {
  title: "블로그 | 한국기술창업진흥재단(KFTE)",
  description:
    "한국기술창업진흥재단(KFTE) 블로그. 청소년·청년 기술창업, 행사, 인터뷰, 에세이를 전합니다.",
}

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts()
  const config: BlogListConfig = { ...blogPageConfig, posts }

  return <BlogListPageContent config={config} />
}
