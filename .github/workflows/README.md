# ServiceStack GitHub Actions
The `release.yml` file is designed to provide a CI deployment to a dedicated server with SSH access, Docker and Docker Compose.

## Overview
A docker image is built and stored on GitHub's `ghcr.io` docker registry when a GitHub Release is created.

These packages can be viewed under your user or organization, and once deployed will be linked to the associated repository.

GitHub Actions specified in `release.yml` then copy files remotely via scp and use `docker-compose` to run the app remotely via SSH.

## Deployment server setup
To get this working, a server needs to be setup with the following:

- SSH access
- docker
- docker-compose
- ports 443 and 80 for web access of your hosted application

This can be your own server or any cloud hosted server like Digital Ocean, AWS, Azure etc. 

When setting up your server, you'll want to use a dedicated SSH key for access to be used by GitHub Actions. GitHub Actions will need the *private* SSH key within a GitHub Secret to authenticate. This can be done via ssh-keygen and copying the public key to the authorized clients on the server.

To let your server handle multiple ServiceStack applications and automate the generation and management of TLS certificates, an additional docker-compose file is provided via the `x mix` template, `nginx-proxy-compose.yml`. This docker-compose file is ready to run and can be copied to the deployment server.

For example, once copied to remote `~/nginx-proxy-compose.yml`, the following command can be run on the remote server.

```
docker-compose -f ~/nginx-proxy-compose.yml up -d
```

This will run an nginx reverse proxy along with a companion container that will watch for additional containers in the same docker network and attempt to initialize them with valid TLS certificates.

## GitHub Repository setup
The `release.yml` uses the following secrets.

- DEPLOY_API - hostname used to SSH to your server. Should match URL used to access your app.
- DEPLOY_CDN - hostname of where your static files will be hosted. This is optional, only used if you are deploying static front end separately to CDN.
- DEPLOY_USERNAME - the username being logged into via SSH. Eg, `ubuntu`, `ec2-user`, `root` etc.
- DEPLOY_KEY - SSH private key used to remotely access deploy server/app host.
- LETSENCRYPT_EMAIL - Email address, required for Let's Encrypt automated TLS certificates.

These secrets can use the [GitHub CLI](https://cli.github.com/manual/gh_secret_set) for ease of creation.

These secrets are used to populate variables within GitHub Actions and other configuration files.

## What's the process of `release.yml`?

![](https://raw.githubusercontent.com/ServiceStack/docs/master/docs/images/mix/release-ghr-vanilla-diagram.png)


## Pushing updates and rollbacks

By default, deployments of both the `ui` and `api` occur on commit to your main branch. A new Docker image for your ServiceStack API is produced, pushed to GHCR.io and hosted on your Linux server with Docker Compose.
Your UI is built and pushed to the repository GitHub Pages.

The template also will run the release process on the creation of a GitHub Release making it easier to switch to manual production releases.

Additionally, the `release.yml` workflow can be run manually specifying a version. This enables production rollbacks based on previously tagged releases.
A release must have already been created for the rollback build to work, it doesn't create a new Docker build based on previous code state, only redeploys as existing Docker image.
