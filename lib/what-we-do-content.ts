import { impact, programs, whatWeDo } from "@/lib/kfte-content"

const pillarHighlights: Record<string, readonly string[]> = {
  "01": ["아이디어 워크숍", "MVP·사업화 기초", "팀빌딩 실습"],
  "02": ["정기 네트워킹", "분과·동아리 연계", "피어 피드백"],
  "03": ["1:1 멘토링", "IR·피칭 코칭", "전문가 매칭"],
  "04": ["MOU·파트너십", "데모데이·포럼", "정책 제안·간담회"],
}

export const whatWeDoPage = {
  pageTitle: "우리가 하는 일",
  hero: {
    eyebrow: whatWeDo.eyebrow,
    titleLight: "기술창업을",
    titleBold: "현실로 연결합니다",
    description: whatWeDo.description,
    chips: ["교육", "멘토링", "커뮤니티", "정책·포럼"],
  },
  flow: {
    eyebrow: "접근 방식",
    headline: "아이디어에서 생태계까지, 한 줄의 여정",
    steps: [
      {
        id: "discover",
        number: "01",
        label: "발견",
        description: "문제를 찾고, 기술로 풀 수 있는지 가늠합니다.",
      },
      {
        id: "validate",
        number: "02",
        label: "검증",
        description: "MVP·프로토타입으로 시장과 사용자 반응을 확인합니다.",
      },
      {
        id: "connect",
        number: "03",
        label: "연결",
        description: "멘토·동료·파트너와 네트워크를 만듭니다.",
      },
      {
        id: "grow",
        number: "04",
        label: "성장",
        description: "프로그램과 생태계 안에서 지속 가능하게 확장합니다.",
      },
    ],
  },
  pillars: whatWeDo.pillars.map((pillar) => ({
    ...pillar,
    highlights: pillarHighlights[pillar.number] ?? [],
  })),
  programs: {
    eyebrow: programs.eyebrow,
    headline: programs.headline,
    description: programs.description,
    items: programs.items.slice(0, 4),
  },
  journey: {
    eyebrow: "여정",
    headline: "창업가와 함께 걷는 KFTE의 길",
    milestones: [
      {
        year: "2024",
        title: "재단 설립·비전 수립",
        description: "청소년·청년 기술창업 생태계 허브로의 출발점을 마련했습니다.",
      },
      {
        year: "2025",
        title: "커뮤니티·멘토링 확장",
        description: "정기 모임, 멘토링, 실험형 랩 등 핵심 프로그램을 가동했습니다.",
      },
      {
        year: "2026",
        title: "생태계 연결 본격화",
        description: "학교·기업·기관과 협력하며 창업가 네트워크를 넓히고 있습니다.",
      },
    ],
  },
  ecosystem: {
    eyebrow: "생태계",
    headline: "함께 만드는 연결의 지도",
    description:
      "KFTE는 단독으로 모든 것을 해결하지 않습니다. 교육 현장, 창업팀, 전문가, 파트너가 서로를 만나도록 설계합니다.",
    nodes: [
      { label: "청소년·청년 창업가", role: "중심" },
      { label: "멘토·전문가", role: "지원" },
      { label: "학교·교육기관", role: "발굴" },
      { label: "기업·투자자", role: "연결" },
      { label: "정부·지자체", role: "정책" },
      { label: "KFTE", role: "허브" },
    ],
  },
  stats: impact.stats,
  cta: {
    headline: "다음 창업가는 바로 당신일 수 있습니다",
    description: "프로그램 참여, 회원 가입, 협력 제안 — KFTE와 연결되는 방법은 다양합니다.",
    // HIDDEN: 프로그램·회원사 CTA — 복구 시 주석 해제 (컴포넌트 버튼도 함께)
    // primary: { label: "프로그램 보기", href: "/activities/programs" },
    // secondary: { label: "회원 가입 안내", href: "/members/join" },
    primary: { label: "선언문 읽기", href: "/about/manifesto" },
    secondary: { label: "선언문 읽기", href: "/about/manifesto" },
    tertiary: { label: "선언문 읽기", href: "/about/manifesto" },
  },
} as const

export type WhatWeDoPillar = (typeof whatWeDoPage.pillars)[number]
