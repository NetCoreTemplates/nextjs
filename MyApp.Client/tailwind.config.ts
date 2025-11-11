import type { Config } from 'tailwindcss'

const config: Config = {
  content: {
    files: [
      './components/**/*.{tsx,ts,jsx,js}',
      './pages/**/*.{tsx,ts,jsx,js,mdx,md}',
      './_posts/**/*.md',
    ],
  },
}

export default config

