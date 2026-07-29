export const BRAND = {
  ko: "본립도생",
  hanja: "本立道生",
  en: "BONLIP DOSAENG",
  program: "BIZCOOL 2026",
  slogan: "바로 지금, 근본을 세울 차례.",
  theme: "바로 지금, 근본을 세우며 나아가는 Youth 창업가",
  serifLine: "root first, then the way",
  source: "『논어』 학이편 “본립이도생(本立而道生)”",
} as const

export type BonlipEvent = {
  id: string
  label: string
  name: string
  day: string
  weekday: string
  time: string
  place: string
  startPill: string
  note: string
}

export const EVENTS: readonly BonlipEvent[] = [
  {
    id: "hackathon",
    label: "HACKATHON",
    name: "비즈쿨 창업톤",
    day: "8.16",
    weekday: "SUN",
    time: "09:00 - 18:00",
    place: "대전컨벤션센터 중회의장 107·108호",
    startPill: "09:00 START",
    note: "하루 안에 문제 정의부터 실행까지. 팀으로 부딪히는 창업톤.",
  },
  {
    id: "conference",
    label: "CONFERENCE",
    name: "비즈쿨 컨퍼런스",
    day: "8.17",
    weekday: "MON",
    time: "13:00 - 21:00",
    place: "대전컨벤션센터 제1전시장 컨퍼런스홀(301호)",
    startPill: "13:00 START",
    note: "먼저 걸은 창업가와 연사가 한자리에. 밤 9시까지 이어지는 이야기.",
  },
] as const

export const TICKER_PHRASE = [
  "8.16 SUN",
  "창업톤",
  "8.17 MON",
  "컨퍼런스",
  BRAND.hanja,
  "DCC CONFERENCE HALL 301",
] as const

/** 本立道生 네 글자를 구조 장치로 사용 — 근본이 서면 길이 생긴다 */
export const PRINCIPLES = [
  {
    glyph: "本",
    reading: "근본",
    title: "무엇을 왜 하는지부터",
    desc: "아이디어보다 문제 정의가 먼저다. 창업의 뿌리를 확인하는 자리.",
    keyword: "root ✦",
  },
  {
    glyph: "立",
    reading: "세움",
    title: "하루 안에 세운다",
    desc: "창업톤에서 팀으로 문제를 붙잡고 실행까지 밀어붙인다.",
    keyword: "build ✦",
  },
  {
    glyph: "道",
    reading: "길",
    title: "먼저 걸은 사람들",
    desc: "컨퍼런스에서 연사·멘토·동료와 길을 잇는다.",
    keyword: "talks ✦",
  },
  {
    glyph: "生",
    reading: "생김",
    title: "다음이 생긴다",
    desc: "이틀 뒤에 남는 것: 팀, 네트워크, 그리고 다음 실행.",
    keyword: "next ✦",
  },
] as const

export type RundownRow = {
  time: string
  title: string
  note?: string
  pending?: boolean
}

export const RUNDOWN: readonly {
  day: string
  weekday: string
  name: string
  rows: readonly RundownRow[]
}[] = [
  {
    day: "8.16",
    weekday: "SUN",
    name: "비즈쿨 창업톤",
    rows: [
      { time: "09:00", title: "시작", note: "중회의장 107·108호" },
      { time: "18:00", title: "마무리" },
      { time: "TBA", title: "세부 타임테이블", note: "공개 예정", pending: true },
    ],
  },
  {
    day: "8.17",
    weekday: "MON",
    name: "비즈쿨 컨퍼런스",
    rows: [
      { time: "13:00", title: "시작", note: "컨퍼런스홀 301호" },
      { time: "21:00", title: "마무리" },
      { time: "TBA", title: "세부 타임테이블", note: "공개 예정", pending: true },
    ],
  },
] as const
