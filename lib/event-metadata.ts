import type { Json } from "@/types/database"
import { parseContentPostMetadata } from "@/lib/content-post-metadata"

export type EventPostMetadata = {
  eventDate?: string
  eventEndDate?: string
  location?: string
  locationDetail?: string
  cost?: string
  registrationStart?: string
  registrationEnd?: string
  subcategory?: string
  featured?: boolean
  /** 행사 상세 사이드바 문의 전화 (미입력 시 사이트 기본값) */
  contactPhone?: string
  /** 행사 상세 사이드바 문의 이메일 (미입력 시 사이트 기본값) */
  contactEmail?: string
  /** null clears stored dimensions (e.g. poster removed) */
  detailImageWidth?: number | null
  detailImageHeight?: number | null
}

export function parseEventPostMetadata(metadata: Json | null) {
  const base = parseContentPostMetadata(metadata)
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return { ...base } as ReturnType<typeof parseContentPostMetadata> & EventPostMetadata
  }

  const record = metadata as Record<string, Json | undefined>

  return {
    ...base,
    eventDate: typeof record.eventDate === "string" ? record.eventDate : undefined,
    eventEndDate: typeof record.eventEndDate === "string" ? record.eventEndDate : undefined,
    location: typeof record.location === "string" ? record.location : undefined,
    locationDetail: typeof record.locationDetail === "string" ? record.locationDetail : undefined,
    cost: typeof record.cost === "string" ? record.cost : undefined,
    registrationStart:
      typeof record.registrationStart === "string" ? record.registrationStart : undefined,
    registrationEnd:
      typeof record.registrationEnd === "string" ? record.registrationEnd : undefined,
    subcategory: typeof record.subcategory === "string" ? record.subcategory : undefined,
    featured: typeof record.featured === "boolean" ? record.featured : undefined,
    contactPhone: typeof record.contactPhone === "string" ? record.contactPhone : undefined,
    contactEmail: typeof record.contactEmail === "string" ? record.contactEmail : undefined,
    detailImageWidth:
      typeof record.detailImageWidth === "number" && Number.isFinite(record.detailImageWidth)
        ? record.detailImageWidth
        : undefined,
    detailImageHeight:
      typeof record.detailImageHeight === "number" && Number.isFinite(record.detailImageHeight)
        ? record.detailImageHeight
        : undefined,
  }
}

export function buildEventPostMetadata(
  input: EventPostMetadata & {
    author?: string
    category?: string
    views?: number
  },
  existing?: ReturnType<typeof parseEventPostMetadata>,
): Json {
  return {
    author: input.author ?? existing?.author,
    category: input.category ?? existing?.category,
    views: existing?.views ?? input.views ?? 0,
    eventDate: input.eventDate ?? existing?.eventDate,
    eventEndDate: input.eventEndDate ?? existing?.eventEndDate,
    location: input.location ?? existing?.location,
    locationDetail: input.locationDetail ?? existing?.locationDetail,
    cost: input.cost ?? existing?.cost,
    registrationStart: input.registrationStart ?? existing?.registrationStart,
    registrationEnd: input.registrationEnd ?? existing?.registrationEnd,
    subcategory: input.subcategory ?? existing?.subcategory,
    featured: input.featured ?? existing?.featured ?? false,
    contactPhone:
      input.contactPhone !== undefined
        ? input.contactPhone || undefined
        : existing?.contactPhone,
    contactEmail:
      input.contactEmail !== undefined
        ? input.contactEmail || undefined
        : existing?.contactEmail,
    detailImageWidth:
      input.detailImageWidth === null
        ? undefined
        : (input.detailImageWidth ?? existing?.detailImageWidth),
    detailImageHeight:
      input.detailImageHeight === null
        ? undefined
        : (input.detailImageHeight ?? existing?.detailImageHeight),
  }
}

/** datetime-local input value (KST wall clock) */
export function toDatetimeLocalValue(isoString?: string) {
  if (!isoString) return ""
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ""

  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(" ", "T")

  return parts
}

export function fromDatetimeLocalValue(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const date = new Date(`${trimmed}:00+09:00`)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}
