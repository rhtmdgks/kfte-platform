import type { NewsListConfig } from "@/lib/news-types"

export const noticesPage: NewsListConfig = {
  pageTitle: "공지사항",
  pageHeading: "NOTICE",
  basePath: "/news/notices",
  authorColumnLabel: "작성자",
  categories: ["전체", "이벤트", "아티클", "채용"],
  posts: [
    {
      id: "notice-001",
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
      id: "notice-002",
      title: "KFTE 홈페이지 오픈 안내",
      content:
        "한국기술창업진흥재단(KFTE) 공식 홈페이지가 새롭게 오픈했습니다.\n\n재단 소개, 프로그램, 회원사, 소식 등 다양한 정보를 확인하실 수 있습니다.",
      author: "KFTE",
      category: "아티클",
      createdAt: "2026-06-15T10:00:00+09:00",
      views: 256,
    },
    {
      id: "notice-003",
      title: "2026년 하반기 KFTE 운영진 채용 공고",
      content:
        "한국기술창업진흥재단(KFTE)에서 함께할 운영진을 모집합니다.\n\n■ 모집 분야: 프로그램 기획, 커뮤니티 운영\n■ 접수: 2026년 7월 10일까지\n■ 문의: yun@seongyong.com",
      author: "KFTE",
      category: "채용",
      createdAt: "2026-06-10T14:00:00+09:00",
      views: 89,
    },
    {
      id: "notice-004",
      title: "데모데이 참관 신청 안내",
      content:
        "KFTE 주관 2026 상반기 데모데이 참관 신청을 받습니다.\n\n일시: 2026년 8월 15일(금) 14:00\n장소: 서울 강남 (추후 공지)\n\n사전 신청자에 한해 입장 가능합니다.",
      author: "KFTE",
      category: "이벤트",
      createdAt: "2026-06-05T11:00:00+09:00",
      views: 67,
    },
    {
      id: "notice-005",
      title: "회원사 네트워킹 데이 개최 안내",
      content:
        "KFTE 회원사 간 교류를 위한 네트워킹 데이를 개최합니다.\n\n참가 대상: KFTE 정·준회원\n프로그램: 기업 소개, 1:1 미팅, 간담회",
      author: "KFTE",
      category: "이벤트",
      createdAt: "2026-05-28T09:30:00+09:00",
      views: 45,
    },
    {
      id: "notice-006",
      title: "기술창업 생태계 리포트 발간 안내",
      content:
        "2026 KFTE 기술창업 생태계 리포트를 발간했습니다.\n\n청소년·청년 창업 트렌드, 정책 제언, 프로그램 성과를 담았습니다.",
      author: "KFTE",
      category: "아티클",
      createdAt: "2026-05-20T16:00:00+09:00",
      views: 112,
    },
    {
      id: "notice-007",
      title: "2026년 상반기 KFTE 운영 결과 보고",
      content:
        "2026년 상반기 KFTE 주요 프로그램 운영 결과를 공유합니다.\n\n멘토링, 데모데이, 커뮤니티 활동 등 전반적인 성과를 정리했습니다.",
      author: "KFTE",
      category: "아티클",
      createdAt: "2026-05-12T10:00:00+09:00",
      views: 78,
    },
    {
      id: "notice-008",
      title: "여름 인턴십 프로그램 모집",
      content:
        "KFTE 여름 인턴십 프로그램 참가자를 모집합니다.\n\n기간: 2026년 7월 ~ 8월\n분야: 프로그램 운영, 콘텐츠, 행사 기획",
      author: "KFTE",
      category: "채용",
      createdAt: "2026-05-01T09:00:00+09:00",
      views: 134,
    },
    {
      id: "notice-009",
      title: "창업 교육 워크숍 일정 변경 안내",
      content:
        "6월 창업 교육 워크숍 일정이 변경되었습니다.\n\n변경 전: 6월 20일\n변경 후: 6월 27일\n\n양해 부탁드립니다.",
      author: "KFTE",
      category: "이벤트",
      createdAt: "2026-04-25T13:00:00+09:00",
      views: 52,
    },
    {
      id: "notice-010",
      title: "KFTE 회원사 혜택 업데이트 안내",
      content:
        "KFTE 회원사 대상 혜택이 업데이트되었습니다.\n\n멘토링 우선 배정, 행사 할인, 네트워킹 프로그램 등이 포함됩니다.",
      author: "KFTE",
      category: "아티클",
      createdAt: "2026-04-18T15:00:00+09:00",
      views: 91,
    },
    {
      id: "notice-011",
      title: "2026 KFTE 창업 포럼 사전 등록 안내",
      content:
        "2026 KFTE 창업 포럼 사전 등록을 시작합니다.\n\n주제: 기술창업과 지역 혁신\n일시: 2026년 9월 (예정)",
      author: "KFTE",
      category: "이벤트",
      createdAt: "2026-04-10T10:00:00+09:00",
      views: 63,
    },
    {
      id: "notice-012",
      title: "개인정보처리방침 개정 안내",
      content:
        "KFTE 개인정보처리방침이 2026년 4월 1일부로 개정됩니다.\n\n주요 변경: 회원 가입 관련 수집 항목 명시",
      author: "KFTE",
      category: "아티클",
      createdAt: "2026-03-28T09:00:00+09:00",
      views: 38,
    },
  ],
} as const
