import Link from "next/link"
import { KfteLogo } from "@/components/kfte-logo"
import { footer as footerContent } from "@/lib/kfte-content"

type KfteOsSectionProps = {
  variant?: "footer" | "page"
}

const portalLinks = [
  { label: "KFTE OS (파트너 포털)", href: "/kfte-os/partner/login" },
  { label: "KFTE OS (내부용)", href: "/kfte-os/internal/login" },
]

export function KfteOsSection({ variant = "footer" }: KfteOsSectionProps) {
  const instagram = footerContent.social.find((s) => s.label === "Instagram")
  const isPage = variant === "page"

  if (isPage) {
    return (
      <div className="flex min-h-[calc(100vh-96px)] flex-col bg-[#f5f5f5] px-8 py-10 xl:px-12 2xl:px-16">
        <div className="flex items-start justify-between">
          <div>
            <KfteLogo variant="blue" className="mb-3 h-8 w-auto" />
            <p className="text-lg font-semibold text-foreground">한국기술창업진흥재단</p>
            <p className="text-sm text-muted-foreground">non-profit organization</p>
          </div>
          {instagram && (
            <a
              href={instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground/70 transition-colors hover:border-primary hover:text-primary"
            >
              Instagram
            </a>
          )}
        </div>

        <nav className="mt-auto flex flex-col items-start gap-3 pb-8">
          {portalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base text-foreground/80 transition-colors hover:text-primary md:text-lg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs tracking-widest text-muted-foreground/50">© KFTE</p>
      </div>
    )
  }

  return (
    <nav className="flex flex-col items-start gap-2">
      {portalLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-foreground/70 transition-colors hover:text-primary"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
