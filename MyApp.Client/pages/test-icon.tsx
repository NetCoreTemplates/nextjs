import { Icon } from "@iconify/react"
import Page from "@/components/layout-page"
import SrcPage from "@/components/src-page"

export default function TestIcon() {
    return (
        <Page title="Icon Test">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Testing Icons</h2>
                
                <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">Direct Icon Usage:</h3>
                    <Icon icon="mdi:react" className="w-8 h-8 text-blue-500" />
                    <Icon icon="mdi:home" className="w-8 h-8 text-green-500" />
                    <Icon icon="mdi:check" className="w-8 h-8 text-red-500" />
                </div>

                <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">SrcPage Component:</h3>
                    <SrcPage path="/test.tsx" />
                </div>

                <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">Inline SVG (for comparison):</h3>
                    <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"/>
                    </svg>
                </div>
            </div>
        </Page>
    )
}

