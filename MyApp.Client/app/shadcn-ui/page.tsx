import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import ShadcnUi from './shadcn-ui'

export const metadata: Metadata = {
    title: 'shadcn/ui',
}

// Every component installed in components/ui, so this list stays in sync as components are added
const installedComponents = fs
    .readdirSync(path.join(process.cwd(), 'components/ui'))
    .filter((file) => file.endsWith('.tsx'))
    .map((file) => file.replace('.tsx', ''))
    .sort()

export default function Page() {
    return <ShadcnUi installedComponents={installedComponents} />
}
