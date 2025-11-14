import React from "react"
import Layout from "../components/layout"
import { getAllPosts } from "../lib/api"
import Post from "../types/post"

type Props = {
    allPosts: Post[]
}
const Posts = ({ allPosts }: Props) => {
    return (<Layout>
        <main>
            <div className="max-w-7xl mx-auto px-5">
                <h1 className="text-4xl font-bold my-8 text-gray-900 dark:text-gray-100">Markdown Posts</h1>
                <h3 className="text-lg mb-8">
                    List of Markdown Posts in <span
                    className="bg-blue-50 text-blue-500 dark:bg-blue-900 dark:text-blue-200 py-1 px-2 rounded">/pages</span>
                </h3>
                {allPosts.map((post) => (
                    <div className="mb-8" key={post.slug}>
                        <a className="text-2xl hover:text-green-600" href={`/posts/${post.slug}`}>{post.title}</a>
                        {!post.excerpt ? null : <p className="text-gray-500">
                            {post.excerpt}
                        </p>}
                    </div>
                ))}
            </div>
        </main>
    </Layout>)
}
export default Posts

export const getStaticProps = async () => {
    const allPosts = getAllPosts([
        'title',
        'slug',
        'excerpt',
    ])
    return {
        props: { allPosts },
    }
}
