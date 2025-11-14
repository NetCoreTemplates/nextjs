import "../styles/index.css"
import "../styles/main.css"
import "../styles/prism-dark-blue.css"
import type { Metadata } from 'next'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Next.js Example',
  description: 'Next.js App Router Example',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head />
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getTheme() {
                  const theme = localStorage.getItem('color-scheme');
                  if (theme) return theme;
                  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                const theme = getTheme();
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
