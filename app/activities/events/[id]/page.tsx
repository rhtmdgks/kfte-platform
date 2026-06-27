import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { EventDetailPageContent } from "@/components/events/event-detail-page-content"
import { getPublishedEventWithView } from "@/lib/content-posts"
import { eventsPageConfig } from "@/lib/events-content"

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

  return {
    title: `${post.title} | 행사 | KFTE`,
    description: post.summary || post.content.slice(0, 120),
    openGraph: post.thumbnailUrl
      ? {
          images: [{ url: post.thumbnailUrl }],
        }
      : undefined,
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPublishedEventWithView(id)

  if (!post) {
    notFound()
  }

  return <EventDetailPageContent config={eventsPageConfig} post={post} />
}
