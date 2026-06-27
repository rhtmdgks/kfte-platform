import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NewsDetailPageContent } from "@/components/news/news-detail-page-content"
import { getPublishedNewsPostWithView } from "@/lib/content-posts"
import { noticesPageConfig } from "@/lib/notices-content"

type PageProps = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const { getPublishedNewsPostBySlug } = await import("@/lib/content-posts")
  const post = await getPublishedNewsPostBySlug("notice", id)

  if (!post) {
    return { title: "공지사항 | 한국기술창업진흥재단(KFTE)" }
  }

  return {
    title: `${post.title} | 공지사항 | KFTE`,
    description: post.content.slice(0, 120),
  }
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPublishedNewsPostWithView("notice", id)

  if (!post) {
    notFound()
  }

  return <NewsDetailPageContent config={noticesPageConfig} post={post} />
}
