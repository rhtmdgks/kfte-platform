/**
 * Poll results self-check script
 * Usage: node scripts/verify-poll-results.mjs <pollId>
 *
 * Inserts a few test votes then asserts get_poll_results counts match.
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { resolve } from "path"

function parseEnv(text) {
  const out = {}
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.trimStart().startsWith("#")) continue
    const i = line.indexOf("=")
    if (i < 0) continue
    let k = line.slice(0, i).trim()
    let v = line.slice(i + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    out[k] = v
  }
  return out
}

const envPath = resolve(process.cwd(), ".env.local")
const env = parseEnv(readFileSync(envPath, "utf8"))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const pollId = process.argv[2]
if (!pollId) {
  console.error("Usage: node scripts/verify-poll-results.mjs <pollId>")
  process.exit(1)
}

// Fetch poll
const { data: poll, error: pollErr } = await supabase
  .from("polls")
  .select("id, title, questions, status")
  .eq("id", pollId)
  .single()

if (pollErr || !poll) {
  console.error("Poll not found:", pollErr?.message)
  process.exit(1)
}

console.log(`\nPoll: "${poll.title}" [${poll.status}]`)
const questions = Array.isArray(poll.questions) ? poll.questions : []
if (questions.length === 0) {
  console.error("Poll has no questions.")
  process.exit(1)
}

// Delete existing test votes (those with token starting with "test-")
await supabase.from("poll_votes").delete().eq("poll_id", pollId).like("voter_token", "test-%")

// Insert 3 test votes
const tokens = ["test-a", "test-b", "test-c"]
const q0 = questions[0]
const opts = q0.options ?? []
if (opts.length < 2) {
  console.error("First question needs at least 2 options.")
  process.exit(1)
}

const insertPayload = [
  { poll_id: pollId, voter_token: tokens[0], answers: { [q0.id]: [opts[0].id] } },
  { poll_id: pollId, voter_token: tokens[1], answers: { [q0.id]: [opts[0].id] } },
  { poll_id: pollId, voter_token: tokens[2], answers: { [q0.id]: [opts[1].id] } },
]

const { error: insertErr } = await supabase.from("poll_votes").insert(insertPayload)
if (insertErr) {
  console.error("Insert failed:", insertErr.message)
  process.exit(1)
}
console.log("Inserted 3 test votes.")

// Call RPC
const { data: rpcResult, error: rpcErr } = await supabase.rpc("get_poll_results", {
  p_poll_id: pollId,
})
if (rpcErr || !rpcResult) {
  console.error("RPC failed:", rpcErr?.message)
  process.exit(1)
}

const qResult = rpcResult.questions?.find((r) => r.questionId === q0.id)
const countOpt0 = qResult?.optionCounts?.[opts[0].id] ?? 0
const countOpt1 = qResult?.optionCounts?.[opts[1].id] ?? 0

let pass = true
function assert(label, actual, expected) {
  const ok = actual === expected
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}: expected=${expected}, actual=${actual}`)
  if (!ok) pass = false
}

console.log("\nAsserting results:")
assert(`totalVoters >= 3`, rpcResult.totalVoters >= 3, true)
assert(`${opts[0].label} count`, countOpt0 >= 2, true)
assert(`${opts[1].label} count`, countOpt1 >= 1, true)

// Clean up
await supabase.from("poll_votes").delete().eq("poll_id", pollId).like("voter_token", "test-%")
console.log("\nCleaned up test votes.")

if (pass) {
  console.log("\n✅ All assertions passed.")
} else {
  console.error("\n❌ Some assertions failed.")
  process.exit(1)
}
