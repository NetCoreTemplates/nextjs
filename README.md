# .NET 6.0 Next.js + Tailwindcss Template

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/nextjs.png)](https://nextjs.jamstacks.net)
[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/start/nextjs.png)](https://nextjs.jamstacks.net)

> Browse [source code](https://github.com/NetCoreTemplates/nextjs), view live demo [nextjs-api.jamstacks.net](https://nextjs.jamstacks.net) and install with [x new](https://docs.servicestack.net/dotnet-new):

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

```bash
$ dotnet tool install -g x

$ x new nextjs ProjectName
```

## Getting Started

Build Client UI & Run Dev Server

```bash
$ cd ui && npm run build:local
$ npm run dev
```

Run Server .NET Project (New Terminal)

```bash
$ cd api\ProjectName
$ dotnet watch
```

For more, see development workflow docs for 
[JetBrains Rider](https://nextjs.jamstacks.net/posts/rider)
and
[VS Code / VS .NET](https://nextjs.jamstacks.net/posts/vs)

#### Use npm dev server for UI Development

- http://localhost:3000

#### `npm run build:local` to view in .NET App

- https://localhost:5001


## About Next.js

### A statically generated blog example using Next.js, Markdown, and TypeScript

This is the existing [blog-starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter) plus TypeScript.

This example showcases Next.js's [Static Generation](https://nextjs.org/docs/basic-features/pages) feature using Markdown files as the data source.

The blog posts are stored in `/_posts` as Markdown files with front matter support. Adding a new Markdown file in there will create a new blog post.

To create the blog posts we use [`remark`](https://github.com/remarkjs/remark) and [`remark-html`](https://github.com/remarkjs/remark-html) to convert the Markdown files into an HTML string, and then send it down as a prop to the page. The metadata of every post is handled by [`gray-matter`](https://github.com/jonschlinkert/gray-matter) and also sent in props to the page.

## Preview

Preview the example live on [StackBlitz](http://stackblitz.com/):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/blog-starter-typescript)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/blog-starter-typescript&project-name=blog-starter-typescript&repository-name=blog-starter-typescript)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example blog-starter-typescript blog-starter-typescript-app
# or
yarn create next-app --example blog-starter-typescript blog-starter-typescript-app
```

Your blog should be up and running on [http://localhost:3000](http://localhost:3000)! If it doesn't work, post on [GitHub discussions](https://github.com/vercel/next.js/discussions).

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

# Notes

This blog-starter-typescript uses [Tailwind CSS](https://tailwindcss.com). To control the generated stylesheet's filesize, this example uses Tailwind CSS' v2.0 [`purge` option](https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css) to remove unused CSS.

[Tailwind CSS v2.0 no longer supports Node.js 8 or 10](https://tailwindcss.com/docs/upgrading-to-v2#upgrade-to-node-js-12-13-or-higher). To build your CSS you'll need to ensure you are running Node.js 12.13.0 or higher in both your local and CI environments.