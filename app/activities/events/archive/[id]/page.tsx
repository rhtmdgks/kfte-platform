import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { EventDetailPageContent } from "@/components/events/event-detail-page-content"
import { getPublishedEventArchiveWithView } from "@/lib/content-posts"
import { eventArchivePageConfig } from "@/lib/event-archive-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildEventSchema } from "@/lib/seo/event-schema"
import { buildBreadcrumbSchema } from "@/lib/seo/breadcrumb-schema"

type PageProps = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const { getPublishedEventArchiveBySlug } = await import("@/lib/content-posts")
  const post = await getPublishedEventArchiveBySlug(id)

  if (!post) {
    return { title: "행사 아카이브 | 한국기술창업진흥재단(KFTE)" }
  }

  const { buildContentMetadata } = await import("@/lib/seo/metadata")
  return buildContentMetadata({
    title: `${post.title} | 행사 아카이브`,
    description: post.summary || post.content.slice(0, 120),
    slug: id,
    basePath: '/activities/events/archive',
    thumbnailUrl: post.thumbnailUrl,
  })
}

export default async function EventArchiveDetailPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPublishedEventArchiveWithView(id)

  if (!post) {
    notFound()
  }

  const breadcrumb = buildBreadcrumbSchema([
    { name: '홈', href: '/' },
    { name: '활동', href: '/activities/events' },
    { name: '행사 아카이브', href: '/activities/events/archive' },
    { name: post.title, href: `${eventArchivePageConfig.basePath}/${id}` },
  ])
  return (
    <>
      <JsonLd data={buildEventSchema(post, eventArchivePageConfig.basePath, true)} />
      <JsonLd data={breadcrumb} />
      <EventDetailPageContent
        config={{
          pageTitle: eventArchivePageConfig.pageTitle,
          pageHeading: eventArchivePageConfig.pageHeading,
          description: eventArchivePageConfig.description,
          basePath: eventArchivePageConfig.basePath,
          archivePath: eventArchivePageConfig.basePath,
          categories: eventArchivePageConfig.categories,
        }}
        post={post}
        mode="archive"
      />
    </>
  )
}
