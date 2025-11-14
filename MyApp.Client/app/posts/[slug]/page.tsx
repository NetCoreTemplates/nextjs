import { notFound } from "next/navigation"
import Container from "@/components/container"
import PostBody from "@/components/post-body"
import Header from "@/components/header"
import PostHeader from "@/components/post-header"
import Layout from "@/components/layout"
import { getPostBySlug, getAllPosts } from "@/lib/api"
import PostTitle from "@/components/post-title"
import { CMS_NAME } from "@/lib/constants"
import markdownToHtml from "@/lib/markdownToHtml"
import type { Metadata } from 'next'
import PostType from "@/types/post"

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug, ['title', 'ogImage']) as unknown as PostType
  const title = `${post.title} | Next.js Example with ${CMS_NAME}`

  return {
    title,
    openGraph: {
      images: [post.ogImage.url],
    },
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts(['slug'])

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Post({ params }: Props) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
  ]) as unknown as PostType

  if (!post?.slug) {
    notFound()
  }

  const content = await markdownToHtml(post.content || '')

  return (
    <Layout>
      <Container>
        <Header />
        <article className="prose lg:prose-xl max-w-none mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </Layout>
  )
}
