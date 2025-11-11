import React from "react"
import Layout from "../components/layout"
import Breadcrumbs from "../components/breadcrumbs"
import { getAllPosts } from "../lib/api"
import Post from "../types/post"

type Props = {
    allPosts: Post[]
}
const Posts = ({ allPosts }: Props) => {
    return (<Layout>
        <main className="flex justify-center">
            <div className="mx-auto px-5">
                <Breadcrumbs className="my-8" name="Markdown Posts" />
                <h3 className="text-lg mb-8">
                    List of Markdown Posts in <span
                    className="bg-blue-50 text-blue-500 py-1 px-2 rounded">/pages</span>
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
