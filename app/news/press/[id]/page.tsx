import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NewsDetailPageContent } from "@/components/news/news-detail-page-content"
import { getPublishedNewsPostWithView } from "@/lib/content-posts"
import { pressPageConfig } from "@/lib/press-content"

type PageProps = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const { getPublishedNewsPostBySlug } = await import("@/lib/content-posts")
  const post = await getPublishedNewsPostBySlug("press", id)

  if (!post) {
    return { title: "언론보도 | 한국기술창업진흥재단(KFTE)" }
  }

  return {
    title: `${post.title} | 언론보도 | KFTE`,
    description: post.content.slice(0, 120),
  }
}

export default async function PressDetailPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPublishedNewsPostWithView("press", id)

  if (!post) {
    notFound()
  }

  return <NewsDetailPageContent config={pressPageConfig} post={post} />
}
