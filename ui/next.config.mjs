import nextMDX from "@next/mdx"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"

// TODO: replace with production URL of .NET App
const DEPLOY_API = 'https://$DEPLOY_API' // e.g. 'https://nextjs-api.jamstacks.net'
const USE_DEV_PROXY = false // Use CORS-free URL: http://localhost:3000/api
const DEV_API = 'https://localhost:5001'

const isProd = process.env.NODE_ENV === 'production'

const buildLocal = process.env.MODE === 'local'
const API_URL = isProd ? DEPLOY_API : (USE_DEV_PROXY || buildLocal ? '' : DEV_API)

console.log('next.config.mjs', process.env.NODE_ENV, buildLocal, API_URL)

const withMDX = nextMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [remarkGfm, remarkParse, remarkRehype],
        rehypePlugins: [rehypeStringify],
        // If you use `MDXProvider`, uncomment the following line.
        // providerImportSource: "@mdx-js/react",
    },
})

/**
 * @type {import('next').NextConfig}
 **/
export default withMDX({
    pageExtensions: ['tsx','mdx','md'],

    async rewrites() {
        let rules = [];
        if (!isProd) {
            //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // when https works https://github.com/vercel/next.js/issues/21537
            rules.push({
                source: '/api/:path*',
                destination: 'http://localhost:5000/api/:path*',
            });
        }
        return rules;
    },

    env: {
        apiBaseUrl: API_URL
    },
})
