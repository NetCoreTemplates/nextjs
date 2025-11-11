import Document, { Html, Head, Main, NextScript } from "next/document"

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="h-full">
        <Head />
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
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
