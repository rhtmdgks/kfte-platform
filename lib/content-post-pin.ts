type PinnedSortable = {
  pinned?: boolean
  createdAt?: string
  created_at?: string | null
}

export function sortByPinnedThenDate<T extends PinnedSortable>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => {
    const aPinned = Boolean(a.pinned)
    const bPinned = Boolean(b.pinned)

    if (aPinned !== bPinned) {
      return aPinned ? -1 : 1
    }

    const aDate = new Date(a.createdAt ?? a.created_at ?? 0).getTime()
    const bDate = new Date(b.createdAt ?? b.created_at ?? 0).getTime()
    return bDate - aDate
  })
}

export function parseIsPinnedFromFormData(formData: FormData) {
  return formData.get("is_pinned") === "1"
}
