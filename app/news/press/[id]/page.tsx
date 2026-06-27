import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NewsDetailPageContent } from "@/components/news/news-detail-page-content"
import { getPublishedNewsPostWithView } from "@/lib/content-posts"
import { pressPageConfig } from "@/lib/press-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildNewsArticleSchema } from "@/lib/seo/article-schema"
import { buildBreadcrumbSchema } from "@/lib/seo/breadcrumb-schema"

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

  const { buildContentMetadata } = await import("@/lib/seo/metadata")
  return buildContentMetadata({
    title: `${post.title} | 언론보도`,
    description: post.content.slice(0, 120),
    slug: id,
    basePath: '/news/press',
  })
}

export default async function PressDetailPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPublishedNewsPostWithView("press", id)

  if (!post) {
    notFound()
  }

  const breadcrumb = buildBreadcrumbSchema([
    { name: '홈', href: '/' },
    { name: '뉴스', href: '/news/notices' },
    { name: '언론보도', href: '/news/press' },
    { name: post.title, href: `${pressPageConfig.basePath}/${id}` },
  ])
  return (
    <>
      <JsonLd data={buildNewsArticleSchema(post, pressPageConfig.basePath)} />
      <JsonLd data={breadcrumb} />
      <NewsDetailPageContent config={pressPageConfig} post={post} />
    </>
  )
}
