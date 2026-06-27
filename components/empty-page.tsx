import { pageMainClassName } from "@/lib/page-layout"

type EmptyPageProps = {
  label: string
}

export function EmptyPage({ label }: EmptyPageProps) {
  return <main className={pageMainClassName} aria-label={label} />
}
