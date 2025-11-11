import createMDX from "@next/mdx"

// TODO: replace with production URL of .NET App
const DEPLOY_API = 'https://$DEPLOY_API' // e.g. 'https://nextjs-api.jamstacks.net'

const target = process.env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${process.env.ASPNETCORE_HTTPS_PORT}` :
    process.env.ASPNETCORE_URLS ? process.env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:5001';

const isProd = process.env.NODE_ENV === 'production'
const buildLocal = process.env.MODE === 'local'
const API_URL = isProd ? DEPLOY_API : (buildLocal ? '' : target)

console.log('next.config.mjs', process.env.NODE_ENV, buildLocal, API_URL)

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
    pageExtensions: ['tsx','mdx','md'],

    // Enable static export (replaces next export command)
    output: isProd ? 'export' : undefined,

    env: {
        apiBaseUrl: API_URL
    },
}

const withMDX = createMDX({
    // Use string-based plugin names for Turbopack compatibility
    options: {
        remarkPlugins: ['remark-gfm'],
        rehypePlugins: [
            'rehype-prism-plus',
        ],
    },
})

export default withMDX(nextConfig)
