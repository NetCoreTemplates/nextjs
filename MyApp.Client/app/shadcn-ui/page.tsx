import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Terminal, Rocket, Package, ExternalLink, Info, Download, Code2 } from "lucide-react"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'shadcn/ui Components',
}

export default function ShadcnUiDemo() {
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
                    <div className="flex flex-wrap gap-4">
                        <Button>Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                        <Button size="icon">
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </section>

                {/* Card Demo */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Getting Started</CardTitle>
                                <CardDescription>Start building your next project with shadcn/ui</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Install components with a simple CLI command and customize them to match your design system.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">
                                    <Rocket className="mr-2 h-4 w-4" />
                                    Get Started
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Components</CardTitle>
                                <CardDescription>50+ components and growing</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Access a wide range of professionally designed components that are fully customizable and accessible.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">
                                    <Package className="mr-2 h-4 w-4" />
                                    View All
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </section>

                {/* Tabs Demo */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Tabs</h2>
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="features">Features</TabsTrigger>
                            <TabsTrigger value="documentation">Documentation</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Overview</CardTitle>
                                    <CardDescription>A quick overview of shadcn/ui</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        shadcn/ui is a collection of re-usable components built using Radix UI and Tailwind CSS.
                                        It's not a component library. It's a collection of components that you can copy and paste into your apps.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="features" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Features</CardTitle>
                                    <CardDescription>Key features of shadcn/ui</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-4 w-4 text-blue-500" />
                                        <span className="text-gray-700 dark:text-gray-300">Fully accessible components</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Info className="h-4 w-4 text-blue-500" />
                                        <span className="text-gray-700 dark:text-gray-300">Customizable with Tailwind CSS</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Info className="h-4 w-4 text-blue-500" />
                                        <span className="text-gray-700 dark:text-gray-300">Copy and paste components</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="documentation" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Documentation</CardTitle>
                                    <CardDescription>Learn more about shadcn/ui</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Visit the official documentation to learn how to install and use these components in your project.
                                    </p>
                                    <Button variant="outline">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        View Documentation
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </section>

                {/* Accordion Demo */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Accordion</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Is it accessible?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It adheres to the WAI-ARIA design pattern and uses Radix UI primitives.
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
                                Yes. It's animated by default with smooth transitions using Tailwind CSS.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                {/* Badge Demo */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Badges</h2>
                    <div className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                    </div>
                </section>

                <section className="mb-12">
                    <Alert className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
                        <Code2 className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                        <AlertTitle className="text-blue-900 dark:text-blue-100">Code Example</AlertTitle>
                        <AlertDescription className="text-blue-700 dark:text-blue-300">
                            All these components are available in your project. You can customize them by editing the component files
                            in the components/ui directory.
                        </AlertDescription>
                    </Alert>
                </section>
                </div>
            </main>
        </Layout>
    )
}
