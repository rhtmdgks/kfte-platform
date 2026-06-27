import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { EventDetailPageContent } from "@/components/events/event-detail-page-content"
import { getPublishedEventArchiveWithView } from "@/lib/content-posts"
import { eventArchivePageConfig } from "@/lib/event-archive-content"

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

  return {
    title: `${post.title} | 행사 아카이브 | KFTE`,
    description: post.summary || post.content.slice(0, 120),
    openGraph: post.thumbnailUrl
      ? {
          images: [{ url: post.thumbnailUrl }],
        }
      : undefined,
  }
}

export default async function EventArchiveDetailPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPublishedEventArchiveWithView(id)

  if (!post) {
    notFound()
  }

  return (
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
  )
}
