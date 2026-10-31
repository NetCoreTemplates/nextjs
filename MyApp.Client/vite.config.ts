// Vite+ tool config (lint, fmt, test). Next.js builds the app, this file is never used to build it
import { defineConfig, lazyPlugins } from 'vite-plus'
import react from '@vitejs/plugin-react'

// Generated on .NET App startup (`dtos` StartupTask) and by Next.js, never lint or format
const generated = ['lib/dtos.ts', 'next-env.d.ts']
// Markdown/MDX content
const content = ['_posts/**', '**/*.{md,mdx}']

export default defineConfig({
    // lazyPlugins skips loading plugins for `vp check/lint/fmt`, react() is only used by tests
    plugins: lazyPlugins(() => [react()]),
    resolve: {
        alias: {
            '@': import.meta.dirname,
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './vitest.setup.ts',
    },
    lint: {
        ignorePatterns: ['dist/**', '.next/**', 'public/**', ...content, ...generated],
        plugins: ['oxc', 'typescript', 'unicorn', 'react', 'nextjs'],
        categories: {
            correctness: 'error', // ~ eslint:recommended
        },
        env: { browser: true, builtin: true },
        rules: {
            // typescript-eslint recommended
            'typescript/ban-ts-comment': 'error',
            'typescript/no-duplicate-enum-values': 'error',
            'typescript/no-empty-object-type': 'error',
            'typescript/no-explicit-any': 'warn', // pervasive in AutoQueryGrid slot props
            'typescript/no-extra-non-null-assertion': 'error',
            'typescript/no-misused-new': 'error',
            'typescript/no-namespace': 'error',
            'typescript/no-non-null-asserted-optional-chain': 'error',
            'typescript/no-require-imports': 'error',
            'typescript/no-this-alias': 'error',
            'typescript/no-unnecessary-type-constraint': 'error',
            'typescript/no-unsafe-declaration-merging': 'error',
            'typescript/no-unsafe-function-type': 'error',
            'typescript/no-wrapper-object-types': 'error',
            'typescript/prefer-as-const': 'error',
            'typescript/prefer-namespace-keyword': 'error',
            'typescript/triple-slash-reference': 'error',
            // eslint-plugin-react-hooks recommended
            'react/rules-of-hooks': 'error',
            'react/exhaustive-deps': 'warn',
            // static export serves images unoptimized (next.config.mjs), so <img> is intended
            'nextjs/no-img-element': 'off',
            // new in Oxlint's correctness category, not in a previous ESLint config
            'typescript/no-floating-promises': 'warn',
            'react/purity': 'warn',
        },
        options: {
            typeAware: true,
            typeCheck: true, // replaces `tsc`
        },
    },
    fmt: {
        semi: false,
        singleQuote: true,
        tabWidth: 4,
        printWidth: 160,
        ignorePatterns: ['dist/**', '.next/**', 'public/**', ...content, ...generated],
        overrides: [
            { files: ['**/*.json'], options: { tabWidth: 2 } }, // match npm's package.json indent
        ],
    },
})
