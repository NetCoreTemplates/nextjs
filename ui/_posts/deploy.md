---
title: 'Deployment with GitHub Actions'
excerpt: 'Configuring your GitHub repo for SSH and CDN deployments'
coverImage: '/assets/blog/dynamic-routing/cover.jpg'
date: '2021-11-09T05:35:07.322Z'
author:
  name: Author
  picture: '/assets/blog/authors/author1.svg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
---

# ServiceStack GitHub Action Deployments

The [release.yml](https://github.com/NetCoreTemplates/nextjs/blob/main/.github/workflows/release.yml)
in this template enables GitHub Actions CI deployment to a dedicated server with SSH access.

## Overview
`release.yml` is designed to work with a ServiceStack app deploying directly to a single server via SSH. A docker image is built and stored on GitHub's `ghcr.io` docker registry when a GitHub Release is created.

GitHub Actions specified in `release.yml` then copy files remotely via scp and use `docker-compose` to run the app remotely via SSH.

## What's the process of `release.yml`?

![](https://raw.githubusercontent.com/ServiceStack/docs/master/docs/images/mix/release-ghr-vanilla-diagram.png)

## Deployment server setup
To get this working, a server needs to be setup with the following:

- SSH access
- docker
- docker-compose
- ports 443 and 80 for web access of your hosted application

This can be your own server or any cloud hosted server like Digital Ocean, AWS, Azure etc.

When setting up your server, you'll want to use a dedicated SSH key for access to be used by GitHub Actions. GitHub Actions will need the *private* SSH key within a GitHub Secret to authenticate. This can be done via ssh-keygen and copying the public key to the authorized clients on the server.

To let your server handle multiple ServiceStack applications and automate the generation and management of TLS certificates, an additional docker-compose file is provided in this template, `nginx-proxy-compose.yml`. This docker-compose file is ready to run and can be copied to the deployment server.

For example, once copied to remote `~/nginx-proxy-compose.yml`, the following command can be run on the remote server.

```
docker-compose -f ~/nginx-proxy-compose.yml up -d
```

This will run an nginx reverse proxy along with a companion container that will watch for additional containers in the same docker network and attempt to initialize them with valid TLS certificates.

### GitHub Actions secrets

The `release.yml` uses the following secrets.

| Required Secrets | Description |
| -- | -- |
| `DEPLOY_API` | Hostname used to SSH deploy .NET App to, this can either be an IP address or subdomain with A record pointing to the server |
| `DEPLOY_USERNAME` | Username to log in with via SSH e.g, **ubuntu**, **ec2-user**, **root** |
| `DEPLOY_KEY` | SSH private key used to remotely access deploy .NET App |
| `LETSENCRYPT_EMAIL` | Email required for Let's Encrypt automated TLS certificates |

To also enable deploying static assets to a CDN:

| Optional Secrets | Description |
| -- | -- |
| `DEPLOY_CDN` | Hostname where static **/wwwroot** assets should be deployed to |

These secrets can use the [GitHub CLI](https://cli.github.com/manual/gh_secret_set) for ease of creation. Eg, using the GitHub CLI the following can be set.

```bash
gh secret set DEPLOY_API -b"<DEPLOY_API>"
gh secret set DEPLOY_USERNAME -b"<DEPLOY_USERNAME>"
gh secret set DEPLOY_KEY < key.pem # DEPLOY_KEY
gh secret set LETSENCRYPT_EMAIL -b"<LETSENCRYPT_EMAIL>"
gh secret set DEPLOY_CDN -b"<DEPLOY_CDN>"
```

These secrets are used to populate variables within GitHub Actions and other configuration files.

## UI Deployment

The Next.js `ui` application is built and deployed to GitHub Pages during the `release.yml` workflow process by committing the result of `npm run build` to `gh-pages` branch in the repository.

Variable replacement of `$DEPLOY_API` and `$DEPLOY_CDN` is performed on the following files as a way to coordinate configuration between the `ui` and `api` project.

- `ui/next.config.js` - Set backend .NET API URL for UI App to use 
- `ui/post.build.js` - If exists, run from GitHub Action after `npm run build`

### post.build.js

The `post.build.js` script helps when also publishing `/ui` assets to CDN by first copying the generated 
`index.html` home page into `404.html` in order to enable full page reloads to use SPA client routing:

```js
const fs = require("fs")
const path = require("path")

// Replaced in release.yml with GitHub Actions secrets
const DEPLOY_API = 'https://$DEPLOY_API'
const DEPLOY_CDN = 'https://$DEPLOY_CDN'

const DIST = '../api/Jamstacks/wwwroot'

// 404.html SPA fallback (supported by GitHub Pages, Cloudflare & Netlify CDNs)
fs.copyFileSync(
    path.resolve(`${DIST}/index.html`),
    path.resolve(`${DIST}/404.html`))

// Define Virtual Host for GitHub Pages CDN
fs.writeFileSync(`${DIST}/CNAME`, DEPLOY_CDN)

// Define /api proxy routes (supported by Cloudflare or Netlify CDNs)  
fs.writeFileSync(`${DIST}/_redirects`,
    fs.readFileSync(`${DIST}/_redirects`, 'utf-8')
        .replace(/{DEPLOY_API}/g, DEPLOY_API))
```

Whilst the `_redirects` file is a convention supported by many [popular Jamstack CDNs](https://jamstack.wtf/#deployment)
that sets up a new rule that proxies `/api*` requests to where the production .NET App is deployed to in order 
for API requests to not need CORS:

```
/api/*  {DEPLOY_API}/api/:splat  200
```

By default this template doesn't use the `/api` proxy route & makes CORS API requests so it can be freely hosted 
on GitHub pages CDN.

## Pushing updates and rollbacks

By default, deployments of both the `ui` and `api` occur on commit to your main branch. A new Docker image for your ServiceStack API is produced, pushed to GHCR.io and hosted on your Linux server with Docker Compose.
Your React UI is built and pushed to the repository GitHub Pages.

The template also will run the release process on the creation of a GitHub Release making it easier to switch to manual production releases.

Additionally, the `release.yml` workflow can be run manually specifying a version. This enables production rollbacks based on previously tagged releases.
A release must have already been created for the rollback build to work, it doesn't create a new Docker build based on previous code state, only redeploys as existing Docker image.

## No CORS Hosting Options

The `CorsFeature` needs to be enabled when adopting our recommended deployment configuration of having static
`/wwwroot` assets hosted from a CDN in order to make cross-domain requests to your .NET APIs.

### Using a CDN Proxy
Should you want to, our recommended approach to avoid your App making CORS requests is to define an `/api` proxy route
on your CDN to your `$DEPLOY_API` server.

To better support this use-case, this template includes populating the `_redirects` file used by popular CDNs like
[Cloudflare proxy redirects](https://developers.cloudflare.com/pages/platform/redirects) and
[Netlify proxies](https://docs.netlify.com/routing/redirects/rewrites-proxies/#proxy-to-another-service) to define
redirect and proxy rules. For AWS CloudFront you would need to define a
[Behavior for a custom origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html).

### No CDN

Of course the easiest solution is to not need CORS in the first place by not deploying to a CDN and serving both `/api`
and UI from your .NET App. But this would forgo all the performance & UX benefits that has made
[Jamstack](https://jamstack.org) approach so popular.