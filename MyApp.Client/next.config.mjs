import createMDX from "@next/mdx"

const target = process.env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${process.env.ASPNETCORE_HTTPS_PORT}` :
    process.env.ASPNETCORE_URLS ? process.env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:5001';

const isProd = process.env.NODE_ENV === 'production'
const buildLocal = process.env.MODE === 'local'

// Define DEPLOY_API first
const DEPLOY_API = process.env.KAMAL_DEPLOY_HOST 
    ? `https://${process.env.KAMAL_DEPLOY_HOST}` 
    : target

// Now use it for API_URL
const API_URL = isProd ? DEPLOY_API : (buildLocal ? '' : target)

console.log('next.config.mjs', process.env.NODE_ENV, buildLocal, API_URL, process.env.KAMAL_DEPLOY_HOST)

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
    // Enable static export (replaces next export command)
    output: isProd ? 'export' : undefined,

    // Change output directory from 'out' to 'dist'
    distDir: 'dist',

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
