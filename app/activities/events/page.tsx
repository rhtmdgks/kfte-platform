import type { Metadata } from "next"
import { EventsPageContent } from "@/components/events/events-page-content"
import { getPublishedEvents } from "@/lib/content-posts"
import { eventsPageConfig } from "@/lib/events-content"
import type { EventsPageConfig } from "@/lib/event-types"

export const metadata: Metadata = {
  title: "행사 | 한국기술창업진흥재단(KFTE)",
  description: eventsPageConfig.description,
}

export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const posts = await getPublishedEvents()
  const config: EventsPageConfig = { ...eventsPageConfig, posts }

  return <EventsPageContent config={config} />
}
