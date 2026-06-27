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
      headline: "'청소년과 청년의 기술창업을 현실로 연결합니다.'",
      date: "2026년 1월 <KFTE 출범 선언> 중",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. KFTE는 대한민국의 미래를 위해 중단없이 나아가겠습니다.",
      pdfHref: "#",
      watermark: ["KFTE", "TECH", "STARTUP"] as const,
      items: [
        {
          number: "01",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        },
        {
          number: "02",
          content:
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        },
        {
          number: "03",
          content:
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
        },
        {
          number: "04",
          content:
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
        },
        {
          number: "05",
          content:
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
        },
        {
          number: "06",
          content:
            "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
        },
        {
          number: "07",
          content:
            "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur.",
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
