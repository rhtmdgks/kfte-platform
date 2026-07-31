"use client"

import { useId, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { springGentle } from "@/lib/animation-presets"

type MotionFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: "text" | "email" | "date" | "time" | "tel" | "url"
  multiline?: boolean
  rows?: number
  required?: boolean
  error?: string
  className?: string
  name?: string
  autoComplete?: string
  disabled?: boolean
  hideLabel?: boolean
}

/** Tally/Linear-style: top label + underline field. */
export function MotionField({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  rows = 4,
  required,
  error,
  className,
  name,
  autoComplete,
  disabled,
  hideLabel,
}: MotionFieldProps) {
  const id = useId()
  const reduceMotion = useReducedMotion()
  const [focused, setFocused] = useState(false)

  const controlClass = cn(
    "w-full bg-transparent text-[17px] leading-relaxed text-[#0f172a] outline-none",
    "placeholder:text-slate-400 disabled:opacity-50",
    multiline ? "min-h-[120px] resize-none py-2" : "h-14",
  )

  return (
    <div className={cn("space-y-2", className)}>
      {!hideLabel ? (
        <label htmlFor={id} className="block text-sm font-medium text-slate-600">
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </label>
      ) : (
        <span className="sr-only">
          <label htmlFor={id}>
            {label}
            {required ? " 필수" : ""}
          </label>
        </span>
      )}

      <div className="relative">
        {multiline ? (
          <textarea
            id={id}
            name={name}
            rows={rows}
            value={value}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            placeholder={hideLabel ? label : undefined}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => onChange(e.target.value)}
            className={controlClass}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            placeholder={hideLabel ? label : undefined}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => onChange(e.target.value)}
            className={controlClass}
          />
        )}
        <div className="h-px w-full bg-slate-200" />
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[#002065]"
          initial={false}
          animate={{
            scaleX: focused ? 1 : 0,
            opacity: focused ? 1 : 0,
          }}
          transition={reduceMotion ? { duration: 0 } : springGentle}
        />
      </div>

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}

type MotionChoiceProps = {
  selected: boolean
  onSelect: () => void
  label: string
  multi?: boolean
  children?: React.ReactNode
  index?: number
}

export function MotionChoice({
  selected,
  onSelect,
  label,
  multi = false,
  children,
  index,
}: MotionChoiceProps) {
  const reduceMotion = useReducedMotion()
  const letter =
    typeof index === "number" && index < 26
      ? String.fromCharCode(65 + index)
      : undefined

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      className={cn(
        "group flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002065]/25",
        selected
          ? "border-[#002065] bg-[#002065]/[0.04]"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80",
      )}
      aria-pressed={selected}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center text-xs font-semibold transition-colors",
          multi ? "rounded-md" : "rounded-md",
          selected
            ? "bg-[#002065] text-white"
            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/80",
        )}
      >
        {multi ? (selected ? "✓" : "□") : (letter ?? "○")}
      </span>
      <span className="min-w-0 flex-1 text-[16px] font-medium text-slate-900">{label}</span>
      {children}
    </motion.button>
  )
}
