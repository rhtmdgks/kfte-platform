import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Linkedin } from "lucide-react"
import {
  peoplePage,
  type ListMember,
  type ListPeopleSection,
  type PeopleSection,
  type ProfilePeopleSection,
  type TeamMember,
} from "@/lib/people-content"
import { pageMainClassName } from "@/lib/page-layout"
import { cn } from "@/lib/utils"

const SECTION_GRID =
  "mt-16 md:mt-24 lg:grid lg:grid-cols-[minmax(160px,220px)_minmax(0,1fr)] lg:gap-x-10 xl:gap-x-16"

const LIST_SECTION_GRID =
  "mt-20 md:mt-32 py-10 md:py-16 lg:grid lg:grid-cols-[minmax(160px,220px)_minmax(0,1fr)] lg:gap-x-10 xl:gap-x-16"

const SECTION_CONTENT = "mt-8 lg:mt-0 w-full min-w-0"

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xl md:text-2xl font-bold text-foreground lg:sticky lg:top-32 lg:self-start">
      {children}
    </h2>
  )
}

function ListMemberLine({ member }: { member: ListMember }) {
  return (
    <li className="text-[15px] md:text-base leading-relaxed">
      <span className="text-foreground">{member.name}</span>{" "}
      <span className="text-muted-foreground">{member.title}</span>
    </li>
  )
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article>
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 50vw, 40vw"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-base font-bold text-foreground">{member.name}</span>
          <span className="text-sm text-muted-foreground">{member.role}</span>
        </div>
        <Link
          href={member.linkedin ?? "#"}
          className="shrink-0 text-muted-foreground/60 transition-colors hover:text-foreground"
          aria-label={`${member.name} LinkedIn`}
          target={member.linkedin?.startsWith("http") ? "_blank" : undefined}
          rel={member.linkedin?.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          <Linkedin className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </Link>
      </div>
    </article>
  )
}

function ProfileSection({ section }: { section: ProfilePeopleSection }) {
  return (
    <section className={SECTION_GRID}>
      <SectionTitle>{section.title}</SectionTitle>
      <ul
        className={`${SECTION_CONTENT} grid grid-cols-2 gap-x-8 gap-y-10 md:gap-x-16 md:gap-y-12 lg:gap-x-24 xl:gap-x-32`}
      >
        {section.members.map((member) => (
          <li key={member.name}>
            <MemberCard member={member} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function ListSection({ section }: { section: ListPeopleSection }) {
  return (
    <section className={LIST_SECTION_GRID}>
      <SectionTitle>{section.title}</SectionTitle>
      <div
        className={cn(
          SECTION_CONTENT,
          "lg:mt-2 grid grid-cols-2 gap-x-6 gap-y-6 md:gap-x-8 md:gap-y-8 xl:gap-x-10",
          section.columns.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4",
        )}
      >
        {section.columns.map((column, columnIndex) => (
          <ul key={columnIndex} className="space-y-5 md:space-y-6">
            {column.map((member) => (
              <ListMemberLine key={`${member.name}-${member.title}`} member={member} />
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}

function PeopleSectionBlock({ section }: { section: PeopleSection }) {
  switch (section.type) {
    case "profile":
      return <ProfileSection section={section} />
    case "list":
      return <ListSection section={section} />
  }
}

export function PeoplePageContent() {
  return (
    <main className={pageMainClassName}>
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 xl:px-20">
        <header>
          <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.15] tracking-tight text-foreground">
            <span className="font-light">{peoplePage.pageTitleLight}</span>
            <span className="font-bold"> {peoplePage.pageTitleBold}</span>
          </h1>
          <p className="mt-8 max-w-3xl text-base md:text-lg leading-relaxed text-foreground/80">
            {peoplePage.description}
          </p>
        </header>

        {peoplePage.sections.map((section) => (
          <PeopleSectionBlock key={section.id} section={section} />
        ))}
      </div>
    </main>
  )
}
