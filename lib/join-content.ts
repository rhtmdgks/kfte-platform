export type JoinTabId = "categories" | "fees" | "faq"

export type JoinStep = {
  label: string
  complete?: boolean
}

export type MemberTier = {
  title: string
  description: string
  votingRights: string
  fee: string
}

export const joinPage = {
  pageTitle: "회원가입 안내",
  processTitle: "회원가입 절차",
  applyLabel: "회원가입 신청",
  applyHref: "/signup",
  steps: [
    { label: "온라인\n가입신청서 제출" },
    { label: "승인여부 검토" },
    { label: "승인안내\n(신청서 제출 후\n1-2주 소요)" },
    { label: "연회비 납부" },
    { label: "회원가입 완료", complete: true },
  ] satisfies readonly JoinStep[],
  tabs: [
    { id: "categories" as const, label: "회원구분" },
    { id: "fees" as const, label: "회비납부안내" },
    { id: "faq" as const, label: "가입 관련 질문(FAQ)" },
  ],
  defaultTabId: "categories" as JoinTabId,
  categories: {
    startupTitle: "스타트업 회원",
    startupCriteria: [
      "스타트업 법인 및 단체, 사업자등록을 한 개인사업자",
      "건강한 비즈니스 생태계 조성, 활성화에 동참하고자 하는 스타트업",
      "혁신적인 기술이나 아이디어를 통해 빠르게 성장하고 있는 스타트업",
      "창업 이후 엑싯 M&A, 상장 이전까지의 스타트업",
    ],
    tiers: [
      {
        title: "정회원",
        description:
          "총회 의결권이 있어 주요 사업계획을 의결합니다. KFTE 회원 혜택 대상으로, 회원 활동에 주도적으로 참여합니다.",
        votingRights: "총회 의결권 : 있음 (대의원제)",
        fee: "회비(연(월)) : 60(5)/120(10)/180(15)만원 이상 중 택1",
      },
      {
        title: "준회원",
        description:
          "KFTE의 출범 취지 및 활동에 동의하며, 정보를 습득합니다. 회원활동은 다소 제한적으로 참여 가능합니다.",
        votingRights: "총회 의결권 : 없음",
        fee: "회비 : 가입 시 최초 1회 20만원(가입비)",
      },
    ] satisfies readonly MemberTier[],
  },
  fees: {
    intro: [
      "KFTE의 활동은 회원 여러분의 소중한 회비로 운영되고 있습니다. 모든 예산은 청소년·청년 기술창업 지원과 생태계 활성화에 보탬이 될 수 있도록 투명하게 사용하겠습니다.",
      "연간 예·결산 보고는 연초 정기총회를 통해 확인하실 수 있습니다.",
      "정회원(일반회원)은 연간 또는 월간 단위로 회비를 납부합니다. 납부 금액에 따른 혜택 차등은 없으며, 현재 상황과 역량에 맞는 금액을 선택해 주시면 됩니다.",
      "스타트업 생태계 특성상 규모·단계·상황이 다양함을 고려한 구조이니, 부담을 느끼지 않으셔도 좋습니다. 회원 자격 변동이나 기타 문의는 문의함을 이용하거나 대표전화(070-7954-8795)로 연락해 주세요.",
    ],
    tableTitle: "회원별 연회비",
    tableHeaders: {
      category: "회원구분",
      amount: "연회비 금액",
    },
    tableRows: [
      { category: "정회원(이사)", amount: "1,200만원 이상" },
      { category: "정회원(운영위원)", amount: "600만원 이상" },
      {
        category: "정회원(일반회원) *",
        amount: "60(5), 120(10), 180(15)만원 이상 중 택 1 (연/월 구분)",
      },
      { category: "특별회원", amount: "1,000만원 이상" },
      { category: "후원회원", amount: "100만원 이상" },
      { category: "준회원", amount: "가입비 20만원" },
    ],
    tableNote:
      "* 정회원(일반회원) 연회비: 연 60만원(월 5만원) / 연 120만원(월 10만원) / 연 180만원(월 15만원) 이상 중 택1",
    payment: {
      title: "회비 납부 방법",
      methods: [
        {
          id: "bank",
          label: "은행 계좌 납부",
          bank: "광주은행",
          account: "1107-021-945098",
          holder: "한국기술창업진흥재단",
          note: "승인 안내를 받은 후 위 계좌로 입금해 주세요. 입금 확인 후 회원 자격이 최종 부여됩니다.",
        },
      ],
    },
  },
  faq: [
    {
      question: "가입 승인까지 얼마나 걸리나요?",
      answer:
        "온라인 가입신청서 제출 후 일반적으로 1~2주 내 승인 여부를 안내드립니다. 서류 보완이 필요한 경우 추가 시간이 소요될 수 있습니다.",
    },
    {
      question: "정회원과 준회원의 차이는 무엇인가요?",
      answer:
        "정회원은 총회 의결권을 보유하며 KFTE 회원 혜택을 전면적으로 이용할 수 있습니다. 준회원은 KFTE 활동에 동의하고 정보를 제공받되, 의결권은 없으며 활동 참여가 일부 제한됩니다.",
    },
    {
      question: "회비 납부 후 환불이 가능한가요?",
      answer:
        "회비 납부 및 환불 관련 세부 사항은 회원 약관 및 운영 규정에 따릅니다. 가입 전 안내 문서를 확인해 주세요.",
    },
  ],
} as const
