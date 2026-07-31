import type { Components } from "react-markdown"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

const components: Components = {
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-[#002065] underline underline-offset-2 hover:text-[#001a52]"
      {...props}
    >
      {children}
    </a>
  ),
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-800">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="rounded bg-slate-100 px-1 py-0.5 text-[0.9em] text-slate-700">
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-[#002065]/30 pl-3 text-slate-500 last:mb-0">
      {children}
    </blockquote>
  ),
  h1: ({ children }) => (
    <h1 className="mb-2 text-xl font-bold text-slate-900 last:mb-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 text-lg font-bold text-slate-900 last:mb-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 text-base font-semibold text-slate-900 last:mb-0">{children}</h3>
  ),
}

type MarkdownTextProps = {
  children: string
  className?: string
}

/** Safe markdown + GFM autolink for form/section/question descriptions. */
export function MarkdownText({ children, className }: MarkdownTextProps) {
  const source = children.trim()
  if (!source) return null

  return (
    <div
      className={cn(
        "max-w-none text-[15px] leading-relaxed text-slate-500 [&_a]:break-all",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  )
}
