import type { EventsPageConfig } from "@/lib/event-types"

export const eventCategoryOptions = ["프로그램", "네트워킹", "데모데이", "포럼", "워크숍"] as const

export const eventsPageConfig: Omit<EventsPageConfig, "posts"> = {
  pageTitle: "행사",
  pageHeading: "행사",
  description:
    "KFTE가 만드는 프로그램, 네트워킹, 데모데이, 포럼. 청소년·청년 창업가가 만나고, 배우고, 연결되는 현장입니다.",
  basePath: "/activities/events",
  archivePath: "/activities/events/archive",
  categories: ["전체", ...eventCategoryOptions],
}

export const eventsSeedPosts = [
  {
    slug: "event-kfte-networking-2026-summer",
    title: "KFTE 청년 창업가 네트워킹 데이 2026 Summer",
    summary:
      "회원사·멘토·투자자·청년 창업가가 한자리에 모이는 여름 네트워킹. 1:1 미팅과 라이트닝 피치가 함께합니다.",
    content:
      "KFTE 청년 창업가 네트워킹 데이는 회원사와 멘토, 투자자, 예비 창업가가 자유롭게 교류하는 오프라인 행사입니다.\n\n■ 프로그램\n- 오프닝 & KFTE 소개\n- 라이트닝 피치 (5분 × 8팀)\n- 1:1 네트워킹 세션\n- 간단한 리셉션\n\n■ 대상\n청년 창업가, KFTE 회원사, 관심 있는 예비 창업가\n\n■ 준비물\n명함 또는 소개 자료(선택)",
    category: "네트워킹",
    subcategory: "오프라인",
    eventDate: "2026-07-18T14:00:00+09:00",
    eventEndDate: "2026-07-18T18:00:00+09:00",
    location: "서울 강남구",
    locationDetail: "KFTE 프로그램센터 2층",
    cost: "무료",
    registrationStart: "2026-06-01T09:00:00+09:00",
    registrationEnd: "2026-07-10T23:59:00+09:00",
    registrationUrl: "#",
    featured: true,
    views: 142,
  },
  {
    slug: "event-youth-tech-demo-day",
    title: "2026 청소년 Tech Demo Day",
    summary:
      "청소년 창업팀의 프로토타입과 아이디어를 무대에 올리는 데모데이. 심사위원 피드백과 시상이 진행됩니다.",
    content:
      "청소년 Tech Demo Day는 KFTE 청소년 분과 참여 팀이 한 학기 동안 준비한 결과물을 발표하는 행사입니다.\n\n■ 발표 형식\n팀당 7분 발표 + 3분 Q&A\n\n■ 심사 기준\n문제 정의, 기술 구현, 팀 실행력, 확장 가능성\n\n■ 시상\n대상 / 우수상 / 특별상",
    category: "데모데이",
    subcategory: "청소년",
    eventDate: "2026-08-23T13:00:00+09:00",
    eventEndDate: "2026-08-23T17:30:00+09:00",
    location: "서울 역삼동",
    locationDetail: "성곡빌딩 세미나실",
    cost: "무료",
    registrationStart: "2026-07-01T09:00:00+09:00",
    registrationEnd: "2026-08-15T23:59:00+09:00",
    registrationUrl: "#",
    views: 98,
  },
  {
    slug: "event-founder-forum-2026",
    title: "Next Tech Founders Forum 2026",
    summary:
      "기술창업 생태계의 선배·동료·후배 창업가가 모여 트렌드와 협력 방향을 나누는 연례 포럼.",
    content:
      "Next Tech Founders Forum은 KFTE의 대표 연례 포럼으로, 기술창업 생태계의 현재와 미래를 함께 논의합니다.\n\n■ 주요 세션\n- 키노트: 2026 기술창업 트렌드\n- 패널: AI 시대 청년 창업\n- 파트너 세션: 생태계 협력 사례",
    category: "포럼",
    subcategory: "연례",
    eventDate: "2026-09-12T10:00:00+09:00",
    eventEndDate: "2026-09-12T16:00:00+09:00",
    location: "서울 강남구",
    locationDetail: "외부 컨퍼런스 센터",
    cost: "50,000원",
    registrationStart: "2026-08-01T09:00:00+09:00",
    registrationEnd: "2026-09-05T23:59:00+09:00",
    registrationUrl: "#",
    views: 76,
  },
  {
    slug: "event-mentoring-bootcamp",
    title: "KFTE 1-Day 멘토링 부트캠프",
    summary:
      "현직 창업가·멘토와 함께 IR deck, GTM, 팀 빌딩을 하루 만에 점검하는 집중 워크숍.",
    content:
      "1-Day 멘토링 부트캠프는 초기 창업팀을 위한 실전 워크숍입니다.\n\n■ 트랙\n- IR deck 클리닉\n- Go-to-market 설계\n- 팀 빌딩 & 역할 분담\n\n■ 규모\n선착순 30명 (팀 단위 신청 가능)",
    category: "워크숍",
    subcategory: "멘토링",
    eventDate: "2026-06-14T11:00:00+09:00",
    eventEndDate: "2026-06-14T17:00:00+09:00",
    location: "서울 강남구",
    locationDetail: "KFTE 프로그램센터",
    cost: "30,000원",
    registrationStart: "2026-05-15T09:00:00+09:00",
    registrationEnd: "2026-06-10T23:59:00+09:00",
    registrationUrl: "#",
    views: 54,
  },
] as const
