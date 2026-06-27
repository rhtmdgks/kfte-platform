import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogDetailPageContent } from "@/components/news/blog-detail-page-content"
import { getPublishedBlogPostWithView } from "@/lib/content-posts"
import { blogPageConfig } from "@/lib/blog-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildBlogPostingSchema } from "@/lib/seo/article-schema"
import { buildBreadcrumbSchema } from "@/lib/seo/breadcrumb-schema"

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

  const { buildContentMetadata } = await import("@/lib/seo/metadata")
  return buildContentMetadata({
    title: `${post.title} | 블로그`,
    description: post.summary || post.content.slice(0, 120),
    slug: id,
    basePath: '/news/blog',
    thumbnailUrl: post.thumbnailUrl,
  })
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPublishedBlogPostWithView(id)

  if (!post) {
    notFound()
  }

  const breadcrumb = buildBreadcrumbSchema([
    { name: '홈', href: '/' },
    { name: '뉴스', href: '/news/notices' },
    { name: '블로그', href: '/news/blog' },
    { name: post.title, href: `${blogPageConfig.basePath}/${id}` },
  ])
  return (
    <>
      <JsonLd data={buildBlogPostingSchema(post, blogPageConfig.basePath)} />
      <JsonLd data={breadcrumb} />
      <BlogDetailPageContent config={blogPageConfig} post={post} />
    </>
  )
}
