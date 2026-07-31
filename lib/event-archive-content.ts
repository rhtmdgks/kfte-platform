import type { EventArchivePageConfig } from "@/lib/event-archive-types"

export const eventArchivePageConfig: Omit<EventArchivePageConfig, "posts"> = {
  pageTitle: "행사 아카이브",
  pageHeading: "행사 아카이브",
  description:
    "KFTE가 함께해 온 프로그램, 포럼, 데모데이, 네트워킹의 기록입니다. 지나간 현장의 에너지와 연결의 흔적을 모았습니다.",
  basePath: "/activities/events/archive",
  eventsPath: "/activities/events",
  categories: ["전체", "프로그램", "네트워킹", "데모데이", "포럼", "컨퍼런스"],
}

/** 시드 아카이브 — 비움 (비즈쿨 전환 후 수동 등록) */
export const eventArchivesSeedPosts = [] as const
