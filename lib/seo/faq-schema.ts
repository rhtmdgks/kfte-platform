const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kfte.kr'

export const homepageFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'KFTE(한국기술창업진흥재단)는 어떤 단체인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'KFTE(한국기술창업진흥재단)는 청소년과 청년이 기술로 창업에 도전할 수 있도록 교육·멘토링·네트워크·커뮤니티를 운영하는 민간 비영리 기술창업 생태계 재단입니다. 서울특별시 강남구 테헤란로 128에 위치하며 고유번호 316-82-77638로 등록되어 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: 'KFTE가 지원하는 대상은 누구인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'KFTE는 학교 안팎에서 기술과 창업을 실험하는 청소년 창업가, 아이디어 단계부터 초기 사업화까지 도전하는 대학생·청년 창업가, 개발·제품·투자 등 성장 과정의 기술창업팀, 기술과 콘텐츠를 결합하는 크리에이터·메이커, 그리고 다음 세대 창업가를 발굴하려는 파트너 기관·기업을 지원합니다.',
      },
    },
    {
      '@type': 'Question',
      name: 'KFTE의 주요 프로그램은 무엇인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'KFTE는 KFTE Tech Startup Club(청소년·청년 창업 정기 커뮤니티), Founder Mentoring(아이디어 검증·MVP·사업화 멘토링), Youth Startup Lab(청소년 창업팀 실험형 프로그램), Creator & Tech Division(크리에이터·개발자 분과 활동), Policy & Ecosystem Forum(창업 정책·생태계 포럼)을 운영합니다.',
      },
    },
    {
      '@type': 'Question',
      name: 'KFTE 프로그램 또는 행사에 어떻게 참여할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `KFTE의 최신 행사 및 프로그램 모집 일정은 ${siteUrl}/activities/events 에서 확인할 수 있습니다. 참여 문의는 이메일(yun@seongyong.com) 또는 전화(070-7954-8795)로 가능합니다.`,
      },
    },
    {
      '@type': 'Question',
      name: 'KFTE 회원사 가입 방법은 무엇인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `KFTE 회원사 가입 안내와 혜택은 ${siteUrl}/members/join 에서 확인할 수 있습니다. 기업, 기관, 개인 등 다양한 형태의 파트너십을 제안받습니다. 가입 문의는 이메일(yun@seongyong.com)로 하실 수 있습니다.`,
      },
    },
  ],
} as const
