import type { NewsListConfig } from "@/lib/news-types"

export const pressPage: NewsListConfig = {
  pageTitle: "언론보도",
  pageHeading: "PRESS",
  basePath: "/news/press",
  authorColumnLabel: "매체",
  categories: ["전체", "보도자료", "인터뷰", "협약"],
  posts: [
    {
      id: "press-001",
      title: "KFTE, 청년 기술창업 생태계 허브로 도약 선언",
      content:
        "한국기술창업진흥재단(KFTE)이 청년·청년 기술창업 생태계 허브로서 본격적인 활동에 나선다.\n\nKFTE는 교육, 멘토링, 네트워킹, 정책 제안을 통해 기술 기반 창업을 지원할 계획이다.",
      author: "테크뉴스",
      category: "보도자료",
      createdAt: "2026-06-18T08:00:00+09:00",
      views: 342,
      externalUrl: "https://example.com/press/kfte-launch",
    },
    {
      id: "press-002",
      title: "기술창업 멘토링, 지역 청년 창업가에 '실질적 도움'",
      content:
        "KFTE가 운영하는 기술창업 멘토링 프로그램이 지역 청년 창업가들에게 실질적인 도움을 주고 있다는 평가를 받고 있다.",
      author: "스타트업데일리",
      category: "인터뷰",
      createdAt: "2026-06-10T12:00:00+09:00",
      views: 198,
      externalUrl: "https://example.com/press/kfte-mentoring",
    },
    {
      id: "press-003",
      title: "KFTE-○○대학교, 기술창업 교육 MOU 체결",
      content:
        "한국기술창업진흥재단(KFTE)과 ○○대학교가 기술창업 교육 및 창업 지원을 위한 업무협약(MOU)을 체결했다.",
      author: "대학저널",
      category: "협약",
      createdAt: "2026-06-01T10:00:00+09:00",
      views: 156,
      externalUrl: "https://example.com/press/kfte-mou",
    },
    {
      id: "press-004",
      title: "청소년 창업 교육, KFTE가 앞장선다",
      content:
        "KFTE가 청소년 대상 기술창업 교육 프로그램을 확대 운영하며, 조기 창업 경험 제공에 나선다.",
      author: "교육뉴스",
      category: "보도자료",
      createdAt: "2026-05-22T09:00:00+09:00",
      views: 87,
    },
    {
      id: "press-005",
      title: "데모데이서 빛난 청년 창업팀 5곳",
      content:
        "KFTE 주관 데모데이에서 AI·바이오·친환경 분야 청년 창업팀 5곳이 우수 성과를 거두며 투자자들의 관심을 받았다.",
      author: "벤처스퀘어",
      category: "보도자료",
      createdAt: "2026-05-15T14:00:00+09:00",
      views: 124,
    },
    {
      id: "press-006",
      title: "KFTE 대표 '기술창업은 실패를 자산으로'",
      content:
        "KFTE 대표는 인터뷰에서 \"기술창업 생태계에서 실패를 자산으로 바꾸는 문화가 필요하다\"고 강조했다.",
      author: "이코노미조선",
      category: "인터뷰",
      createdAt: "2026-05-08T11:00:00+09:00",
      views: 203,
    },
    {
      id: "press-007",
      title: "KFTE, 스타트업 얼라이언스와 파트너십",
      content:
        "KFTE가 국내 스타트업 네트워크와 파트너십을 맺고, 공동 프로그램 운영에 나선다.",
      author: "플래텀",
      category: "협약",
      createdAt: "2026-04-28T10:00:00+09:00",
      views: 76,
    },
    {
      id: "press-008",
      title: "기술창업 정책 포럼, KFTE 주최로 개최",
      content:
        "KFTE가 기술창업 정책 포럼을 주최해, 창업가·전문가·정책 담당자가 한자리에 모였다.",
      author: "정책브리핑",
      category: "보도자료",
      createdAt: "2026-04-20T09:00:00+09:00",
      views: 65,
    },
    {
      id: "press-009",
      title: "청년 창업가 10인, KFTE 멘토단 합류",
      content:
        "KFTE 멘토단에 시리즈 A 이상 스타트업 창업자 10명이 새롭게 합류했다.",
      author: "스타트업N",
      category: "보도자료",
      createdAt: "2026-04-12T15:00:00+09:00",
      views: 54,
    },
    {
      id: "press-010",
      title: "KFTE 창업 교육, 전국 확대",
      content:
        "KFTE의 창업 교육 프로그램이 서울을 넘어 수도권·지역으로 확대된다.",
      author: "지역경제신문",
      category: "보도자료",
      createdAt: "2026-04-05T10:00:00+09:00",
      views: 41,
    },
    {
      id: "press-011",
      title: "기술창업, KFTE가 연결한다",
      content:
        "KFTE가 대학·연구기관·기업·투자자를 잇는 개방형 혁신 생태계 구축에 속도를 낸다.",
      author: "IT조선",
      category: "인터뷰",
      createdAt: "2026-03-28T09:00:00+09:00",
      views: 92,
    },
  ],
} as const
