"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChevronDown, Menu, X } from "lucide-react"
import { KfteLogo } from "@/components/kfte-logo"
import { navAuth, navMenu } from "@/lib/kfte-content"
import {
  easeSmooth,
  staggerContainer,
  staggerItem,
  tweenSmooth,
} from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

type NavItem = { label: string; href: string }

/** Fluid header — desktop keeps air; mobile stays short */
const HEADER_H = "h-[clamp(3.75rem,3.4rem+1vw,6rem)]"
const HEADER_PX = "px-[clamp(1rem,3vw,4rem)]"
const GUTTER = "gap-x-[clamp(0.75rem,2.5vw,2.75rem)]"
const NAV_GAP = "gap-x-[clamp(0.35rem,1.2vw,1.5rem)]"
const NAV_LABEL =
  "text-[clamp(0.8125rem,0.7rem+0.35vw,1.0625rem)] font-semibold leading-snug tracking-[-0.01em]"
const LOGO_SIZE = "h-[clamp(2.5rem,2.1rem+1.1vw,4.25rem)] w-auto max-w-[min(44vw,13rem)]"

function isGroupActive(pathname: string, group: { href: string; items: readonly NavItem[] }) {
  if (pathname === group.href || pathname.startsWith(`${group.href}/`)) return true
  return group.items.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  )
}

function AuthLinks({
  className,
  light,
  onNavigate,
  stacked,
}: {
  className?: string
  light: boolean
  onNavigate?: () => void
  stacked?: boolean
}) {
  if (navAuth.length === 0) return null

  return (
    <div
      className={cn(
        stacked
          ? "flex flex-col gap-3 text-base font-medium"
          : "flex items-center justify-end gap-2.5 text-[clamp(0.8125rem,0.75rem+0.2vw,0.9375rem)] font-medium shrink-0",
        className,
      )}
    >
      {navAuth.map((link, index) => (
        <span key={link.href} className={cn("flex items-center", stacked ? "w-full" : "gap-2.5")}>
          {!stacked && index > 0 && (
            <span
              className={cn(
                "font-normal select-none",
                light ? "text-border" : "text-primary-foreground/35",
              )}
              aria-hidden
            >
              |
            </span>
          )}
          <Link
            href={link.href}
            className={cn(
              "transition-colors",
              stacked
                ? cn(
                    "flex min-h-11 w-full items-center rounded-md px-1",
                    light
                      ? "text-foreground/80 hover:text-foreground"
                      : "text-primary-foreground/90 hover:text-primary-foreground",
                  )
                : cn(
                    "whitespace-nowrap",
                    light
                      ? "text-foreground/75 hover:text-foreground"
                      : "text-primary-foreground/90 hover:text-primary-foreground",
                  ),
            )}
            onClick={onNavigate}
          >
            {link.label}
          </Link>
        </span>
      ))}
    </div>
  )
}

function NavUnderline({
  active,
  light,
}: {
  active: boolean
  light: boolean
}) {
  return (
    <span
      className={cn(
        "mt-3 block h-[2px] w-full origin-center scale-x-0 transition-transform duration-300 xl:mt-5",
        light ? "bg-primary" : "bg-primary-foreground",
        "group-hover/col:scale-x-100",
        active && "scale-x-100",
      )}
      aria-hidden
    />
  )
}

export function Navigation() {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState<number | null>(null)
  /** Mobile accordion: one column open — same IA as desktop mega, less scroll */
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null)
  const isHome = pathname === "/"
  const [heroIntersecting, setHeroIntersecting] = useState(true)

  useEffect(() => {
    if (!isHome) return

    const hero = document.querySelector("[data-hero-section]")
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => setHeroIntersecting(entry.isIntersecting),
      { rootMargin: "-96px 0px 0px 0px", threshold: 0 },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [isHome, pathname])

  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
    setActiveGroup(null)
    setMobileExpanded(null)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const activeIdx = navMenu.findIndex((group) => isGroupActive(pathname, group))
    setMobileExpanded(activeIdx >= 0 ? activeIdx : 0)
  }, [mobileOpen, pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  const onHero = isHome && heroIntersecting
  const light = !onHero || megaOpen || mobileOpen
  const openGroup =
    activeGroup ??
    navMenu.findIndex((group) => isGroupActive(pathname, group))

  const closeMobile = () => setMobileOpen(false)

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-colors duration-300",
        light
          ? "bg-surface text-foreground shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-primary text-primary-foreground",
      )}
      onMouseLeave={() => {
        setMegaOpen(false)
        setActiveGroup(null)
      }}
    >
      {/* Desktop / large tablet: fluid 3-zone flex — logo | nav | auth */}
      <div
        className={cn("relative hidden lg:block")}
        onMouseEnter={() => setMegaOpen(true)}
      >
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: easeSmooth }}
              className={cn(
                "absolute inset-x-0 top-[clamp(3.75rem,3.4rem+1vw,6rem)] bottom-0 -z-0 border-t",
                light
                  ? "bg-surface border-border/40 shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                  : "bg-[#001540] border-primary-foreground/10",
              )}
              aria-hidden
            />
          )}
        </AnimatePresence>

        <div
          className={cn(
            "relative z-10 flex items-start",
            HEADER_PX,
            GUTTER,
          )}
        >
          <Link
            href="/"
            className={cn("flex shrink-0 items-center", HEADER_H)}
          >
            <KfteLogo
              variant={light ? "blue" : "white"}
              priority
              className={LOGO_SIZE}
            />
          </Link>

          <nav className="min-w-0 flex-1" aria-label="메인 메뉴">
            <div className={cn("mx-auto grid max-w-[44rem] grid-cols-4 xl:max-w-[52rem]", NAV_GAP)}>
              {navMenu.map((group, index) => {
              const isActive = isGroupActive(pathname, group)
              const isHighlighted = megaOpen && openGroup === index
              const underlineActive = isActive || isHighlighted

              return (
                <div
                  key={group.label}
                  className="group/col flex min-w-0 flex-col"
                  onMouseEnter={() => setActiveGroup(index)}
                >
                  <div
                    className={cn(
                      "flex flex-col items-center justify-end self-stretch",
                      HEADER_H,
                    )}
                  >
                    <Link
                      href={group.href}
                      className={cn(
                        "block w-full text-center transition-colors",
                        NAV_LABEL,
                        light ? "text-foreground" : "text-primary-foreground",
                      )}
                    >
                      <span className="line-clamp-2">{group.label}</span>
                    </Link>
                    <NavUnderline active={underlineActive} light={light} />
                  </div>

                  <motion.ul
                    initial={false}
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            height: megaOpen ? "auto" : 0,
                            opacity: megaOpen ? 1 : 0,
                          }
                    }
                    transition={tweenSmooth}
                    className="overflow-hidden text-left"
                    aria-label={`${group.label} 하위 메뉴`}
                    aria-hidden={!megaOpen}
                  >
                    <div
                      className={cn(
                        megaOpen
                          ? "space-y-3 pb-10 pt-5 xl:space-y-4 xl:pb-14 xl:pt-7"
                          : "pb-0 pt-0",
                      )}
                    >
                      {group.items.map((item) => {
                        const isItemActive = pathname === item.href

                        return (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              className={cn(
                                "block py-0.5 text-left text-[clamp(0.9375rem,0.85rem+0.3vw,1.125rem)] leading-relaxed transition-colors",
                                isItemActive
                                  ? cn(
                                      "font-bold",
                                      light ? "text-primary" : "text-primary-foreground",
                                    )
                                  : cn(
                                      "font-normal hover:font-bold",
                                      light
                                        ? "text-muted-foreground hover:text-foreground"
                                        : "text-primary-foreground/70 hover:text-primary-foreground",
                                    ),
                              )}
                              onClick={() => setMegaOpen(false)}
                            >
                              {item.label}
                            </Link>
                          </li>
                        )
                      })}
                    </div>
                  </motion.ul>
                </div>
              )
            })}
            </div>
          </nav>

          <div className={cn("flex shrink-0 items-center gap-3", HEADER_H)}>
            <AuthLinks light={light} className="items-center" />
          </div>
        </div>
      </div>

      {/* Phone / small tablet bar */}
      <div
        className={cn(
          "flex lg:hidden items-center",
          HEADER_H,
          HEADER_PX,
          "border-b",
          light ? "border-border/40 bg-surface" : "border-transparent bg-primary",
        )}
      >
        <Link href="/" className="min-w-0 shrink" onClick={closeMobile}>
          <KfteLogo
            variant={light ? "blue" : "white"}
            priority
            className={LOGO_SIZE}
          />
        </Link>
        <button
          type="button"
          className={cn(
            "ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
            light
              ? "text-foreground hover:bg-foreground/5"
              : "text-primary-foreground hover:bg-primary-foreground/10",
          )}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile compact sheet — desktop column IA as accordion */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              key="nav-backdrop"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: easeSmooth }}
              className="fixed inset-0 top-[clamp(3.75rem,3.4rem+1vw,6rem)] z-[90] bg-black/45 backdrop-blur-[2px] lg:hidden"
              aria-label="메뉴 닫기"
              onClick={closeMobile}
            />
            <motion.nav
              key="nav-panel"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: easeSmooth }}
              className={cn(
                "fixed inset-x-0 z-[95] flex max-h-[min(72vh,32rem)] flex-col overflow-hidden border-t shadow-[0_16px_40px_rgba(0,0,0,0.14)] lg:hidden",
                "top-[clamp(3.75rem,3.4rem+1vw,6rem)]",
                light
                  ? "border-border/40 bg-surface"
                  : "border-primary-foreground/10 bg-[#001540]",
              )}
              aria-label="모바일 메인 메뉴"
            >
              <div
                className={cn(
                  "min-h-0 flex-1 overflow-y-auto overscroll-contain py-3",
                  HEADER_PX,
                )}
              >
                <motion.div
                  variants={reduceMotion ? undefined : staggerContainer}
                  initial={reduceMotion ? false : "hidden"}
                  animate="visible"
                  className="divide-y divide-border/40"
                >
                  {navMenu.map((group, index) => {
                    const expanded = mobileExpanded === index
                    const isActive = isGroupActive(pathname, group)

                    return (
                      <motion.div
                        key={group.label}
                        variants={reduceMotion ? undefined : staggerItem}
                        className="py-1"
                      >
                        <div className="flex items-stretch gap-1">
                          <Link
                            href={group.href}
                            className={cn(
                              "flex min-h-9 min-w-0 flex-1 items-center text-[0.9375rem] font-semibold",
                              light ? "text-foreground" : "text-primary-foreground",
                              isActive && (light ? "text-primary" : "text-primary-foreground"),
                            )}
                            onClick={closeMobile}
                          >
                            <span className="truncate">{group.label}</span>
                          </Link>
                          <button
                            type="button"
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                              light
                                ? "text-muted-foreground hover:bg-foreground/5"
                                : "text-primary-foreground/70 hover:bg-primary-foreground/10",
                            )}
                            aria-expanded={expanded}
                            aria-label={`${group.label} 하위 메뉴 ${expanded ? "접기" : "펼치기"}`}
                            onClick={() =>
                              setMobileExpanded((cur) => (cur === index ? null : index))
                            }
                          >
                            <motion.span
                              animate={{ rotate: expanded ? 180 : 0 }}
                              transition={{ duration: 0.18, ease: easeSmooth }}
                              className="inline-flex"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </motion.span>
                          </button>
                        </div>

                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.ul
                              key={`${group.label}-items`}
                              initial={
                                reduceMotion ? false : { height: 0, opacity: 0 }
                              }
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: easeSmooth }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 pb-2 pl-1 pt-1">
                                {group.items.map((item) => (
                                  <li key={item.label}>
                                    <Link
                                      href={item.href}
                                      className={cn(
                                        "flex min-h-9 items-center text-[0.8125rem] leading-snug",
                                        pathname === item.href
                                          ? "font-bold text-primary"
                                          : light
                                            ? "text-muted-foreground hover:text-foreground"
                                            : "text-primary-foreground/70 hover:text-primary-foreground",
                                      )}
                                      onClick={closeMobile}
                                    >
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </div>
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>

              <div
                className={cn(
                  "shrink-0 space-y-2.5 border-t px-[clamp(1rem,3vw,4rem)] py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))]",
                  light ? "border-border/40" : "border-primary-foreground/10",
                )}
              >
                <AuthLinks light={light} onNavigate={closeMobile} className="justify-start gap-3" />
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
