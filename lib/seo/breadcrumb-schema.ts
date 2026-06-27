const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kfte.kr'

interface BreadcrumbItem {
  name: string
  href: string
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.href}`,
    })),
  } as const
}
