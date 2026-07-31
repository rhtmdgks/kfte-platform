import type { Metadata } from "next"
import { EventsPageContent } from "@/components/events/events-page-content"
import { getPublishedEvents } from "@/lib/content-posts"
import { getActiveEventBanners } from "@/lib/event-banners"
import { eventsPageConfig } from "@/lib/events-content"
import type { EventsPageConfig } from "@/lib/event-types"

export const metadata: Metadata = {
  title: "행사 | 한국기술창업진흥재단(KFTE)",
  description: eventsPageConfig.description,
}

export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const [posts, banners] = await Promise.all([
    getPublishedEvents(),
    getActiveEventBanners(),
  ])
  const config: EventsPageConfig = {
    ...eventsPageConfig,
    posts,
    banners: banners.map((banner) => ({
      id: banner.id,
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      metaText: banner.metaText,
    })),
  }

  return <EventsPageContent config={config} />
}
