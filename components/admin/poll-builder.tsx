"use client"

import { useRef, useState, useTransition } from "react"
import { QRCodeSVG } from "qrcode.react"
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  GripVertical,
  Loader2,
  Plus,
  Radio,
  Trash2,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updatePoll, deletePoll, setPollStatus } from "@/app/admin/polls/actions"
import { publicPollPath, type PollQuestion, type PollQuestions } from "@/lib/polls/types"
import { cn } from "@/lib/utils"
import Link from "next/link"

type PollStatus = "draft" | "open" | "closed"

type Props = {
  id: string
  initialTitle: string
  initialSlug: string
  initialDescription: string
  initialStatus: PollStatus
  initialQuestions: PollQuestions
}

function newOption() {
  return { id: crypto.randomUUID(), label: "" }
}
function newQuestion(): PollQuestion {
  return {
    id: crypto.randomUUID(),
    title: "",
    allowMultiple: false,
    options: [newOption(), newOption()],
  }
}

const STATUS_LABEL: Record<PollStatus, string> = {
  draft: "임시저장",
  open: "진행 중",
  closed: "마감",
}

export function PollBuilder({
  id,
  initialTitle,
  initialSlug,
  initialDescription,
  initialStatus,
  initialQuestions,
}: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [slug, setSlug] = useState(initialSlug)
  const [description, setDescription] = useState(initialDescription)
  const [status, setStatus] = useState<PollStatus>(initialStatus)
  const [questions, setQuestions] = useState<PollQuestion[]>(
    initialQuestions.length > 0 ? initialQuestions : [newQuestion()],
  )
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isStatusPending, startStatusTransition] = useTransition()
  const qrRef = useRef<HTMLDivElement>(null)

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${publicPollPath(slug)}`
      : publicPollPath(slug)

  function handleSave() {
    setSaveError(null)
    setSaveSuccess(false)
    startTransition(async () => {
      try {
        await updatePoll(id, { title, slug, description, status, questions })
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 2500)
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : "저장 실패")
      }
    })
  }

  function handleDelete() {
    if (!confirm("이 투표를 삭제하면 투표 데이터도 함께 삭제됩니다. 계속하시겠습니까?")) return
    startDeleteTransition(async () => {
      await deletePoll(id)
    })
  }

  function handleStatusChange(next: PollStatus) {
    setStatus(next)
    startStatusTransition(async () => {
      await setPollStatus(id, next)
    })
  }

  function downloadQr() {
    const svgEl = qrRef.current?.querySelector("svg")
    if (!svgEl) return
    const canvas = document.createElement("canvas")
    const size = 512
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")!
    const img = new Image()
    const svgData = new XMLSerializer().serializeToString(svgEl)
    img.onload = () => {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      const a = document.createElement("a")
      a.download = `poll-qr-${slug}.png`
      a.href = canvas.toDataURL("image/png")
      a.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
  }

  // ── Question helpers ────────────────────────────────────────────────────────
  function updateQuestion(qi: number, patch: Partial<PollQuestion>) {
    setQuestions((prev) => prev.map((q, i) => (i === qi ? { ...q, ...patch } : q)))
  }
  function moveQuestion(qi: number, dir: -1 | 1) {
    setQuestions((prev) => {
      const next = [...prev]
      const t = next[qi]
      next[qi] = next[qi + dir]
      next[qi + dir] = t
      return next
    })
  }
  function deleteQuestion(qi: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== qi))
  }
  function addQuestion() {
    setQuestions((prev) => [...prev, newQuestion()])
  }
  function addOption(qi: number) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qi ? { ...q, options: [...q.options, newOption()] } : q)),
    )
  }
  function updateOption(qi: number, oi: number, label: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi
          ? { ...q, options: q.options.map((o, j) => (j === oi ? { ...o, label } : o)) }
          : q,
      ),
    )
  }
  function deleteOption(qi: number, oi: number) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi ? { ...q, options: q.options.filter((_, j) => j !== oi) } : q,
      ),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Badge
            variant={status === "open" ? "default" : "secondary"}
            className={cn(status === "open" && "bg-[#002065]")}
          >
            {status === "open" && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            )}
            {STATUS_LABEL[status]}
          </Badge>
          {isStatusPending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
        </div>

        <Select value={status} onValueChange={(v) => handleStatusChange(v as PollStatus)}>
          <SelectTrigger className="h-9 w-32 rounded-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">임시저장</SelectItem>
            <SelectItem value="open">진행 중</SelectItem>
            <SelectItem value="closed">마감</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 rounded-full px-4"
          >
            <Link href={`/admin/polls/${id}/live`}>
              <Radio className="mr-1.5 h-3.5 w-3.5" />
              실황 대시보드
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-9 rounded-full px-4"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5 sm:mr-1.5" />}
            <span className="hidden sm:inline">삭제</span>
          </Button>
          <Button
            size="sm"
            className="h-9 rounded-full bg-[#002065] px-5 hover:bg-[#002065]/90"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "저장"}
          </Button>
        </div>
      </div>

      {saveError && (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{saveError}</p>
      )}
      {saveSuccess && (
        <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-600">저장되었습니다.</p>
      )}

      {/* Basic info */}
      <section className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-[#002065]">기본 정보</h2>
        <div className="space-y-3">
          <div>
            <Label htmlFor="poll-title" className="mb-1.5 block text-sm">제목</Label>
            <Input
              id="poll-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="투표 제목"
            />
          </div>
          <div>
            <Label htmlFor="poll-slug" className="mb-1.5 block text-sm">슬러그 (URL)</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/vote/</span>
              <Input
                id="poll-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="poll-desc" className="mb-1.5 block text-sm">설명 (선택)</Label>
            <Textarea
              id="poll-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="투표 설명"
            />
          </div>
        </div>
      </section>

      {/* QR Code */}
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-[#002065]">QR 코드 &amp; 공유</h2>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div ref={qrRef} className="rounded-xl border border-slate-200 bg-white p-3">
            <QRCodeSVG value={publicUrl} size={160} />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">공개 URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-slate-50 px-3 py-2 text-xs break-all">
                  {publicUrl}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => navigator.clipboard.writeText(publicUrl)}
                  title="URL 복사"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                >
                  <Link href={publicPollPath(slug)} target="_blank" title="새 탭에서 열기">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-full"
              onClick={downloadQr}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              QR PNG 다운로드
            </Button>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#002065]">질문 목록</h2>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full"
            onClick={addQuestion}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            질문 추가
          </Button>
        </div>

        <div className="space-y-4">
          {questions.map((q, qi) => (
            <div key={q.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
              {/* Question header */}
              <div className="flex items-start gap-2">
                <GripVertical className="mt-2.5 h-4 w-4 shrink-0 text-slate-300" />
                <div className="flex-1">
                  <Input
                    value={q.title}
                    onChange={(e) => updateQuestion(qi, { title: e.target.value })}
                    placeholder={`질문 ${qi + 1}`}
                    className="font-medium"
                  />
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={qi === 0}
                    onClick={() => moveQuestion(qi, -1)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={qi === questions.length - 1}
                    onClick={() => moveQuestion(qi, 1)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-600"
                    onClick={() => deleteQuestion(qi)}
                    disabled={questions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Multiple selection toggle */}
              <div className="flex items-center gap-3 pl-6">
                <Switch
                  id={`multi-${q.id}`}
                  checked={q.allowMultiple}
                  onCheckedChange={(v) =>
                    updateQuestion(qi, { allowMultiple: v, maxSelections: undefined })
                  }
                />
                <Label htmlFor={`multi-${q.id}`} className="text-sm cursor-pointer">복수 선택</Label>
                {q.allowMultiple && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">최대</span>
                    <Input
                      type="number"
                      min={2}
                      max={20}
                      value={q.maxSelections ?? ""}
                      onChange={(e) =>
                        updateQuestion(qi, {
                          maxSelections: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="h-7 w-16 text-center text-sm"
                      placeholder="∞"
                    />
                    <span className="text-xs text-muted-foreground">개</span>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="pl-6 space-y-2">
                {q.options.map((opt, oi) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300" />
                    <Input
                      value={opt.label}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                      placeholder={`선택지 ${oi + 1}`}
                      className="text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-slate-400 hover:text-red-500"
                      onClick={() => deleteOption(qi, oi)}
                      disabled={q.options.length <= 2}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-6 h-8 text-xs text-[#002065]"
                  onClick={() => addOption(qi)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  선택지 추가
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3 pb-6">
        <Button
          className="h-11 rounded-full bg-[#002065] px-6 hover:bg-[#002065]/90"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          저장
        </Button>
      </div>
    </div>
  )
}
