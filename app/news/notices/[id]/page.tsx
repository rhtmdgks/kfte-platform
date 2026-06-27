import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NewsDetailPageContent } from "@/components/news/news-detail-page-content"
import { getPublishedNewsPostWithView } from "@/lib/content-posts"
import { noticesPageConfig } from "@/lib/notices-content"
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
  const post = await getPublishedNewsPostBySlug("notice", id)

  if (!post) {
    return { title: "공지사항 | 한국기술창업진흥재단(KFTE)" }
  }

  const { buildContentMetadata } = await import("@/lib/seo/metadata")
  return buildContentMetadata({
    title: `${post.title} | 공지사항`,
    description: post.content.slice(0, 120),
    slug: id,
    basePath: '/news/notices',
  })
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPublishedNewsPostWithView("notice", id)

  if (!post) {
    notFound()
  }

  const breadcrumb = buildBreadcrumbSchema([
    { name: '홈', href: '/' },
    { name: '뉴스', href: '/news/notices' },
    { name: '공지사항', href: '/news/notices' },
    { name: post.title, href: `${noticesPageConfig.basePath}/${id}` },
  ])
  return (
    <>
      <JsonLd data={buildNewsArticleSchema(post, noticesPageConfig.basePath)} />
      <JsonLd data={breadcrumb} />
      <NewsDetailPageContent config={noticesPageConfig} post={post} />
    </>
  )
}
