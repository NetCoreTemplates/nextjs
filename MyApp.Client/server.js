import { createServer } from 'https'
import { parse } from 'url'
import next from 'next'
import { createProxyMiddleware } from 'http-proxy-middleware'
import fs from 'fs'
import path from 'path'
import child_process from 'child_process'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const baseFolder =
    process.env.APPDATA !== undefined && process.env.APPDATA !== ''
        ? `${process.env.APPDATA}/ASP.NET/https`
        : `${process.env.HOME}/.aspnet/https`;

const certificateName = "myapp.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

// Generate dev certificates if they don't exist (for dev mode only)
if (dev) {
    console.log(`Certificate path: ${certFilePath}`);

    if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
        // mkdir to fix dotnet dev-certs error 3 https://github.com/dotnet/aspnetcore/issues/58330
        if (!fs.existsSync(baseFolder)) {
            fs.mkdirSync(baseFolder, { recursive: true });
        }
        if (
            0 !==
            child_process.spawnSync(
                "dotnet",
                [
                    "dev-certs",
                    "https",
                    "--export-path",
                    certFilePath,
                    "--format",
                    "Pem",
                    "--no-password",
                ],
                { stdio: "inherit" }
            ).status
        ) {
            throw new Error("Could not create certificate.");
        }
    }
}

const target = process.env.ASPNETCORE_HTTPS_PORT
    ? `https://localhost:${process.env.ASPNETCORE_HTTPS_PORT}`
    : process.env.ASPNETCORE_URLS
        ? process.env.ASPNETCORE_URLS.split(';')[0]
        : 'https://localhost:5001'

// Create the Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Create proxy middleware for /api routes
const apiProxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    secure: false, // This is the key setting for self-signed certificates
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying: ${req.method} ${req.url} -> ${target}${req.url}`)
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err)
        res.writeHead(500, {
            'Content-Type': 'text/plain',
        })
        res.end('Proxy error: ' + err.message)
    },
})

app.prepare().then(() => {
    const serverOptions = dev ? {
        key: fs.readFileSync(keyFilePath),
        cert: fs.readFileSync(certFilePath),
    } : {};

    createServer(serverOptions, async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true)
            const { pathname } = parsedUrl

            // Proxy /api requests to the backend
            if (pathname.startsWith('/api')) {
                apiProxy(req, res)
            } else {
                // Handle all other requests with Next.js
                await handle(req, res, parsedUrl)
            }
        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
        }
    })
    .once('error', (err) => {
        console.error(err)
        process.exit(1)
    })
    .listen(port, () => {
        console.log(`> Ready on https://${hostname}:${port}`)
        console.log(`> Proxying /api requests to ${target}`)
    })
})

