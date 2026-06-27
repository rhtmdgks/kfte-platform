import type { Metadata } from "next"
import { EventArchivePageContent } from "@/components/events/event-archive-page-content"
import { getPublishedEventArchives } from "@/lib/content-posts"
import { eventArchivePageConfig } from "@/lib/event-archive-content"
import type { EventArchivePageConfig } from "@/lib/event-archive-types"

export const metadata: Metadata = {
  title: "행사 아카이브 | 한국기술창업진흥재단(KFTE)",
  description: eventArchivePageConfig.description,
}

export const dynamic = "force-dynamic"

export default async function EventArchivePage() {
  const posts = await getPublishedEventArchives()
  const config: EventArchivePageConfig = { ...eventArchivePageConfig, posts }

  return <EventArchivePageContent config={config} />
}
