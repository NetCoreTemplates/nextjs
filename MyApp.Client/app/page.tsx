import Container from "@/components/container"
import MoreStories from "@/components/more-stories"
import HeroPost from "@/components/hero-post"
import Intro from "@/components/intro"
import Layout from "@/components/layout"
import { getAllPosts } from "@/lib/api"
import { CMS_NAME } from "@/lib/constants"
import Post from "@/types/post"
import GettingStarted from "@/components/getting-started"
import BuiltInUis from "@/components/builtin-uis"
import type { Metadata } from 'next'
import AutoUis from "@/components/auto-uis"

export const metadata: Metadata = {
  title: `Next.js Example with ${CMS_NAME}`,
}

export default function Index() {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ]) as unknown as Post[]

  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)

  return (
    <Layout>
      <Container>
        <Intro />
          <div className="mb-32 flex justify-center">
              <GettingStarted template="nextjs" />
          </div>


          <AutoUis className="mt-60" />


        {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.coverImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        )}
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </Layout>
  )
}
