import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { EventDetailPageContent } from "@/components/events/event-detail-page-content"
import { getPublishedEventWithView } from "@/lib/content-posts"
import { eventsPageConfig } from "@/lib/events-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildEventSchema } from "@/lib/seo/event-schema"
import { buildBreadcrumbSchema } from "@/lib/seo/breadcrumb-schema"

type PageProps = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const { getPublishedEventBySlug } = await import("@/lib/content-posts")
  const post = await getPublishedEventBySlug(id)

  if (!post) {
    return { title: "행사 | 한국기술창업진흥재단(KFTE)" }
  }

  const { buildContentMetadata } = await import("@/lib/seo/metadata")
  return buildContentMetadata({
    title: `${post.title} | 행사`,
    description: post.summary || post.content.slice(0, 120),
    slug: id,
    basePath: '/activities/events',
    thumbnailUrl: post.thumbnailUrl,
  })
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPublishedEventWithView(id)

  if (!post) {
    notFound()
  }

  const breadcrumb = buildBreadcrumbSchema([
    { name: '홈', href: '/' },
    { name: '활동', href: '/activities/events' },
    { name: '행사', href: '/activities/events' },
    { name: post.title, href: `${eventsPageConfig.basePath}/${id}` },
  ])
  return (
    <>
      <JsonLd data={buildEventSchema(post, eventsPageConfig.basePath)} />
      <JsonLd data={breadcrumb} />
      <EventDetailPageContent config={eventsPageConfig} post={post} />
    </>
  )
}
