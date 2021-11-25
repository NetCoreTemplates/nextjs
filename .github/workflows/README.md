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

## GitHub Repository setup
This template pushes the API server dockerized application to GitHub Container Repository. To do this, you will first need to [create a Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) specifically for use by `release.yml` GitHub Actions.

This token will need to have access to `write:packages` to the GitHub Package Registry, which includes the GitHub Container Registry.

The first time the `release.yml` process successfully runs and creates your GitHub Container Repository for your project, you then have the option to [upgrade the workflow to use GITHUB_TOKEN](https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions#upgrading-a-workflow-that-accesses-ghcrio) replacing the `CR_PAT`.

### Required Secrets

The `release.yml` assumes 7 secrets have been setup.

- CR_PAT - GitHub Personal Token with read/write access to packages.
- DEPLOY_CDN - hostname of the static web UI application from `ui` directory in this template.
- DEPLOY_API - hostname used to SSH to, this can either be an IP address or subdomain with A record pointing to the server.
- DEPLOY_PORT - SSH port, usually `22`.
- DEPLOY_USERNAME - the username being logged into via SSH. Eg, `ubuntu`, `ec2-user`, `root` etc.
- DEPLOY_KEY - SSH private key used to remotely access deploy server/app host.
- LETSENCRYPT_EMAIL - Email address, required for Let's Encrypt automated TLS certificates.

These secrets can use the [GitHub CLI](https://cli.github.com/manual/gh_secret_set) for ease of creation. Eg, using the GitHub CLI the following can be set.

```bash
gh secret set CR_PAT -b"<CR_PAT, Container Registry Personal Access Token>"
gh secret set DEPLOY_API -b"<DEPLOY_CDN, domain or subdomain for your `ui` application.>"
gh secret set DEPLOY_API -b"<DEPLOY_API, domain or subdomain for your application and server host.>"
gh secret set DEPLOY_PORT -b"<DEPLOY_PORT, eg SSH port, usually 22>"
gh secret set DEPLOY_USERNAME -b"<DEPLOY_USERNAME, the username being logged into via SSH. Eg, `ubuntu`, `ec2-user`, `root` etc.>"
gh secret set DEPLOY_KEY < key.pem # DEPLOY_KEY, SSH private key used to remotely access deploy server/app host.
gh secret set LETSENCRYPT_EMAIL -b"<LETSENCRYPT_EMAIL, Email address for your TLS certificate generation, eg me@example.com>"
```

These secrets are used to populate variables within GitHub Actions and other configuration files.

## UI Deployment
The NextJS `ui` application is built and deployed to GitHub Pages during the `release.yml` workflow process by committing the result of `next build && next export` to `gh-pages` branch in the repository.

Variable replacement of `$PROD_API` and `$PROD_CDN` is performed on the following files as a way to coordinate configuration between the `ui` and `api` project.

- `ui/next.config.js` - Config for `JsonServiceClient`
- `ui/public/CNAME` - Config for GitHub Pages
- `api/MyApp/Configure.AppHost.cs` - Config for CORS support

## Pushing updates and rollbacks

By default, deployments of both the `ui` and `api` occur on commit to your main branch. A new Docker image for your ServiceStack API is produced, pushed to GHCR.io and hosted on your Linux server with Docker Compose.
Your NextJS UI is built and pushed to the repository GitHub Pages.

The template also will run the release process on the creation of a GitHub Release making it easier to switch to manual production releases.

Additionally, the `release.yml` workflow can be run manually specifying a version. This enables production rollbacks based on previously tagged releases.
A release must have already been created for the rollback build to work, it doesn't create a new Docker build based on previous code state, only redeploys as existing Docker image.
