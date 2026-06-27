export type ManifestoStatement = {
  headline: string
  date: string
  summary: string
  pdfHref: string
  watermark: readonly [string, string, string]
  items: readonly { number: string; content: string }[]
}

export const manifestoPage = {
  pageTitle: "선언문",
  tabs: [{ id: "inaugural", label: "출범 선언문" }],
  defaultTabId: "inaugural",
  statements: {
    inaugural: {
      headline: "'기술로 미래를 열고, 창업으로 혁신을 짓다.'",
      date: "2026년 6월 27일 <KFTE 출범 선언> · 설립발기인 일동",
      summary:
        "오늘날 첨단 기술은 경제 성장과 고용 창출을 견인하는 핵심 동력이 되었습니다. 대한민국이 기술 강국을 넘어 글로벌 혁신 창업의 허브로 도약하기 위해, 우리는 독창적인 기술과 기업가 정신을 결합하여 새로운 경제적·사회적 가치를 창출하고자 한국기술창업진흥재단을 설립합니다.",
      pdfHref: "#",
      watermark: ["KFTE", "TECH", "STARTUP"] as const,
      items: [
        {
          number: "01",
          content:
            "인공지능, 바이오, 친환경 에너지 등 첨단 기술은 더 이상 먼 미래의 이야기가 아닙니다. 이제 그것은 우리 경제의 성장과 일자리 창출을 이끄는 핵심 동력입니다.",
        },
        {
          number: "02",
          content:
            "대한민국이 글로벌 혁신 창업의 허브로 도약하려면, 우수한 기술력을 가진 인재들이 실패를 두려워하지 않고 도전할 수 있는 탄탄한 토양이 반드시 필요합니다.",
        },
        {
          number: "03",
          content:
            "본 재단은 기술 기반 창업 생태계의 활성화와 지속 가능한 성장을 목표로, 다음의 사명을 실천합니다.",
        },
        {
          number: "04",
          content:
            "연구실과 산업 현장에 묻혀 있는 유망 기술을 발굴하고, 이를 성공적인 비즈니스로 연결하는 가교 역할을 수행합니다.",
        },
        {
          number: "05",
          content:
            "예비 창업자 발굴부터 초기 보육, 투자 유치, 글로벌 시장 진출에 이르기까지 창업 전 주기를 아우르는 체계적인 멘토링과 인프라를 제공합니다.",
        },
        {
          number: "06",
          content:
            "대학, 연구기관, 기업, 투자자 간의 벽을 허물고, 기술과 자본, 인재가 자유롭게 흐르는 개방형 혁신 생태계를 조성합니다.",
        },
        {
          number: "07",
          content:
            "우리가 지원하는 하나의 기술 기업은 미래 산업을 이끌 거대한 물줄기의 시작점입니다. 실패를 혁신의 자산으로 바꾸고, 도전하는 창업가가 세계 무대의 주역으로 설 수 있도록 든든한 동반자가 되겠습니다.",
        },
      ],
    },
  },
} satisfies {
  pageTitle: string
  tabs: readonly { id: string; label: string }[]
  defaultTabId: string
  statements: Record<string, ManifestoStatement>
}

export type ManifestoTabId = keyof typeof manifestoPage.statements

/*
 * ── 선언문 종류 추가 시 참고 ──
 * manifestoPage.tabs·statements에 아래 항목을 병합하고
 * manifesto-page-content.tsx의 탭 전환 로직 주석을 해제하세요.
 *
 * tabs: [
 *   { id: "5th", label: "5주년 선언문" },
 *   { id: "2nd", label: "2주년 선언문" },
 *   { id: "new-economy", label: "신경제 선언문" },
 *   { id: "inaugural", label: "출범 선언문" },
 * ],
 *
 * statements: {
 *   "5th": {
 *     headline: "'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'",
 *     date: "2026년 1월 <KFTE 5주년 선언> 중",
 *     summary:
 *       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
 *     pdfHref: "#",
 *     watermark: ["KFTE", "TECH", "STARTUP"] as const,
 *     items: [
 *       { number: "01", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
 *       { number: "02", content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
 *       { number: "03", content: "Duis aute irure dolor in reprehenderit in voluptate velit esse." },
 *       { number: "04", content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa." },
 *       { number: "05", content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem." },
 *       { number: "06", content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit." },
 *       { number: "07", content: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet." },
 *     ],
 *   },
 *   "2nd": {
 *     headline: "'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'",
 *     date: "2026년 1월 <KFTE 2주년 선언> 중",
 *     summary:
 *       "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
 *     pdfHref: "#",
 *     watermark: ["KFTE", "TECH", "STARTUP"] as const,
 *     items: [
 *       { number: "01", content: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse." },
 *       { number: "02", content: "At vero eos et accusamus et iusto odio dignissimos ducimus." },
 *       { number: "03", content: "Et harum quidem rerum facilis est et expedita distinctio." },
 *       { number: "04", content: "Nam libero tempore, cum soluta nobis est eligendi optio cumque." },
 *       { number: "05", content: "Temporibus autem quibusdam et aut officiis debitis aut rerum." },
 *       { number: "06", content: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis." },
 *       { number: "07", content: "Omnis voluptas assumenda est, omnis dolor repellendus." },
 *     ],
 *   },
 *   "new-economy": {
 *     headline: "'Ut labore et dolore magnam aliquam quaerat voluptatem.'",
 *     date: "2026년 1월 <KFTE 신경제 선언> 중",
 *     summary:
 *       "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
 *     pdfHref: "#",
 *     watermark: ["KFTE", "TECH", "STARTUP"] as const,
 *     items: [
 *       { number: "01", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod." },
 *       { number: "02", content: "Consectetur, adipisci velit, sed quia non numquam eius modi tempora." },
 *       { number: "03", content: "Incidunt ut labore et dolore magnam aliquam quaerat voluptatem." },
 *       { number: "04", content: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis." },
 *       { number: "05", content: "Suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur." },
 *       { number: "06", content: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam." },
 *       { number: "07", content: "Nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas." },
 *     ],
 *   },
 *   inaugural: { ... 위 inaugural 객체와 동일 ... },
 * },
 */
