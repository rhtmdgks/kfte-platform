import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogDetailPageContent } from "@/components/news/blog-detail-page-content"
import { getPublishedBlogPostWithView } from "@/lib/content-posts"
import { blogPageConfig } from "@/lib/blog-content"

type PageProps = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const { getPublishedBlogPostBySlug } = await import("@/lib/content-posts")
  const post = await getPublishedBlogPostBySlug(id)

  if (!post) {
    return { title: "블로그 | 한국기술창업진흥재단(KFTE)" }
  }

  return {
    title: `${post.title} | 블로그 | KFTE`,
    description: post.summary || post.content.slice(0, 120),
    openGraph: post.thumbnailUrl
      ? {
          images: [{ url: post.thumbnailUrl }],
        }
      : undefined,
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPublishedBlogPostWithView(id)

  if (!post) {
    notFound()
  }

  return <BlogDetailPageContent config={blogPageConfig} post={post} />
}
