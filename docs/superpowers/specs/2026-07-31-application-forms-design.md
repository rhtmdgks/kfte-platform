# KFTE 내부 신청 폼 (Google Forms급) 설계

## Goal
백오피스에서 Google Forms와 동등한 신청 폼을 제작·수정하고, 공개 URL로 제출받으며, 행사 수정에서 내부 폼을 선택·생성한다. 관리자는 본인 비밀번호만 변경할 수 있다.

## Architecture
- `application_forms.schema` / `settings` JSONB 단일 문서 모델
- `application_form_responses.answers` JSONB
- 공개 경로 `/apply/[slug]`
- 행사: `metadata.applicationFormId` + `external_url` = `/apply/{slug}`
- 파일: Storage 버킷 `form-uploads`

## In scope
11 질문 유형, 섹션, 필수, Other, 분기(객관식·드롭다운), 진행률, 확인 메시지, 이메일 수집, 응답 수정 토큰, 퀴즈 점수, 응답 목록·요약·CSV, 행사 연동, 본인 비밀번호 변경

## Out of scope
Google Sheets 실시간 연동, 협업 동시편집, Form Timer, 테마 커스터마이저

## UI
KFTE primary `#002065`, Paperlogy. Admin은 기존 shadcn 패턴. 공개 폼은 라벨·인라인 에러·제출 피드백.
