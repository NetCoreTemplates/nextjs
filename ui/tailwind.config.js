const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./components/**/*.tsx', './pages/**/*.{tsx,mdx,md}', './_posts/**/*.md'],
  theme: {
    extend: {
      colors: {
        'accent-1': '#FAFAFA',
        'accent-2': '#EAEAEA',
        'accent-7': '#333',
        success: '#0070f3',
        cyan: '#79FFE1',
      },
      spacing: {
        28: '7rem',
      },
      letterSpacing: {
        tighter: '-.04em',
      },
      lineHeight: {
        tight: 1.2,
      },
      fontSize: {
        '5xl': '2.5rem',
        '6xl': '2.75rem',
        '7xl': '4.5rem',
        '8xl': '6.25rem',
      },
      boxShadow: {
        small: '0 5px 10px rgba(0, 0, 0, 0.12)',
        medium: '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      // https://github.com/tailwindlabs/tailwindcss-typography
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'pre': {
              overflowX: 'auto',
              maxWidth: 'calc(100vw - 1rem)'
            },
            code: {
              color: theme('colors.blue.500'),
              backgroundColor: theme('colors.blue.50'),
              fontWeight: 'normal',
              borderRadius: '.25rem',
              padding: '.25em .5rem',
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              'color': 'inherit',
              'fontWeight': '500',
              'textDecoration': 'underline',
              '&:hover': {
                opacity: .8,
                color: theme('colors.gray.600'),
              },
            },
            b: { color: 'inherit' },
            strong: { color: 'inherit' },
            em: { color: 'inherit' },
            h1: { color: 'inherit' },
            h2: { color: 'inherit' },
            h3: { color: 'inherit' },
            h4: { color: 'inherit' },
          }
        }
      }),
    },
  },
  plugins: [
      require("@tailwindcss/typography"),
      require('@tailwindcss/forms'),
  ],
}
