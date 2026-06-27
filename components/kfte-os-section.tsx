import Link from "next/link"
import { KfteOsPageContent } from "@/components/kfte-os-page-content"

type KfteOsSectionProps = {
  variant?: "footer" | "page"
}

const portalLinks = [
  { label: "KFTE OS (파트너 포털)", href: "/kfte-os/partner/login" },
  { label: "KFTE OS (내부용)", href: "/kfte-os/internal/login" },
]

export function KfteOsSection({ variant = "footer" }: KfteOsSectionProps) {
  const isPage = variant === "page"

  if (isPage) {
    return <KfteOsPageContent />
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
