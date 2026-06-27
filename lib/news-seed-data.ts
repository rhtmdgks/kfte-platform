/** 초기 공개 목업 데이터 — Supabase 시드용 */
export type NewsSeedPost = {
  slug: string
  title: string
  content: string
  author: string
  category: string
  createdAt: string
  views: number
  attachmentUrl?: string
  attachmentName?: string
  externalUrl?: string
}

export const noticesSeedPosts: NewsSeedPost[] = [
  {
    slug: "notice-001",
    title: "2026년 KFTE 청년 기술창업 멘토링 프로그램 모집 안내",
    content:
      "한국기술창업진흥재단(KFTE)은 청년 창업가를 대상으로 기술창업 멘토링 프로그램 참가자를 모집합니다.\n\n■ 모집 기간: 2026년 7월 1일 ~ 7월 31일\n■ 대상: 만 19세~39세 예비·초기 창업자\n■ 프로그램: 1:1 멘토링, IR 피드백, 네트워킹\n\n자세한 내용은 첨부 파일을 확인해 주세요.",
    author: "KFTE",
    category: "이벤트",
    createdAt: "2026-06-20T09:00:00+09:00",
    views: 128,
    attachmentUrl: "#",
    attachmentName: "2026-멘토링-모집-안내.pdf",
  },
  {
    slug: "notice-002",
    title: "KFTE 홈페이지 오픈 안내",
    content:
      "한국기술창업진흥재단(KFTE) 공식 홈페이지가 새롭게 오픈했습니다.\n\n재단 소개, 프로그램, 회원사, 소식 등 다양한 정보를 확인하실 수 있습니다.",
    author: "KFTE",
    category: "아티클",
    createdAt: "2026-06-15T10:00:00+09:00",
    views: 256,
  },
  {
    slug: "notice-003",
    title: "2026년 하반기 KFTE 운영진 채용 공고",
    content:
      "한국기술창업진흥재단(KFTE)에서 함께할 운영진을 모집합니다.\n\n■ 모집 분야: 프로그램 기획, 커뮤니티 운영\n■ 접수: 2026년 7월 10일까지\n■ 문의: yun@seongyong.com",
    author: "KFTE",
    category: "채용",
    createdAt: "2026-06-10T14:00:00+09:00",
    views: 89,
  },
  {
    slug: "notice-004",
    title: "데모데이 참관 신청 안내",
    content:
      "KFTE 주관 2026 상반기 데모데이 참관 신청을 받습니다.\n\n일시: 2026년 8월 15일(금) 14:00\n장소: 서울 강남 (추후 공지)\n\n사전 신청자에 한해 입장 가능합니다.",
    author: "KFTE",
    category: "이벤트",
    createdAt: "2026-06-05T11:00:00+09:00",
    views: 67,
  },
  {
    slug: "notice-005",
    title: "회원사 네트워킹 데이 개최 안내",
    content:
      "KFTE 회원사 간 교류를 위한 네트워킹 데이를 개최합니다.\n\n참가 대상: KFTE 정·준회원\n프로그램: 기업 소개, 1:1 미팅, 간담회",
    author: "KFTE",
    category: "이벤트",
    createdAt: "2026-05-28T09:30:00+09:00",
    views: 45,
  },
  {
    slug: "notice-006",
    title: "기술창업 생태계 리포트 발간 안내",
    content:
      "2026 KFTE 기술창업 생태계 리포트를 발간했습니다.\n\n청소년·청년 창업 트렌드, 정책 제언, 프로그램 성과를 담았습니다.",
    author: "KFTE",
    category: "아티클",
    createdAt: "2026-05-20T16:00:00+09:00",
    views: 112,
  },
  {
    slug: "notice-007",
    title: "2026년 상반기 KFTE 운영 결과 보고",
    content:
      "2026년 상반기 KFTE 주요 프로그램 운영 결과를 공유합니다.\n\n멘토링, 데모데이, 커뮤니티 활동 등 전반적인 성과를 정리했습니다.",
    author: "KFTE",
    category: "아티클",
    createdAt: "2026-05-12T10:00:00+09:00",
    views: 78,
  },
  {
    slug: "notice-008",
    title: "여름 인턴십 프로그램 모집",
    content:
      "KFTE 여름 인턴십 프로그램 참가자를 모집합니다.\n\n기간: 2026년 7월 ~ 8월\n분야: 프로그램 운영, 콘텐츠, 행사 기획",
    author: "KFTE",
    category: "채용",
    createdAt: "2026-05-01T09:00:00+09:00",
    views: 134,
  },
  {
    slug: "notice-009",
    title: "창업 교육 워크숍 일정 변경 안내",
    content:
      "6월 창업 교육 워크숍 일정이 변경되었습니다.\n\n변경 전: 6월 20일\n변경 후: 6월 27일\n\n양해 부탁드립니다.",
    author: "KFTE",
    category: "이벤트",
    createdAt: "2026-04-25T13:00:00+09:00",
    views: 52,
  },
  {
    slug: "notice-010",
    title: "KFTE 회원사 혜택 업데이트 안내",
    content:
      "KFTE 회원사 대상 혜택이 업데이트되었습니다.\n\n멘토링 우선 배정, 행사 할인, 네트워킹 프로그램 등이 포함됩니다.",
    author: "KFTE",
    category: "아티클",
    createdAt: "2026-04-18T15:00:00+09:00",
    views: 91,
  },
  {
    slug: "notice-011",
    title: "2026 KFTE 창업 포럼 사전 등록 안내",
    content:
      "2026 KFTE 창업 포럼 사전 등록을 시작합니다.\n\n주제: 기술창업과 지역 혁신\n일시: 2026년 9월 (예정)",
    author: "KFTE",
    category: "이벤트",
    createdAt: "2026-04-10T10:00:00+09:00",
    views: 63,
  },
  {
    slug: "notice-012",
    title: "개인정보처리방침 개정 안내",
    content:
      "KFTE 개인정보처리방침이 2026년 4월 1일부로 개정됩니다.\n\n주요 변경: 회원 가입 관련 수집 항목 명시",
    author: "KFTE",
    category: "아티클",
    createdAt: "2026-03-28T09:00:00+09:00",
    views: 38,
  },
]

export const pressSeedPosts: NewsSeedPost[] = [
  {
    slug: "press-001",
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
    slug: "press-002",
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
    slug: "press-003",
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
    slug: "press-004",
    title: "청소년 창업 교육, KFTE가 앞장선다",
    content:
      "KFTE가 청소년 대상 기술창업 교육 프로그램을 확대 운영하며, 조기 창업 경험 제공에 나선다.",
    author: "교육뉴스",
    category: "보도자료",
    createdAt: "2026-05-22T09:00:00+09:00",
    views: 87,
  },
  {
    slug: "press-005",
    title: "데모데이서 빛난 청년 창업팀 5곳",
    content:
      "KFTE 주관 데모데이에서 AI·바이오·친환경 분야 청년 창업팀 5곳이 우수 성과를 거두며 투자자들의 관심을 받았다.",
    author: "벤처스퀘어",
    category: "보도자료",
    createdAt: "2026-05-15T14:00:00+09:00",
    views: 124,
  },
  {
    slug: "press-006",
    title: "KFTE 대표 '기술창업은 실패를 자산으로'",
    content:
      "KFTE 대표는 인터뷰에서 \"기술창업 생태계에서 실패를 자산으로 바꾸는 문화가 필요하다\"고 강조했다.",
    author: "이코노미조선",
    category: "인터뷰",
    createdAt: "2026-05-08T11:00:00+09:00",
    views: 203,
  },
  {
    slug: "press-007",
    title: "KFTE, 스타트업 얼라이언스와 파트너십",
    content:
      "KFTE가 국내 스타트업 네트워크와 파트너십을 맺고, 공동 프로그램 운영에 나선다.",
    author: "플래텀",
    category: "협약",
    createdAt: "2026-04-28T10:00:00+09:00",
    views: 76,
  },
  {
    slug: "press-008",
    title: "기술창업 정책 포럼, KFTE 주최로 개최",
    content:
      "KFTE가 기술창업 정책 포럼을 주최해, 창업가·전문가·정책 담당자가 한자리에 모였다.",
    author: "정책브리핑",
    category: "보도자료",
    createdAt: "2026-04-20T09:00:00+09:00",
    views: 65,
  },
  {
    slug: "press-009",
    title: "청년 창업가 10인, KFTE 멘토단 합류",
    content:
      "KFTE 멘토단에 시리즈 A 이상 스타트업 창업자 10명이 새롭게 합류했다.",
    author: "스타트업N",
    category: "보도자료",
    createdAt: "2026-04-12T15:00:00+09:00",
    views: 54,
  },
  {
    slug: "press-010",
    title: "KFTE 창업 교육, 전국 확대",
    content:
      "KFTE의 창업 교육 프로그램이 서울을 넘어 수도권·지역으로 확대된다.",
    author: "지역경제신문",
    category: "보도자료",
    createdAt: "2026-04-05T10:00:00+09:00",
    views: 41,
  },
  {
    slug: "press-011",
    title: "기술창업, KFTE가 연결한다",
    content:
      "KFTE가 대학·연구기관·기업·투자자를 잇는 개방형 혁신 생태계 구축에 속도를 낸다.",
    author: "IT조선",
    category: "인터뷰",
    createdAt: "2026-03-28T09:00:00+09:00",
    views: 92,
  },
]
