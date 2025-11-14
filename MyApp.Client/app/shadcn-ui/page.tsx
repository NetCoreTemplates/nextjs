import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Terminal, Rocket, Package, ExternalLink, Info, Download, Code2 } from "lucide-react"

const ShadcnUiDemo = () => {
    return (
        <Layout>
            <main className="max-w-7xl mx-auto px-5 py-8">
                <div className="max-w-4xl">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        shadcn/ui Components
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                        A collection of beautifully designed, accessible components built with Radix UI and Tailwind CSS.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        <Badge>React</Badge>
                        <Badge variant="secondary">TypeScript</Badge>
                        <Badge variant="outline">Tailwind CSS</Badge>
                    </div>
                </div>

                {/* Alert Demo */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Alerts</h2>
                    <div className="space-y-4">
                        <Alert className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                            <Terminal className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                            <AlertTitle className="text-slate-900 dark:text-slate-100">Heads up!</AlertTitle>
                            <AlertDescription className="text-slate-700 dark:text-slate-300">
                                You can add components and dependencies to your app using the CLI.
                            </AlertDescription>
                        </Alert>
                        <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                Your session has expired. Please log in again.
                            </AlertDescription>
                        </Alert>
                    </div>
                </section>

                {/* Button Demo */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Buttons</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button>Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                        <Button size="sm">Small</Button>
                        <Button size="lg">Large</Button>
                        <Button size="icon">
                            <Rocket className="h-4 w-4" />
                        </Button>
                    </div>
                </section>

                {/* Card Demo */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-slate-900 dark:text-slate-100">Card Title</CardTitle>
                                <CardDescription className="text-slate-600 dark:text-slate-400">Card Description</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700 dark:text-slate-300">This is a simple card component with header, content, and footer sections.</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">Action</Button>
                            </CardFooter>
                        </Card>
                        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-slate-900 dark:text-slate-100">Features</CardTitle>
                                <CardDescription className="text-slate-600 dark:text-slate-400">What you get</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <Badge variant="secondary">✓</Badge>
                                        <span className="text-slate-700 dark:text-slate-300">Accessible</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Badge variant="secondary">✓</Badge>
                                        <span className="text-slate-700 dark:text-slate-300">Customizable</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Badge variant="secondary">✓</Badge>
                                        <span className="text-slate-700 dark:text-slate-300">Open Source</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-slate-900 dark:text-slate-100">Stats</CardTitle>
                                <CardDescription className="text-slate-600 dark:text-slate-400">Your metrics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Components</span>
                                        <span className="font-semibold text-slate-900 dark:text-slate-100">50+</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Downloads</span>
                                        <span className="font-semibold text-slate-900 dark:text-slate-100">1M+</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Tabs Demo */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Tabs</h2>
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 lg:w-[600px] bg-white dark:bg-slate-800">
                                <TabsTrigger value="overview" className="flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    <span>Overview</span>
                                </TabsTrigger>
                                <TabsTrigger value="installation" className="flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    <span>Installation</span>
                                </TabsTrigger>
                                <TabsTrigger value="usage" className="flex items-center gap-2">
                                    <Code2 className="h-4 w-4" />
                                    <span>Usage</span>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="mt-6">
                                <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg border-slate-200 dark:border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900 dark:text-slate-100">What is shadcn/ui?</CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            A modern component library for React applications
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-slate-700 dark:text-slate-300">
                                            shadcn/ui is a collection of re-usable components that you can copy and paste into your apps.
                                            It's built with Radix UI and Tailwind CSS, providing accessible and customizable components.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                            <div className="flex flex-col items-center text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                                                <Badge className="mb-2 bg-blue-600 hover:bg-blue-700">Accessible</Badge>
                                                <p className="text-sm text-slate-800 dark:text-slate-300 font-medium">Built with Radix UI primitives</p>
                                            </div>
                                            <div className="flex flex-col items-center text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800 rounded-lg">
                                                <Badge className="mb-2 bg-purple-600 hover:bg-purple-700">Customizable</Badge>
                                                <p className="text-sm text-slate-800 dark:text-slate-300 font-medium">Fully styled with Tailwind CSS</p>
                                            </div>
                                            <div className="flex flex-col items-center text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-lg">
                                                <Badge className="mb-2 bg-green-600 hover:bg-green-700">Open Source</Badge>
                                                <p className="text-sm text-slate-800 dark:text-slate-300 font-medium">Free to use and modify</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="installation" className="mt-6">
                                <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg border-slate-200 dark:border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900 dark:text-slate-100">Installation Guide</CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            Components are already set up in this project
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                                            <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <AlertTitle className="text-blue-900 dark:text-blue-100">Already Installed!</AlertTitle>
                                            <AlertDescription className="text-blue-900 dark:text-blue-200">
                                                All components shown here are already installed in the <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded text-blue-950 dark:text-blue-100">components/ui</code> directory.
                                            </AlertDescription>
                                        </Alert>
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Available Components:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100">Button</Badge>
                                                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100">Card</Badge>
                                                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100">Alert</Badge>
                                                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100">Tabs</Badge>
                                                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100">Accordion</Badge>
                                                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100">Badge</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="usage" className="mt-6">
                                <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg border-slate-200 dark:border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900 dark:text-slate-100">How to Use</CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            Import and use components in your pages
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Basic Example:</h4>
                                            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                                <code className="text-sm text-slate-900 dark:text-slate-200 font-mono">
                                                    <div>import &#123; Button &#125; from "@/components/ui/button"</div>
                                                    <div className="mt-2">export default function Page() &#123;</div>
                                                    <div className="ml-4">return &lt;Button&gt;Click me&lt;/Button&gt;</div>
                                                    <div>&#125;</div>
                                                </code>
                                            </div>
                                        </div>
                                        <div className="space-y-3 pt-4">
                                            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Try it out:</h4>
                                            <div className="flex gap-2 flex-wrap">
                                                <Button>Primary Button</Button>
                                                <Button variant="outline">Outline Button</Button>
                                                <Button variant="secondary">Secondary Button</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>

                {/* Accordion Demo */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Accordion</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Is it accessible?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It adheres to the WAI-ARIA design pattern and is built with Radix UI primitives.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Is it styled?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It comes with default styles that you can customize with Tailwind CSS.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Is it animated?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It's animated by default with smooth transitions using Tailwind CSS animations.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                {/* Getting More Components */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        Get More Components
                    </h2>
                    <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                                <Package className="h-5 w-5" />
                                Explore the Full Component Library
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                This demo includes just a few popular components. shadcn/ui offers 50+ components.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">How to Add More Components:</h3>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                    <li>Visit the official shadcn/ui documentation</li>
                                    <li>Browse the components you need</li>
                                    <li>Copy the component code from the docs</li>
                                    <li>Paste it into your <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-900 dark:text-slate-100">components/ui</code> directory</li>
                                    <li>Install any required dependencies (if prompted)</li>
                                </ol>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-4">
                            <Button asChild>
                                <a href="https://ui.shadcn.com/docs/components" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    Browse Components
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    Documentation
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>
                </section>

                </div>
            </main>
        </Layout>
    )
}

export default ShadcnUiDemo
