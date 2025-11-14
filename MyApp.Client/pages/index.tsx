import Container from "@/components/container"
import MoreStories from "@/components/more-stories"
import HeroPost from "@/components/hero-post"
import Intro from "@/components/intro"
import Layout from "@/components/layout"
import { getAllPosts } from "@/lib/api"
import Head from "next/head"
import { CMS_NAME } from "@/lib/constants"
import Post from "@/types/post"
import GettingStarted from "@/components/getting-started"
import BuiltInUis from "@/components/builtin-uis"

type Props = {
  allPosts: Post[]
}

const Index = ({ allPosts }: Props) => {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  const title = `Next.js Example with ${CMS_NAME}`

  return (
    <>
      <Layout>
        <Head>
          <title>{title}</title>
        </Head>
        <Container>
          <Intro />
            <div className="mb-32 flex justify-center">
                <GettingStarted template="nextjs" />
            </div>


            <div className="flex justify-center my-20 py-20 bg-slate-100 dark:bg-slate-800">
                <div className="text-center">
                    <svg className="text-link-dark w-36 h-36 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.58 17.25l.92-3.89l-3-2.58l3.95-.37L12 6.8l1.55 3.65l3.95.33l-3 2.58l.92 3.89L12 15.19zM12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8"/></svg>
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
                        Built-in UIs
                    </h1>
                </div>
            </div>

            <div className="mb-40">
                <p className="mt-4 mb-10 text-xl text-gray-600 dark:text-gray-400">
                    Manage your ServiceStack App and explore, discover, query and call APIs instantly with
                    built-in Auto UIs dynamically generated from the rich metadata of your App's typed C# APIs &amp; DTOs
                </p>

                <BuiltInUis />
            </div>
            
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
    </>
  )
}

export default Index

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}
