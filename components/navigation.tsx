"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { KfteLogo } from "@/components/kfte-logo"
import { navAuth, navMenu } from "@/lib/kfte-content"
import { cn } from "@/lib/utils"

type NavItem = { label: string; href: string }

const HEADER_H = "h-[96px]"
const HEADER_TOP = 96
const MENU_GRID = "mx-auto grid w-[880px] xl:w-[980px] grid-cols-4"

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
}: {
  className?: string
  light: boolean
  onNavigate?: () => void
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2.5 text-[15px] font-medium shrink-0",
        className,
      )}
    >
      {navAuth.map((link, index) => (
        <span key={link.href} className="flex items-center gap-2.5">
          {index > 0 && (
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
              "whitespace-nowrap transition-colors",
              light
                ? "text-foreground/75 hover:text-foreground"
                : "text-primary-foreground/90 hover:text-primary-foreground",
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
        "mt-5 block h-[2px] w-full scale-x-0 transition-transform duration-300 origin-left",
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
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState<number | null>(null)
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

  const onHero = isHome && heroIntersecting
  const light = !onHero || megaOpen
  const openGroup =
    activeGroup ??
    navMenu.findIndex((group) => isGroupActive(pathname, group))

  const closeMobile = () => setMobileOpen(false)

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-colors duration-300",
        light
          ? "bg-white text-foreground shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-primary text-primary-foreground",
      )}
      onMouseLeave={() => {
        setMegaOpen(false)
        setActiveGroup(null)
      }}
      onMouseEnter={() => setMegaOpen(true)}
    >
      {/* Desktop */}
      <div className="relative hidden lg:block">
        {megaOpen && (
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 -z-0 border-t",
              light
                ? "bg-white border-border/40 shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                : "bg-[#001540] border-primary-foreground/10",
            )}
            style={{ top: HEADER_TOP }}
            aria-hidden
          />
        )}

        <Link
          href="/"
          className={cn(
            "absolute left-8 xl:left-12 2xl:left-16 top-0 z-20 flex items-center",
            HEADER_H,
          )}
        >
          <KfteLogo
            variant={light ? "blue" : "white"}
            priority
            className="h-12 w-auto xl:h-14"
          />
        </Link>

        <AuthLinks
          light={light}
          className={cn("absolute right-8 xl:right-12 2xl:right-16 top-0 z-20", HEADER_H)}
        />

        <nav className={cn("relative z-10", MENU_GRID)} aria-label="메인 메뉴">
          {navMenu.map((group, index) => {
            const isActive = isGroupActive(pathname, group)
            const isHighlighted = megaOpen && openGroup === index
            const underlineActive = isActive || isHighlighted

            return (
              <div
                key={group.label}
                className="group/col flex min-w-0 flex-col px-4 xl:px-5"
                onMouseEnter={() => setActiveGroup(index)}
              >
                <div className={cn("flex flex-col justify-end", HEADER_H)}>
                  <Link
                    href={group.href}
                    className={cn(
                      "block w-full text-left text-base xl:text-[17px] font-semibold leading-snug tracking-[-0.01em] transition-colors",
                      light ? "text-foreground" : "text-primary-foreground",
                    )}
                  >
                    {group.label}
                  </Link>
                  <NavUnderline active={underlineActive} light={light} />
                </div>

                <ul
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    megaOpen
                      ? "max-h-[640px] space-y-4 pb-14 pt-7 opacity-100"
                      : "max-h-0 space-y-0 pb-0 pt-0 opacity-0",
                  )}
                  aria-label={`${group.label} 하위 메뉴`}
                  aria-hidden={!megaOpen}
                >
                  {group.items.map((item) => {
                    const isItemActive = pathname === item.href

                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className={cn(
                            "block py-0.5 text-[17px] xl:text-lg leading-relaxed transition-colors",
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
                </ul>
              </div>
            )
          })}
        </nav>
      </div>

      {/* Mobile */}
      <div
        className={cn(
          "flex lg:hidden items-center gap-4 px-6 h-[80px] border-b",
          light ? "border-border/40 bg-white" : "border-transparent bg-primary",
        )}
      >
        <Link href="/" className="shrink-0">
          <KfteLogo
            variant={light ? "blue" : "white"}
            priority
            className="h-11 w-auto"
          />
        </Link>
        <button
          type="button"
          className={cn("ml-auto p-2 -mr-2", light ? "text-foreground" : "text-primary-foreground")}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden border-t transition-all duration-300",
          light ? "border-border/40 bg-white" : "border-primary-foreground/10 bg-[#001540]",
          mobileOpen ? "max-h-[80vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-6 py-8 space-y-10">
          {navMenu.map((group) => (
            <div key={group.label}>
              <Link
                href={group.href}
                className="text-lg font-semibold"
                onClick={closeMobile}
              >
                {group.label}
              </Link>
              <ul className="mt-4 space-y-3 pl-1">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        "text-base",
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
              </ul>
            </div>
          ))}
          <AuthLinks light={light} onNavigate={closeMobile} />
        </div>
      </div>
    </header>
  )
}
