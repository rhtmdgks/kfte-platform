export type BylawsArticle = {
  id: string
  label: string
  title: string
  paragraphs?: readonly string[]
  items?: readonly string[]
  clauses?: readonly { label: string; text: string }[]
}

export type BylawsChapter = {
  id: string
  number: string
  title: string
  articles: readonly BylawsArticle[]
}

export const bylawsPage = {
  pageTitle: "정관",
  tabs: [{ id: "standard", label: "표준정관" }],
  defaultTabId: "standard",
  document: {
    headline: "한국기술창업진흥재단 정관",
    subtitle: "Korea Foundation for the Promotion of Technology Entrepreneurship",
    date: "2025년 8월 25일 제정 · 설립자 전원 기명날인",
    summary:
      "한국기술창업진흥재단(KFTE)의 설립 목적, 조직, 회원·임원, 이사회·총회, 사무국, 회계 및 재정, 보칙 등 재단 운영의 기본 규범을 담은 표준정관입니다.",
    pdfHref: "/documents/kfte-bylaws.pdf",
    watermark: ["定", "款", "KFTE"] as const,
    enactment:
      "위 비영리단체 '한국기술창업진흥재단'을 설립하기 위하여 이 정관을 작성하고 설립자 전원이 이에 기명날인한다.",
    effectiveDate: "2025년 8월 25일",
  },
  chapters: [
    {
      id: "chapter-1",
      number: "01",
      title: "제1장 총칙",
      articles: [
        {
          id: "art-1",
          label: "제 1 조",
          title: "상호",
          paragraphs: [
            "이 단체의 법인명 국문은 '한국기술창업진흥재단'이라 한다. 영문으로는 'Korea Foundation for the Promotion of Technology Entrepreneurship'라 한다. 영문 약칭은 'KFTE'로 한다.",
          ],
        },
        {
          id: "art-2",
          label: "제 2 조",
          title: "목적",
          paragraphs: [
            "이 단체는 청소년 및 대학생의 혁신적인 기술창업을 육성하고 지원함으로써, 미래 산업을 이끌어갈 인재를 양성하고 새로운 성장 동력을 창출하여 국가 경제 발전에 이바지함을 목적으로 한다.",
          ],
        },
        {
          id: "art-3",
          label: "제 3 조",
          title: "사업",
          paragraphs: ["이 단체는 제 2 조의 목적을 달성하기 위하여 다음 각 호의 사업을 수행한다."],
          items: [
            "경영 컨설팅업",
            "공공관계 서비스업",
            "컴퓨터 시스템 통합 자문 및 구축 서비스업",
            "응용 소프트웨어 개발 및 공급업",
            "일반 서적 출판업",
            "미디어콘텐츠창작업",
            "시각 디자인업",
            "비거주용 건물 임대업",
            "비거주용 건물 전대업",
            "전자상거래 소매업",
            "광고업 및 광고대행업",
            "온라인 광고업 및 온라인 광고대행업",
            "데이터베이스 및 온라인 정보 제공업",
            "그 외 기타 금융 지원 서비스업",
            "포털 및 기타 인터넷 정보 매개 서비스업",
            "호스팅 및 관련 서비스업",
            "위 각 호에 관련된 통신판매업 및 전자상거래업",
            "위 각 호에 관련된 부대사업 일체",
          ],
        },
        {
          id: "art-4",
          label: "제 4 조",
          title: "본점 및 지점의 소재지",
          clauses: [
            { label: "①", text: "단체는 본점을 서울특별시에 둔다." },
            {
              label: "②",
              text: "단체는 필요에 따라 이사회의 결의로 국내외에 지점, 출장소, 사무소와 현지법인을 둘 수 있다.",
            },
          ],
        },
        {
          id: "art-5",
          label: "제 5 조",
          title: "공고 방법",
          paragraphs: [
            "단체의 공고는 단체의 인터넷 홈페이지(www.kfte.kr)에 게재한다. 다만, 전산장애 또는 그 밖의 부득이한 사유로 회사의 인터넷 홈페이지에 공고를 할 수 없는 경우 서울특별시 내에서 발행되는 일간 아시아경제에 게재한다.",
          ],
        },
      ],
    },
    {
      id: "chapter-2",
      number: "02",
      title: "제2장 회원",
      articles: [
        {
          id: "art-6",
          label: "제 5 조",
          title: "회원의 자격",
          paragraphs: [
            "이 단체의 회원은 설립취지에 동의하고 소정의 가입신청서를 제출하여 이사회(또는 운영위원회)의 승인을 얻은 자로 한다.",
          ],
        },
        {
          id: "art-7",
          label: "제 6 조",
          title: "회원의 권리와 의무",
          clauses: [
            { label: "①", text: "회원은 총회를 통하여 이 단체의 운영에 참여할 권리를 가진다." },
            {
              label: "②",
              text: "회원은 본회의 정관, 규정 및 각종 회의의 의결사항을 준수하고 회비 및 제 부담금을 납부할 의무를 진다.",
            },
          ],
        },
        {
          id: "art-8",
          label: "제 7 조",
          title: "회원의 탈퇴 및 제명",
          clauses: [
            { label: "①", text: "회원은 본인의 의사에 따라 자유롭게 탈퇴할 수 있다." },
            {
              label: "②",
              text: "회원이 다음 각호의 사유에 해당될 경우에는 이사회의 의결을 거쳐 제명할 수 있다.",
            },
          ],
          items: [
            "본회의 명예를 손상시키고 목적수행에 지장을 초래한 경우",
            "1년 이상 회원의 의무를 준수하지 않는 자",
          ],
        },
      ],
    },
    {
      id: "chapter-3",
      number: "03",
      title: "제3장 임원",
      articles: [
        {
          id: "art-9",
          label: "제 8 조",
          title: "임원의 구성",
          paragraphs: ["이 단체는 다음의 임원을 둔다."],
          clauses: [
            {
              label: "①",
              text: "이사장 1인 이상 3인 이하, 이사장을 포함한 이사 3인 이상 500인 이하, 운영위원 2인 이상 500인 이하, 감사 1인 이상을 둔다.",
            },
          ],
        },
        {
          id: "art-10",
          label: "제 9 조",
          title: "임원의 선임",
          clauses: [
            { label: "①", text: "이사장, 이사, 운영위원, 감사는 제 17조의 방법에 의하여 총회에서 선출한다." },
            { label: "②", text: "임원의 보선은 결원이 발생한 날로부터 2개월 이내로 하여야 한다." },
          ],
        },
        {
          id: "art-11",
          label: "제 10 조",
          title: "임원의 해임",
          paragraphs: ["임원이 다음 각호에 해당하는 행위를 한 때에는 총회의 의결로 해임할 수 있다."],
          items: [
            "이 단체의 목적에 위배되는 행위",
            "임원간 분쟁 · 회계부정 또는 현저한 부당행위",
            "이 단체의 업무를 방해하는 행위",
          ],
        },
        {
          id: "art-12",
          label: "제 11 조",
          title: "임원의 임기",
          clauses: [
            { label: "①", text: "임원의 임기는 3년으로 하고 중임할 수 있다." },
            { label: "②", text: "보선에 의하여 선임된 임원의 임기는 전임자의 잔여기간으로 한다." },
          ],
        },
        {
          id: "art-13",
          label: "제 12 조",
          title: "임원의 직무",
          clauses: [
            {
              label: "①",
              text: "이사장은 이 단체를 대표하고 업무를 통할하며 총회 및 이사회의 의장이 된다. 이사장 유고시에는 미리 이사회가 정한 순으로 그 직무를 대행한다.",
            },
            {
              label: "②",
              text: "이사는 이사회를 통하여 이 단체의 주요 사항을 심의, 의결하며 이사회 또는 이사장으로부터 위임 받은 사항을 처리한다.",
            },
            {
              label: "③",
              text: "감사는 일반회계 및 운영에 대해 감사하며 부정 또는 부당한 점이 있을 경우 이사회에 시정을 요구하고 그 보고를 위하여 이사회 또는 총회의 소집을 요구할 수 있다.",
            },
          ],
        },
      ],
    },
    {
      id: "chapter-4",
      number: "04",
      title: "제4장 이사회 및 총회",
      articles: [
        {
          id: "art-14",
          label: "제 13 조",
          title: "이사회의 구성",
          clauses: [
            { label: "①", text: "이사장과 이사로 구성한다." },
            { label: "②", text: "운영위원 및 감사는 이사회에 참석하여 발언할 수 있다." },
          ],
        },
        {
          id: "art-15",
          label: "제 14 조",
          title: "이사회의 소집",
          clauses: [
            { label: "①", text: "이사회는 정기이사회 및 임시이사회로 구분하며 이사장이 소집한다." },
            {
              label: "②",
              text: "정기이사회는 매월 1회 소집하며 임시이사회는 이사장, 감사 또는 재적이사 1/3 이상의 서면 요청이 있을 때 소집한다.",
            },
          ],
        },
        {
          id: "art-16",
          label: "제 15 조",
          title: "의결정족수",
          paragraphs: [
            "이사회는 재적이사 과반수의 출석으로 개의하고 출석이사 과반수의 찬성으로 의결한다.",
          ],
        },
        {
          id: "art-17",
          label: "제 16 조",
          title: "총회",
          clauses: [
            {
              label: "①",
              text: "총회는 최고 의결기관으로 전 회원으로 구성하며 정기총회와 임시총회가 있고 이사장이 소집한다.",
            },
            {
              label: "②",
              text: "정기총회는 매년 1회 회계연도 종료 후 1개월 이내에 소집하며 임시총회는 이사장 또는 감사 및 재적회원 1/3 이상의 서면 요청이 있을 때 소집한다.",
            },
            {
              label: "③",
              text: "이사장은 총회의 안건, 일시, 장소 등을 명기하여 회일 7일전까지 서면 통지하여야 한다.",
            },
          ],
        },
        {
          id: "art-18",
          label: "제 17 조",
          title: "의결정족수",
          clauses: [
            { label: "①", text: "재적 회원 과반수의 출석으로 개회되며 출석회원 과반수의 찬성으로 의결한다." },
            {
              label: "②",
              text: "총회 의결권은 참석하는 다른 회원에게 서면으로 위임할 수 있다. 이 경우 위임장은 총회전까지 의장에게 제출하여야 한다.",
            },
          ],
        },
        {
          id: "art-19",
          label: "제 18 조",
          title: "총회의 의결사항",
          paragraphs: ["총회는 다음 사항을 심의, 의결한다."],
          items: [
            "임원의 선출과 해임",
            "단체의 해산 및 정관 변경에 관한 사항",
            "기본재산의 취득, 처분 및 자금 차입에 관한 사항",
            "예산 및 결산의 승인",
            "사업계획의 승인",
            "기타 중요사항",
          ],
        },
        {
          id: "art-20",
          label: "제 19 조",
          title: "회의록",
          paragraphs: [
            "이사회 및 총회의 의사 진행 경과와 결과는 회의록으로 작성해야 하며 의장과 참여 임원이 기명 날인한다.",
          ],
        },
      ],
    },
    {
      id: "chapter-5",
      number: "05",
      title: "제5장 사무국",
      articles: [
        {
          id: "art-21",
          label: "제 20 조",
          title: "종사자의 구성 및 임면",
          clauses: [
            {
              label: "①",
              text: "이 단체의 업무를 효율적으로 집행하기 위하여 사무국을 두며 필요한 조직의 각 부서는 이사회 결의로 정한다.",
            },
            {
              label: "②",
              text: "종사자의 임면에 관하여는 이사회 결의로 별도의 인사규정을 두어 정한다.",
            },
          ],
        },
      ],
    },
    {
      id: "chapter-6",
      number: "06",
      title: "제6장 회계 및 재정",
      articles: [
        {
          id: "art-22",
          label: "제 21 조",
          title: "재산의 구분",
          paragraphs: ["이 단체의 재산은 기본재산과 보통재산으로 구분한다."],
          items: [
            "기본재산은 이 단체 설립 당시 기본재산으로 출연한 재산과 이사회에서 기본재산으로 편입할 것을 의결할 재산으로 한다.",
            "보통재산은 그 이외의 재산으로 한다.",
          ],
        },
        {
          id: "art-23",
          label: "제 22 조",
          title: "수입금",
          paragraphs: [
            "이 단체의 수입금은 회원의 회비, 수익사업으로 취득한 수익금, 후원금 및 기타의 수입으로 한다.",
          ],
        },
        {
          id: "art-24",
          label: "제 23 조",
          title: "출자 및 융자",
          paragraphs: [
            "이 단체의 목적사업을 위해 총회 결의로 외부단체의 출자나 융자를 받을 수 있다.",
          ],
        },
        {
          id: "art-25",
          label: "제 24 조",
          title: "회계연도 및 보고",
          clauses: [
            { label: "①", text: "회계연도는 정부의 회계연도에 준한다." },
            {
              label: "②",
              text: "감사는 회계연도 종료 후 1개월 이내에 전년도 사업실적서 및 수지결산서를 작성하여 이사회 의결을 거쳐 총회에 보고한다.",
            },
          ],
        },
      ],
    },
    {
      id: "chapter-7",
      number: "07",
      title: "제7장 보칙",
      articles: [
        {
          id: "art-26",
          label: "제 25 조",
          title: "정관변경",
          paragraphs: [
            "이 단체의 정관을 변경하고자 할 때에는 총회에서 재적회원 3분의 2 이상의 찬성으로 의결한다.",
          ],
        },
        {
          id: "art-27",
          label: "제 26 조",
          title: "해산 및 합병",
          paragraphs: [
            "이 단체를 해산하거나 합병하고자 할 때에는 총회에서 재적회원 4분의 3 이상의 찬성으로 의결한다.",
          ],
        },
        {
          id: "art-28",
          label: "제 27 조",
          title: "잔여재산의 귀속",
          paragraphs: [
            "이 단체를 해산하는 경우 잔여재산은 다른 비영리단체 또는 공익적 기금에 기부한다.",
          ],
        },
        {
          id: "art-29",
          label: "제 28 조",
          title: "운영규정",
          paragraphs: [
            "이 정관 규정 이외에 이 단체의 운영에 필요한 사항은 이사회 의결로 별도의 규정을 두어 정한다.",
          ],
        },
      ],
    },
  ] as const satisfies readonly BylawsChapter[],
  supplementary: {
    title: "부칙",
    articles: [
      {
        id: "sup-1",
        label: "제 1 조",
        title: "시행일",
        paragraphs: ["이 정관은 2025.08.25부터 시행한다."],
      },
    ],
  },
} as const

export type BylawsTabId = (typeof bylawsPage.tabs)[number]["id"]
