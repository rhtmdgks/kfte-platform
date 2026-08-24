import chairpersonDraw from "@/assets/people/board/kfte_chairperson(draw).jpeg"
import { footer, site } from "@/lib/kfte-content"

export const aboutPage = {
  pageTitle: "소개",
  hero: {
    eyebrow: "About KFTE",
    titleLight: "청소년 및 청년 창업자가 주도하는",
    titleBold: "민간 중심 기술창업 생태계 구축",
    concept: site.concept,
    description:
      "KFTE 한국기술창업진흥재단은 기술로 문제를 해결하고\n창업에 도전하는 청소년·청년 창업가를 연결하고 지원하는 민간 중심 기술창업 생태계 재단입니다.",
    tagline: site.tagline.replace("\n", " "),
  },
  chairmanGreeting: {
    eyebrow: "이사장 인사말",
    name: site.chairman,
    role: "한국기술창업진흥재단 이사장",
    image: chairpersonDraw.src,
    imageAlt: "윤성용 이사장 일러스트",
    linkedin: "https://www.linkedin.com/in/creativeyun/?locale=ko",
    salutation: "존경하는 기술창업자 여러분!",
    opening: "안녕하십니까? KFTE 한국기술창업진흥재단 이사장 윤성용입니다.",
    body:
      "2025년 10월, 5개의 기술창업 스타트업을 시작으로 기술창업 분과, 크리에이터 분과, 청소년 분과의 설립회원을 모집하고 있습니다. 특히 개인적으로 운영하던 ‘사업하고 싶은 청소년 모임’ 및 ‘강남냉면모임’ 등 사업 모임 역시 KFTE로 이관할 예정입니다. KFTE는 청년 창업 정책의 당사자인 청소년 및 청년이 중심이 되어 기업가정신을 발휘하고 성공적인 기술창업을 할 수 있도록 함께 협력하는 민간 중심 기술창업 생태계 구축을 목표로 하고 있습니다. 기술창업을 하시는 분들, 크리에이터 활동을 하시는 분들, 창업을 이미 하고 있거나 예비창업 단계인 청소년 창업자 분들 모두 KFTE와 함께 협력하고 목소리를 내어 주시면 더욱 좋은 창업 생태계를 조성할 수 있습니다.",
    closing: [
      "존경하는 기술창업자 여러분,",
      "여러분들의 지속적인 관심과 지지가 필요합니다.",
      "또한 여러분들의 기술 창업 여정이 성공적으로 이어지길 기원합니다.",
      "감사합니다.",
    ],
    date: "2025년 11월 08일",
    signatureRole: "한국기술창업진흥재단 이사장",
    signatureName: "윤성용 드림",
  },
  identity: {
    eyebrow: "미션 · 비전 · 가치",
    headline: "우리가 지키는 방향",
    items: [
      {
        id: "mission",
        label: "Mission",
        title: "기술창업을 현실로",
        description:
          "청소년·청년이 아이디어를 발견하고, 검증하고, 시장과 연결할 수 있도록 실질적인 프로그램과 네트워크를 제공합니다.",
      },
      {
        id: "vision",
        label: "Vision",
        title: "Next Tech Founders Hub",
        description:
          "아시아를 대표하는 청년 기술창업 허브로, 누구나 도전할 수 있는 창업 문화를 확산합니다.",
      },
      {
        id: "values",
        label: "Values",
        title: "연결, 열림, 책임",
        description:
          "생태계를 연결하고, 문을 열어 두며, 청년 창업가와 지역·사회에 대한 책임 있는 임팩트를 추구합니다.",
      },
    ],
  },
  story: {
    eyebrow: "왜 KFTE인가",
    headline: "민간의 속도로, 공공의 신뢰로",
    pullQuote: "창업은 혼자 시작하지만, 혼자 끝나지 않습니다.",
    paragraphs: [
      {
        lead: "민간 중심 재단",
        text: "KFTE는 정부·학교·기업·투자자·창업가 사이의 빈틈을 메우는 민간 중심 재단입니다. 빠르게 실험하고, 현장의 목소리를 듣고, 필요한 연결을 만드는 것 — 그것이 우리의 역할입니다.",
      },
      {
        lead: "실제로 닿는 프로그램",
        text: "거창한 슬로건보다 실제로 닿는 프로그램, 화려한 행사보다 지속되는 커뮤니티를 지향합니다. 청소년·청년 창업가가 '할 수 있겠다'고 느끼는 순간, KFTE의 존재 이유가 완성됩니다.",
      },
    ],
  },
  facts: {
    eyebrow: "재단 정보",
    headline: "한눈에 보는 KFTE",
    items: [
      { label: "법인명", value: footer.organization.name },
      { label: "고유번호", value: site.registrationNumber },
      { label: "이사장", value: site.chairman },
      { label: "소재지", value: site.address },
      { label: "대표전화", value: site.phone },
      { label: "이메일", value: site.email },
    ],
  },
  explore: {
    eyebrow: "더 알아보기",
    headline: "KFTE를 구성하는 페이지들",
    links: [
      {
        title: "우리가 하는 일",
        description: "교육·멘토링·커뮤니티·생태계 협력",
        href: "/about/what-we-do",
      },
      {
        title: "선언문",
        description: "KFTE 출범과 설립 취지",
        href: "/about/manifesto",
      },
      {
        title: "정관",
        description: "재단 운영의 기본 규범",
        href: "/about/bylaws",
      },
      {
        title: "함께하는 사람들",
        description: "이사회·전문위원단·운영진",
        href: "/about/partners",
      },
      {
        title: "찾아오시는 길",
        description: "오시는 길과 연락처",
        href: "/about/location",
      },
      {
        title: "CI",
        description: "브랜드 아이덴티티",
        href: "/about/ci",
      },
    ],
  },
  cta: {
    headline: "KFTE와 함께 다음 장을 써 보세요",
    description: "회원 가입, 프로그램 참여, 협력 제안 — 어떤 방식이든 환영합니다.",
    primary: { label: "회원 가입 안내", href: "/members/join" },
    secondary: { label: "우리가 하는 일", href: "/about/what-we-do" },
  },
} as const

export type AboutIdentityItem = (typeof aboutPage.identity.items)[number]
