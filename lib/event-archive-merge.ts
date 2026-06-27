import type { EventPost } from "@/lib/event-types"
import { getEventRegistrationStatus } from "@/lib/event-types"

export type EventArchiveSource = "manual" | "event"

export type EventArchiveEntry = EventPost & {
  archiveSource: EventArchiveSource
}

export function isEventEligibleForArchive(event: EventPost) {
  return getEventRegistrationStatus(event) === "closed"
}

export function sortEventsByDateDesc(posts: readonly EventPost[]) {
  return [...posts].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
  )
}

export function mergeEventArchivePosts(
  manualArchives: readonly EventPost[],
  events: readonly EventPost[],
): EventArchiveEntry[] {
  const manualSlugs = new Set(manualArchives.map((post) => post.id))

  const autoArchives = events
    .filter(isEventEligibleForArchive)
    .filter((event) => !manualSlugs.has(event.id))
    .map(
      (event): EventArchiveEntry => ({
        ...event,
        archiveSource: "event",
      }),
    )

  const mergedManual = manualArchives.map(
    (post): EventArchiveEntry => ({
      ...post,
      archiveSource: "manual",
    }),
  )

  return sortEventsByDateDesc([...mergedManual, ...autoArchives]) as EventArchiveEntry[]
}

export function filterActiveEvents(events: readonly EventPost[]) {
  return events.filter((event) => !isEventEligibleForArchive(event))
}

export function getEventArchiveContentType(entry: EventArchiveEntry) {
  return entry.archiveSource === "manual" ? ("event_archive" as const) : ("event" as const)
}
