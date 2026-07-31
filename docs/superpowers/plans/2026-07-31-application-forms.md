# Application Forms Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Google Forms-like internal application forms with admin builder, public submit, event linking, and self-only admin password change.

**Architecture:** JSONB schema on `application_forms` + JSON answers on `application_form_responses`; public `/apply/[slug]`; event metadata `applicationFormId` syncs `external_url`.

**Tech Stack:** Next.js App Router, Supabase, shadcn, RHF/zod where useful, recharts for response summary.

## Global Constraints
- Primary `#002065`, Paperlogy
- No Google Sheets sync / collab / Form Timer

## Tasks
- [x] Spec + migration SQL
- [x] Types + lib parse/validate/queries
- [x] Admin actions + apply submit action
- [x] Admin password change (self only)
- [x] Admin form list/builder/responses UI
- [x] Public apply UI with section branching
- [x] Event edit form picker
- [ ] Apply DB migration on Supabase (MCP timeout — run SQL manually)
