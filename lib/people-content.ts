import chairpersonSeongyong from "@/assets/people/board/kfte_chairperson(seongyong).jpeg"
import directorChaeho from "@/assets/people/board/kfte_director(chaeho).png"
import directorSeunghan from "@/assets/people/board/kfte_director(seunghan).jpg"
import directorYeonho from "@/assets/people/board/kfte_director(yeonho).jpeg"

export type TeamMember = {
  name: string
  role: string
  image: string
  linkedin?: string
}

export type ListMember = {
  name: string
  title: string
}

export type ProfilePeopleSection = {
  type: "profile"
  id: string
  title: string
  members: readonly TeamMember[]
}

export type ListPeopleSection = {
  type: "list"
  id: string
  title: string
  columns: readonly (readonly ListMember[])[]
}

export type PeopleSection = ProfilePeopleSection | ListPeopleSection

export const peoplePage = {
  pageTitleLight: "함께하는",
  pageTitleBold: "사람들",
  description:
    "청소년·청년 기술창업 생태계의 발전이 대한민국의 미래를 더 밝게 만들 거라고 믿는 사람들이 모였습니다.",
  sections: [
    {
      type: "profile",
      id: "board",
      title: "이사회",
      members: [
        {
          name: "윤성용",
          role: "이사장",
          image: chairpersonSeongyong.src,
          linkedin: "https://www.linkedin.com/in/creativeyun/?locale=ko",
        },
        {
          name: "고승한",
          role: "상임이사",
          image: directorSeunghan.src,
          linkedin: "https://www.linkedin.com/in/edmond104",
        },
        {
          name: "정연호",
          role: "상임이사",
          image: directorYeonho.src,
          linkedin:
            "https://www.linkedin.com/in/%EC%97%B0%ED%98%B8-%EC%A0%95-650bb426b/",
        },
        {
          name: "손채호",
          role: "상임이사",
          image: directorChaeho.src,
          linkedin: "https://www.linkedin.com/in/chaehoson/",
        },
      ],
    },
    {
      type: "list",
      id: "experts",
      title: "전문위원단",
      columns: [
        [
          { name: "박서혁", title: "전문위원(사이버보안)" },
          { name: "김우솔", title: "전문위원(청소년창업)" },
        ],
        [
          { name: "이윤제", title: "전문위원(청소년창업)" },
          { name: "우재민", title: "전문위원(뉴미디어)" },
        ],
        [
          { name: "박소윤", title: "전문위원(뉴미디어)" },
          { name: "아감잣싱", title: "전문위원(글로벌)" },
        ],
      ],
    },
  ],
} as const satisfies {
  pageTitleLight: string
  pageTitleBold: string
  description: string
  sections: readonly PeopleSection[]
}
