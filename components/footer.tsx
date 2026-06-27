import Link from "next/link"
import { KfteLogo } from "@/components/kfte-logo"
import { KfteOsSection } from "@/components/kfte-os-section"
import { footer as footerContent, navLinks, site } from "@/lib/kfte-content"

export function Footer() {
  const org = footerContent.organization

  return (
    <footer className="px-6 py-16 md:px-12 lg:px-20 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">
        <div className="md:col-span-4">
          <Link href="/" className="inline-block mb-5">
            <KfteLogo variant="blue" />
          </Link>
          <p className="text-base font-semibold text-foreground mb-2">{site.fullName}</p>
          <p className="text-base leading-[1.75] text-muted-foreground max-w-sm">
            {footerContent.description}
          </p>
        </div>

        <div className="md:col-span-4 md:col-start-6">
          <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-muted-foreground/50 mb-5">
            Navigation
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 md:col-start-11">
          <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-muted-foreground/50 mb-5">
            Social
          </p>
          <div className="flex flex-col gap-3">
            {footerContent.social.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8 md:items-start">
          <div className="md:col-span-4 space-y-3 text-sm leading-[1.8] text-muted-foreground">
            <p className="text-base font-semibold text-foreground">{org.title}</p>
            <p>단체명 : {org.name}</p>
            <p>이사장 : {org.chairman}</p>
            <p>고유번호 : {org.registrationNumber}</p>
            <p>{org.address}</p>
            <p>
              Tel: {org.tel} | Fax: {org.fax}
            </p>
            <p>
              Mail:{" "}
              <a
                href={`mailto:${org.email}`}
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                {org.email}
              </a>
            </p>
            <p className="pt-4 text-sm text-muted-foreground/70">© {org.copyright}</p>
          </div>

          <div className="md:col-span-4 md:col-start-6">
            <KfteOsSection variant="footer" />
          </div>

          <div id="resources" className="md:col-span-2 md:col-start-11 md:text-right">
            <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-muted-foreground/50 mb-4">
              자료실
            </p>
            <div className="flex flex-col gap-2 md:items-end">
              {footerContent.legal.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
