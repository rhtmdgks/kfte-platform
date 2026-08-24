export const site = {
  name: "한국기술창업진흥재단",
  nameEn: "KFTE",
  fullName: "한국기술창업진흥재단(KFTE)",
  tagline: "청소년과 청년의\n기술창업을 현실로 연결합니다",
  description:
    "한국기술창업진흥재단(KFTE)은 청소년과 청년이 기술로 창업에 도전할 수 있도록 교육·멘토링·네트워크·커뮤니티를 운영하는 민간 비영리 기술창업 생태계 재단입니다.",
  email: "yun@seongyong.com",
  phone: "070-7954-8795",
  fax: "050-8945-3639",
  address: "서울특별시 강남구 테헤란로 128 2층 126호 (역삼동, 성곡빌딩)",
  chairman: "윤성용",
  registrationNumber: "316-82-77638",
  concept: "Next Tech Founders Hub",
} as const

export const navMenu = [
  {
    label: "한국기술창업진흥재단",
    href: "/about",
    items: [
      { label: "소개", href: "/about" },
      { label: "우리가 하는 일", href: "/about/what-we-do" },
      { label: "선언문", href: "/about/manifesto" },
      { label: "정관", href: "/about/bylaws" },
      { label: "함께하는 사람들", href: "/about/partners" },
      { label: "찾아오시는 길", href: "/about/location" },
      { label: "CI", href: "/about/ci" },
    ],
  },
  {
    label: "활동",
    href: "/activities/events",
    items: [
      { label: "프로그램", href: "/activities/programs" },
      { label: "행사", href: "/activities/events" },
      { label: "행사 아카이브", href: "/activities/events/archive" },
    ],
  },
  {
    label: "회원사",
    href: "/members",
    items: [
      { label: "회원사", href: "/members" },
      { label: "가입안내", href: "/members/join" },
      { label: "회원사 인터뷰", href: "/members/interviews" },
      { label: "회원사 혜택", href: "/members/benefits" },
    ],
  },
  {
    label: "뉴스",
    href: "/news/notices",
    items: [
      { label: "공지사항", href: "/news/notices" },
      { label: "언론보도", href: "/news/press" },
      { label: "블로그", href: "/news/blog" },
    ],
  },
] as const

export const navAuth: readonly { label: string; href: string }[] = [
  { label: "로그인", href: "/login" },
  { label: "회원가입", href: "/signup" },
]

export const navLinks = navMenu.flatMap((group) =>
  group.items.map((item) => ({ label: item.label, href: item.href })),
)

export const whatWeDo = {
  eyebrow: "사명",
  title: "What We Do",
  headline: "우리는 기술창업을 시작하는 사람들을 위해 일합니다",
  description:
    "KFTE는 청소년과 청년이 기술 기반 아이디어를 검증하고, 팀을 구성하며, 실제 시장과 연결될 수 있도록 교육·멘토링·네트워크·정책 제안·커뮤니티를 운영합니다.",
  pillars: [
    {
      number: "01",
      title: "기술창업 교육",
      description:
        "아이디어 발굴, MVP, 사업화, 팀빌딩, 투자 기초 교육",
    },
    {
      number: "02",
      title: "창업 커뮤니티",
      description:
        "청소년·청년 창업가들이 경험과 자원을 공유하는 커뮤니티",
    },
    {
      number: "03",
      title: "멘토링·네트워크",
      description:
        "선배 창업가, 개발자, 투자자, 전문가와의 연결",
    },
    {
      number: "04",
      title: "생태계 협력",
      description:
        "학교, 기업, 기관, 투자자와의 협력 기반 조성",
    },
  ],
} as const

export const whoWeServe = {
  eyebrow: "대상",
  title: "Who We Serve",
  headline: "KFTE가 지원하는 청소년·청년 창업가",
  audiences: [
    {
      number: "01",
      title: "청소년 창업가",
      description:
        "학교 안팎에서 기술과 창업을 실험하는 청소년들이 안전하게 도전하고 성장할 수 있도록 돕습니다.",
    },
    {
      number: "02",
      title: "대학생·청년 창업가",
      description:
        "아이디어 단계부터 초기 사업화까지 팀·기술·시장 검증에 필요한 연결을 제공합니다.",
    },
    {
      number: "03",
      title: "기술창업팀",
      description:
        "개발, 제품, 사업화, 투자, 제휴 등 성장 과정에서 필요한 네트워크를 만듭니다.",
    },
    {
      number: "04",
      title: "크리에이터·메이커",
      description:
        "기술과 콘텐츠, 제품과 커뮤니티를 연결하는 새로운 창업 방식을 지원합니다.",
    },
    {
      number: "05",
      title: "파트너 기관·기업",
      description:
        "다음 세대 창업가를 함께 발굴하고 육성할 협력 구조를 제안합니다.",
    },
  ],
} as const

export const impact = {
  eyebrow: "성과",
  title: "Impact",
  headline: "KFTE 임팩트",
  description:
    "KFTE의 임팩트 지표는 주요 프로그램 운영 이후 순차적으로 공개됩니다.",
  stats: [
    { value: "—", suffix: "팀", label: "함께하는 창업팀" },
    { value: "—", suffix: "명", label: "커뮤니티 멤버" },
    { value: "—", suffix: "개", label: "파트너 기관" },
    { value: "—", suffix: "회", label: "운영 프로그램" },
    { value: "—", suffix: "명", label: "멘토·전문가 풀" },
  ],
} as const

export const programs = {
  eyebrow: "프로그램",
  title: "Programs",
  headline: "기술창업의 시작부터 성장까지 함께합니다",
  description:
    "KFTE는 청소년과 청년이 창업 아이디어를 발견하고, 팀을 만들고, 제품을 검증하며, 시장과 연결될 수 있도록 단계별 프로그램을 운영합니다.",
  items: [
    {
      title: "KFTE Tech Startup Club",
      category: "커뮤니티",
      description:
        "청소년·청년 기술창업가를 위한 정기 커뮤니티와 네트워킹 모임",
      cta: "행사 일정 보기",
      href: "/activities/events",
      image:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80",
    },
    {
      title: "Founder Mentoring",
      category: "멘토링",
      description:
        "아이디어 검증, MVP 개발, 사업화 전략을 위한 창업 멘토링",
      cta: "신청 일정 확인하기",
      href: "/activities/events",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80",
    },
    {
      title: "Youth Startup Lab",
      category: "실험형",
      description:
        "청소년 창업팀이 실제 문제를 발견하고 제품으로 구현하는 실험형 프로그램",
      cta: "행사 일정 보기",
      href: "/activities/events",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    },
    {
      title: "Creator & Tech Division",
      category: "분과",
      description:
        "크리에이터, 개발자, 창업가가 함께 프로젝트를 만들고 확장하는 분과 활동",
      cta: "분과 참여하기",
      href: "#divisions",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    },
    {
      title: "Policy & Ecosystem Forum",
      category: "포럼",
      description:
        "청소년·청년 창업 정책과 기술창업 생태계 개선을 위한 포럼·간담회",
      cta: "활동 보기",
      href: "#news",
      image:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80",
    },
  ],
} as const

export const divisions = {
  eyebrow: "조직",
  title: "Divisions",
  headline: "관심사와 단계에 따라 분과에서 함께 활동합니다",
  items: [
    {
      number: "01",
      title: "기술창업 분과",
      description:
        "기술 기반 제품·서비스를 만들고 있는 창업팀과 예비창업자를 위한 분과",
    },
    {
      number: "02",
      title: "크리에이터 분과",
      description:
        "콘텐츠, 커뮤니티, 미디어, IP 기반 창업을 실험하는 창작자 중심 분과",
    },
    {
      number: "03",
      title: "청소년창업 분과",
      description:
        "청소년 창업가의 안전한 도전, 교육, 멘토링, 네트워킹을 위한 분과",
    },
    {
      number: "04",
      title: "파트너십 분과",
      description:
        "기업, 기관, 전문가, 투자자와의 협력 프로젝트를 만드는 분과",
    },
  ],
} as const

export const manifesto = {
  eyebrow: "선언",
  title: "Manifesto",
  headline: "우리는 다음 세대 기술창업가의 가능성을 믿습니다",
  paragraphs: [
    "창업은 나이가 아니라 문제를 발견하는 태도에서 시작됩니다.",
    "기술은 일부 전문가만의 도구가 아니라, 더 나은 문제 해결을 원하는 모든 청년의 언어가 되어야 합니다.",
    "KFTE는 청소년과 청년이 더 일찍 시도하고, 더 깊게 배우고, 더 넓게 연결될 수 있는 환경을 만듭니다.",
  ],
  principles: [
    {
      title: "도전할 수 있는 생태계",
      description: "실패를 낙인찍지 않고, 시도를 축적합니다.",
    },
    {
      title: "연결되는 생태계",
      description: "창업가, 개발자, 크리에이터, 멘토, 기관을 연결합니다.",
    },
    {
      title: "성장하는 생태계",
      description: "아이디어가 제품이 되고, 제품이 사업이 되도록 돕습니다.",
    },
  ],
} as const

export const partners = {
  eyebrow: "함께하는 곳",
  title: "Partners",
  headline: "함께 만드는 기술창업 생태계",
  description:
    "KFTE는 학교, 기업, 공공기관, 투자자, 창업 커뮤니티와 함께 청소년·청년 기술창업의 기반을 넓혀갑니다.",
  types: [
    { label: "교육 협력", description: "창업교육, 기술교육, 워크숍 공동 운영" },
    { label: "행사 협력", description: "데모데이, 포럼, 네트워킹 행사 공동 개최" },
    { label: "멘토링 협력", description: "전문가·창업가 멘토 풀 참여" },
    { label: "후원 협력", description: "청소년·청년 창업 프로그램 후원" },
    { label: "공간 지원", description: "행사장, 회의실, 제작공간 제공" },
    { label: "미디어 협력", description: "활동 확산, 인터뷰, 콘텐츠 제작" },
  ],
  cta: "파트너십 문의하기",
} as const

export const news = {
  eyebrow: "소식 & 활동",
  title: "News / Activity",
  headline: "KFTE의 최근 활동",
  entries: [
    {
      date: "2026.06",
      title: "프로그램 모집 안내",
      summary: "2026년 하반기 KFTE 프로그램 모집 일정을 공지사항에서 확인하세요.",
      tag: "공지사항",
    },
    {
      date: "2026.05",
      title: "네트워킹 데이 후기",
      summary: "청년 창업가들이 모인 KFTE 네트워킹 데이 현장을 소개합니다.",
      tag: "행사 후기",
    },
    {
      date: "2025.12",
      title: "KFTE 활동 관련 보도",
      summary: "재단 활동과 생태계 확장에 관한 언론 보도 자료입니다.",
      tag: "언론보도",
    },
    {
      date: "2025.11",
      title: "청년 창업가 인터뷰",
      summary: "KFTE와 함께 성장한 청년 창업가의 이야기를 담았습니다.",
      tag: "인터뷰",
    },
  ],
} as const

export const faq = {
  eyebrow: "자주 묻는 질문",
  title: "FAQ",
  headline: "KFTE에 대해 자주 묻는 질문",
  items: [
    {
      question: "KFTE(한국기술창업진흥재단)는 어떤 단체인가요?",
      answer:
        "KFTE는 청소년과 청년이 기술로 창업에 도전할 수 있도록 교육·멘토링·네트워크·커뮤니티를 운영하는 민간 비영리 재단입니다. 서울특별시 강남구 테헤란로 128에 위치하며 고유번호 316-82-77638로 등록되어 있습니다.",
    },
    {
      question: "KFTE가 지원하는 대상은 누구인가요?",
      answer:
        "청소년 창업가, 대학생·청년 창업가, 초기 기술창업팀, 크리에이터·메이커, 그리고 다음 세대 창업가를 발굴하려는 파트너 기관·기업이 대상입니다.",
    },
    {
      question: "KFTE 프로그램에 어떻게 참여할 수 있나요?",
      answer:
        "최신 행사 및 프로그램 모집 일정은 '행사' 페이지에서 확인할 수 있습니다. 참여 문의는 이메일(yun@seongyong.com) 또는 전화(070-7954-8795)로 가능합니다.",
      href: "/activities/events",
      hrefLabel: "행사 페이지 보기",
    },
    {
      question: "KFTE 회원사 가입은 어떻게 하나요?",
      answer:
        "기업, 기관, 개인 등 다양한 형태로 파트너십에 참여할 수 있습니다. 자세한 가입 절차와 혜택은 '가입안내' 페이지에서 확인하세요.",
      href: "/members/join",
      hrefLabel: "가입안내 페이지 보기",
    },
    {
      question: "파트너십 또는 후원은 어떻게 문의하나요?",
      answer:
        "교육 협력, 행사 협력, 멘토링 협력, 후원 등 다양한 방식으로 함께할 수 있습니다. 이메일(yun@seongyong.com)로 문의해 주세요.",
    },
  ],
} as const

export const newsletter = {
  eyebrow: "Newsletter",
  title: "소식을 가장 먼저 받아보세요",
  description:
    "기술창업 프로그램, 커뮤니티 소식, 파트너십 기회를 이메일로 전해드립니다.",
  interests: [
    "청소년 창업",
    "기술창업",
    "크리에이터",
    "파트너십",
    "후원",
  ],
  cta: "뉴스레터 구독하기",
} as const

export const finalCta = {
  eyebrow: "함께하기",
  headline: "기술창업의 다음 세대를 함께 만들 사람을 찾습니다",
  description:
    "지금 KFTE와 연결되어 더 많은 청소년과 청년이 기술로 도전할 수 있는 기반을 함께 만들어 주세요.",
  primaryCta: "지금 KFTE와 연결되세요",
  actions: [
    { label: "창업가로 참여하기", href: "/activities/events" },
    { label: "파트너로 협력하기", href: "/about/partners" },
    { label: "후원 문의하기", href: "#contact" },
  ],
} as const

export const footer = {
  description:
    "청소년과 청년이 기술로 창업하고, 연결되고, 성장하도록 돕는 민간 중심 기술창업 생태계 재단입니다.",
  legal: [
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "이용약관", href: "/terms" },
  ],
  social: [
    { label: "Instagram", href: "https://www.instagram.com/kfte.official/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/kfte/" },
    { label: "YouTube", href: "https://www.youtube.com/@kfte.official" },
  ],
  organization: {
    title: "한국기술창업진흥재단",
    name: "한국기술창업진흥재단",
    chairman: "윤성용",
    registrationNumber: "316-82-77638",
    address: "서울특별시 강남구 테헤란로 128 2층 126호 (역삼동, 성곡빌딩)",
    tel: "070-7954-8795",
    fax: "050-8945-3639",
    email: "yun@seongyong.com",
    copyright: "2026 KFTE - All rights reserved.",
  },
} as const
