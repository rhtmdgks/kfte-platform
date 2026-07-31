/**
 * 기존 event / event_archive 삭제 후 비즈쿨 컨퍼런스만 upsert
 * (기존 행사 상세 페이지 양식 — /activities/events/[slug])
 * node scripts/reset-events-bizcool.mjs
 */
import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@supabase/supabase-js"

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnvFile() {
  try {
    const envPath = resolve(__dirname, "../.env.local")
    const content = readFileSync(envPath, "utf8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eq = trimmed.indexOf("=")
      if (eq === -1) continue
      const key = trimmed.slice(0, eq)
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // ignore
  }
}

loadEnvFile()

const body = `본립도생(本立道生) — 『논어』 학이편 ‘본립이도생(本立而道生)’에서 유래. 근본이 서면 길이 생긴다는 뜻.

2026학년도 비즈쿨 본립도생 프로젝트의 비즈쿨 컨퍼런스에 전국 청소년·청년 창업가와 정부·창업 유관기관 관계자를 모집합니다.

■ 참가 주제
바로 지금, 근본을 세우며 나아가는 Youth 창업가

■ 주최
중소벤처기업부, 창업진흥원

■ 주관
대전대신고등학교, 천안제일고등학교, 한국기술창업진흥재단(KFTE)

■ 모집 규모
전국 청소년·청년 창업가 및 정부·창업 유관기관 관계자 250명 내외

■ 모집 방법
- KFTE 홈페이지 신청 폼을 통한 온라인 참가 신청
- 이벤터스(Event-Us) 플랫폼을 통한 온라인 참가 신청
- 당일 현장 등록 (정원이 모두 찬 경우 진행하지 않음)

■ 프로그램 하이라이트
1) 인사이트 세션
대전 향토기업 선양소주 조웅래 회장 등 선배 창업가의 사례와 인사이트를 듣습니다.
(골프존 홀딩스 김영찬 회장 초청 예정 — TODO_CONFIRM)

2) 본선 발표·청중 평가
비즈쿨 창업톤 본선 8팀의 아이디어 발표를 보고, 현장 청중 평가에 참여합니다.
심사 비율: 외부 심사위원 60% · 현장 청중 평가 40%
시상: 고득점순 3팀 (별도의 수상금은 없음)

3) 네트워킹 파티
전국 청소년·청년 창업가, 정부·창업 유관기관과 자율 네트워킹(다과·케이터링)

■ 컨퍼런스 일정 (안)
12:30–13:00  등록
13:00–13:30  개회 (이사장 인사말, 심사위원 소개, 프로그램 안내)
13:30–14:00  연사 1 — 선양소주 조웅래 회장
14:00–14:10  휴식
14:10–14:40  연사 2 — TODO_CONFIRM
14:40–14:50  휴식
14:50–15:50  본선 발표 1–4팀 (팀당 10분 발표, 3분 질의응답)
15:50–16:00  휴식
16:00–17:00  본선 발표 5–8팀
17:00–17:20  휴식 및 청중 투표 (KFTE 전자 투표)
17:20–17:50  연사 3 · 심사 집계 — Tapple 강성모 대표
17:50–18:10  시상 및 단체사진
18:10–18:30  만족도 조사·해산
18:30–20:30  네트워킹 파티
20:30–21:00  귀가 (DCC 21:30 폐쇄)

※ 프로그램 세부 내용·연사 구성은 변동될 수 있습니다.

■ 같은 날 운영: 비즈쿨 창업톤
대전·충남 중·고등학생 창업팀 15팀 내외가 오전에 강의·멘토링·예선을 진행하고, 본선 8팀이 컨퍼런스 무대에서 발표합니다.
창업톤 모집 마감: 2026. 08. 10.(월) 17:00

■ 참가 문의
이메일: yun@seongyong.com
전화: 070-7954-8795
(온라인 신청 폼 URL — TODO_CONFIRM: Event-Us / KFTE Form)`

const post = {
  slug: "bizcool-conference",
  title: "2026 비즈쿨 컨퍼런스 참가 모집",
  summary:
    "전국 청소년·청년 창업가와 정부·창업 유관기관 관계자가 모이는 비즈쿨 컨퍼런스. 인사이트 세션, 본선 발표·청중 평가, 네트워킹 파티.",
  content: body,
  eventDate: "2026-08-17T13:00:00+09:00",
  eventEndDate: "2026-08-17T21:00:00+09:00",
  registrationStart: "2026-07-31T00:00:00+09:00",
  registrationEnd: "2026-08-16T21:00:00+09:00",
  registrationUrl: "mailto:yun@seongyong.com",
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: deleted, error: deleteError } = await supabase
    .from("content_posts")
    .delete()
    .in("content_type", ["event", "event_archive"])
    .select("slug, content_type")

  if (deleteError) {
    console.error("Delete failed:", deleteError.message)
    process.exit(1)
  }

  console.log(`Deleted ${deleted?.length ?? 0} event/archive posts`)

  const { data: profile } = await supabase.from("profiles").select("id").limit(1).maybeSingle()
  const authorId = profile?.id ?? null

  const { error } = await supabase.from("content_posts").upsert(
    {
      title: post.title,
      slug: post.slug,
      content_type: "event",
      summary: post.summary,
      body: post.content,
      status: "published",
      published_at: post.eventDate,
      created_at: post.eventDate,
      author_id: authorId,
      is_pinned: true,
      external_url: post.registrationUrl,
      thumbnail_url: "/events/bizcool-conference.jpg",
      metadata: {
        category: "포럼",
        views: 0,
        eventDate: post.eventDate,
        eventEndDate: post.eventEndDate,
        location: "대전컨벤션센터(DCC) 제1전시장 컨퍼런스홀(301호)",
        locationDetail: "대전컨벤션센터(DCC) 제1전시장 컨퍼런스홀(301호)",
        cost: "무료",
        registrationStart: post.registrationStart,
        registrationEnd: post.registrationEnd,
        subcategory: "비즈쿨",
        featured: true,
      },
    },
    { onConflict: "content_type,slug" },
  )

  if (error) {
    console.error("Upsert failed:", error.message)
    process.exit(1)
  }
  console.log("Upserted event:", post.slug)
  console.log("Public URL: /activities/events/bizcool-conference")
}

main()
