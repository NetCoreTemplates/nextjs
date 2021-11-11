const PROD_API = 'https://nextjs.web-templates.io'
const PROD_CDN = 'https://nextjs-gh.web-templates.io'

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    async rewrites() {
        let rules = [];
        if (!isProd) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // when it works https://github.com/vercel/next.js/issues/21537
            rules.push({
                source: '/api/:path*',
                destination: 'http://localhost:5000/api/:path*', 
            });
        }
        return rules;
    },

    env: {
        apiBaseUrl: isProd ? PROD_API : '/'
    },

    // Use the CDN in production and localhost for development.
    assetPrefix: isProd ? PROD_CDN : '',
}
