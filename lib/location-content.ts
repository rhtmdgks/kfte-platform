import { footer } from "@/lib/kfte-content"

export const locationPage = {
  pageTitle: "찾아오시는 길",
  phone: "070-7954-8795",
  address: {
    lines: [
      "서울특별시 강남구 테헤란로 128 2층 126호 (역삼동, 성곡빌딩)",
      "한국기술창업진흥재단(KFTE)",
    ],
    visitNote: "* 방문 전 담당자에게 연락 바랍니다.",
  },
  subway: "2호선 강남역 1번출구 6분 거리",
  bus: "역삼역 정류장, 강남역 정류장",
  social: footer.social,
  map: {
    searchAddress: "서울특별시 강남구 테헤란로 128",
    markerTitle: "한국기술창업진흥재단(KFTE)",
    zoom: 16,
    lat: 37.501022,
    lng: 127.036698,
  },
} as const
