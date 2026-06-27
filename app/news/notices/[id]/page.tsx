import type { Metadata } from "next"
import { NewsDetailPageContent } from "@/components/news/news-detail-page-content"
import { getNewsPostById } from "@/lib/news-types"
import { noticesPage } from "@/lib/notices-content"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return noticesPage.posts.map((post) => ({ id: post.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const post = getNewsPostById(noticesPage.posts, id)

  if (!post) {
    return { title: "공지사항 | 한국기술창업진흥재단(KFTE)" }
  }

  return {
    title: `${post.title} | 공지사항 | KFTE`,
    description: post.content.slice(0, 120),
  }
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { id } = await params
  return <NewsDetailPageContent config={noticesPage} postId={id} />
}
