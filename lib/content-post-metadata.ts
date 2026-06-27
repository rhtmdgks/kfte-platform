import type { Json } from "@/types/database"

export type ContentPostMetadata = {
  author?: string
  category?: string
  views?: number
  attachmentUrl?: string
  attachmentName?: string
}

export function parseContentPostMetadata(metadata: Json | null): ContentPostMetadata {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {}
  }

  const record = metadata as Record<string, Json | undefined>

  return {
    author: typeof record.author === "string" ? record.author : undefined,
    category: typeof record.category === "string" ? record.category : undefined,
    views: typeof record.views === "number" ? record.views : undefined,
    attachmentUrl:
      typeof record.attachmentUrl === "string" ? record.attachmentUrl : undefined,
    attachmentName:
      typeof record.attachmentName === "string" ? record.attachmentName : undefined,
  }
}

export function buildContentPostMetadata(
  input: ContentPostMetadata,
  existing?: ContentPostMetadata,
): Json {
  return {
    author: input.author ?? existing?.author,
    category: input.category ?? existing?.category,
    views: existing?.views ?? input.views ?? 0,
    attachmentUrl: input.attachmentUrl ?? existing?.attachmentUrl,
    attachmentName: input.attachmentName ?? existing?.attachmentName,
  }
}
