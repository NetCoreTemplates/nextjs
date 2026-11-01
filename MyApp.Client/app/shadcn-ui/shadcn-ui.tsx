'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useClient } from '@servicestack/react'
import { ApiResult } from '@servicestack/client'
import {
    CircleAlertIcon,
    CloudOffIcon,
    CodeXmlIcon,
    CopyIcon,
    DownloadIcon,
    ExternalLinkIcon,
    InfoIcon,
    MoreHorizontalIcon,
    PackageIcon,
    PanelRightOpenIcon,
    PlusIcon,
    RocketIcon,
    SparklesIcon,
    TerminalIcon,
    TrashIcon,
} from 'lucide-react'

import Layout from '@/components/layout'
import SrcPage from '@/components/src-page'
import DataTable, { type ColumnDef } from '@/components/data-table'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CreateTodo, Forecast, GetWeatherForecast, Hello, HelloResponse, Todo } from '@/lib/dtos'

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <section className="mb-14">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            {description && <p className="mt-1 mb-5 text-muted-foreground">{description}</p>}
            {!description && <div className="mb-5" />}
            {children}
        </section>
    )
}

function Code({ children }: { children: React.ReactNode }) {
    return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{children}</code>
}

// Calls the Hello API as you type, showing a Skeleton while it loads
function HelloApiCard() {
    const client = useClient()
    const [name, setName] = useState('shadcn/ui')
    const [api, setApi] = useState<ApiResult<HelloResponse>>(new ApiResult())

    useEffect(() => {
        void (async () => {
            setApi(new ApiResult())
            setApi(await client.api(new Hello({ name })))
        })()
    }, [name])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Live API</CardTitle>
                <CardDescription>
                    Calls the <Code>Hello</Code> API as you type
                </CardDescription>
                <CardAction>
                    <Badge variant="secondary">GET</Badge>
                </CardAction>
            </CardHeader>
            <CardContent>
                <Field>
                    <FieldLabel htmlFor="hello-name">Name</FieldLabel>
                    <Input id="hello-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </Field>
            </CardContent>
            <CardFooter className="min-h-9">
                {api.error ? (
                    <p className="text-sm text-destructive">{api.error.message}</p>
                ) : api.succeeded ? (
                    <p className="text-lg font-semibold">{api.response!.result}</p>
                ) : (
                    <Skeleton className="h-6 w-48" />
                )}
            </CardFooter>
        </Card>
    )
}

// Submits CreateTodo, mapping ServiceStack validation errors to Field + FieldError
function ValidationCard() {
    const client = useClient()
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [api, setApi] = useState<ApiResult<Todo>>(new ApiResult())
    const textError = api.fieldError('text')

    const submit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const result = await client.api(new CreateTodo({ text }))
        setLoading(false)
        setApi(result)
        if (result.succeeded) setText('')
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Validation</CardTitle>
                <CardDescription>
                    Form validation errors from the <Code>CreateTodo</Code> API
                </CardDescription>
                <CardAction>
                    <Badge variant="secondary">POST</Badge>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form id="todo-form" onSubmit={submit}>
                    <FieldGroup>
                        <Field data-invalid={!!textError}>
                            <FieldLabel htmlFor="todo-text">New Todo</FieldLabel>
                            <Input id="todo-text" value={text} onChange={(e) => setText(e.target.value)} aria-invalid={!!textError} />
                            {textError ? (
                                <FieldError errors={[textError]} />
                            ) : (
                                <FieldDescription>Submit it empty to see the server's validation error.</FieldDescription>
                            )}
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="gap-3">
                <Button type="submit" form="todo-form" disabled={loading}>
                    {loading ? <Spinner /> : <PlusIcon />}
                    Add Todo
                </Button>
                {api.succeeded && (
                    <p className="text-sm text-muted-foreground">
                        Added #{api.response!.id}, see{' '}
                        <Link href="/todomvc" className="font-medium text-primary underline-offset-4 hover:underline">
                            Todos
                        </Link>
                    </p>
                )}
            </CardFooter>
        </Card>
    )
}

// TanStack Table + shadcn Table via DataTable, populated by a typed ServiceStack API
function WeatherTable() {
    const client = useClient()
    const [api, setApi] = useState<ApiResult<Forecast[]>>(new ApiResult())
    const [selected, setSelected] = useState<Forecast | null>(null)

    const [attempt, setAttempt] = useState(0)
    const retry = () => {
        setApi(new ApiResult())
        setAttempt(attempt + 1)
    }
    useEffect(() => {
        void (async () => setApi(await client.api(new GetWeatherForecast())))()
    }, [attempt])

    const formatDate = (date?: string) => (date ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date)) : '')
    const columns: ColumnDef<Forecast>[] = [
        { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
        { accessorKey: 'temperatureC', header: 'Temp. (C)', cell: ({ row }) => `${row.original.temperatureC}°` },
        { accessorKey: 'temperatureF', header: 'Temp. (F)', cell: ({ row }) => `${row.original.temperatureF}°` },
        { accessorKey: 'summary', header: 'Summary', cell: ({ row }) => <Badge variant="outline">{row.original.summary}</Badge> },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Row actions" />}>
                            <MoreHorizontalIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Forecast</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setSelected(row.original)}>
                                    <PanelRightOpenIcon /> View details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => void navigator.clipboard?.writeText(JSON.stringify(row.original, null, 2))}>
                                    <CopyIcon /> Copy as JSON
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ]

    return (
        <>
            {api.error ? (
                <Empty className="border">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <CloudOffIcon />
                        </EmptyMedia>
                        <EmptyTitle>Couldn't load forecasts</EmptyTitle>
                        <EmptyDescription>{api.error.message}</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button variant="outline" onClick={retry}>
                            Try again
                        </Button>
                    </EmptyContent>
                </Empty>
            ) : api.succeeded ? (
                <DataTable data={api.response!} columns={columns} />
            ) : (
                <div className="space-y-2">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            )}

            <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <SheetContent>
                    {selected && (
                        <>
                            <SheetHeader>
                                <SheetTitle>{formatDate(selected.date)}</SheetTitle>
                                <SheetDescription>Forecast returned by GetWeatherForecast</SheetDescription>
                            </SheetHeader>
                            <dl className="grid grid-cols-2 gap-4 px-4 text-sm">
                                <dt className="text-muted-foreground">Summary</dt>
                                <dd className="font-medium">{selected.summary}</dd>
                                <dt className="text-muted-foreground">Celsius</dt>
                                <dd className="font-medium">{selected.temperatureC}°</dd>
                                <dt className="text-muted-foreground">Fahrenheit</dt>
                                <dd className="font-medium">{selected.temperatureF}°</dd>
                            </dl>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}

const themeTokens = ['background', 'foreground', 'primary', 'secondary', 'muted', 'accent', 'destructive', 'border', 'ring']
const chartTokens = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5']

function Swatch({ token }: { token: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="size-10 shrink-0 rounded-md border shadow-xs" style={{ backgroundColor: `var(--${token})` }} />
            <Code>--{token}</Code>
        </div>
    )
}

// installedComponents: every component in components/ui, listed by page.tsx at build time
export default function ShadcnUi({ installedComponents }: { installedComponents: string[] }) {
    return (
        <Layout>
            <div className="mx-auto max-w-7xl px-5 py-8">
                <div className="max-w-4xl">
                    <div className="mb-12">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight">shadcn/ui Components</h1>
                        <p className="mb-4 text-lg text-muted-foreground">
                            Accessible, themeable components from shadcn/ui's <Code>base-vega</Code> style, built on Base UI and Tailwind CSS v4, and connected
                            to this template's typed ServiceStack APIs.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Badge>React 19</Badge>
                            <Badge variant="secondary">Tailwind CSS v4</Badge>
                            <Badge variant="secondary">Base UI</Badge>
                            <Badge variant="outline">TypeScript</Badge>
                        </div>
                    </div>

                    <Section title="API Integration" description="shadcn/ui form components driven by ServiceStack's ApiResult.">
                        <div className="grid gap-6 md:grid-cols-2">
                            <HelloApiCard />
                            <ValidationCard />
                        </div>
                    </Section>

                    <Section
                        title="Data Table"
                        description="The template's DataTable combines TanStack Table with the shadcn/ui Table. Use the row menu to open a Sheet."
                    >
                        <WeatherTable />
                    </Section>

                    <Section title="Buttons & Badges">
                        <div className="space-y-5">
                            <div className="flex flex-wrap items-center gap-3">
                                <Button>Default</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="destructive">
                                    <TrashIcon /> Destructive
                                </Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="link">Link</Button>
                                <Button disabled>
                                    <Spinner /> Loading
                                </Button>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button size="xs">Extra Small</Button>
                                <Button size="sm">Small</Button>
                                <Button>Default</Button>
                                <Button size="lg">Large</Button>
                                <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-6" />
                                {(['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const).map((size) => (
                                    <Tooltip key={size}>
                                        <TooltipTrigger render={<Button size={size} variant="outline" aria-label={`Launch (${size})`} />}>
                                            <RocketIcon />
                                        </TooltipTrigger>
                                        <TooltipContent>size="{size}"</TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge>Default</Badge>
                                <Badge variant="secondary">Secondary</Badge>
                                <Badge variant="destructive">Destructive</Badge>
                                <Badge variant="outline">Outline</Badge>
                                <Badge variant="secondary">
                                    <SparklesIcon /> With Icon
                                </Badge>
                            </div>
                        </div>
                    </Section>

                    <Section title="Overlays" description="Dialog, Sheet, Dropdown Menu and Tooltip are built on Base UI primitives.">
                        <div className="flex flex-wrap gap-3">
                            <Dialog>
                                <DialogTrigger render={<Button variant="outline" />}>Open Dialog</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit with confidence</DialogTitle>
                                        <DialogDescription>Dialogs trap focus, close on Escape, and animate in and out with tw-animate-css.</DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                                        <DialogClose render={<Button />}>Continue</DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Sheet>
                                <SheetTrigger render={<Button variant="outline" />}>Open Sheet</SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Sheet</SheetTitle>
                                        <SheetDescription>A Dialog that slides in from the edge of the screen, on any side.</SheetDescription>
                                    </SheetHeader>
                                    <SheetFooter>
                                        <SheetClose render={<Button />}>Done</SheetClose>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </Section>

                    <Section title="Alerts">
                        <div className="space-y-4">
                            <Alert>
                                <TerminalIcon />
                                <AlertTitle>Heads up!</AlertTitle>
                                <AlertDescription>
                                    <p>
                                        Add more components with <Code>npx shadcn@latest add</Code>.
                                    </p>
                                </AlertDescription>
                            </Alert>
                            <Alert variant="destructive">
                                <CircleAlertIcon />
                                <AlertTitle>Your session has expired</AlertTitle>
                                <AlertDescription>Please sign in again to continue.</AlertDescription>
                            </Alert>
                        </div>
                    </Section>

                    <Section
                        title="Theming"
                        description="Components use CSS variables defined in styles/index.css. Toggle dark mode in the header to see them change."
                    >
                        <Card>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    {themeTokens.map((token) => (
                                        <Swatch key={token} token={token} />
                                    ))}
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    {chartTokens.map((token) => (
                                        <Swatch key={token} token={token} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Section>

                    <Section title="Tabs">
                        <Tabs defaultValue="overview">
                            <TabsList>
                                <TabsTrigger value="overview">
                                    <InfoIcon /> Overview
                                </TabsTrigger>
                                <TabsTrigger value="installation">
                                    <DownloadIcon /> Installation
                                </TabsTrigger>
                                <TabsTrigger value="usage">
                                    <CodeXmlIcon /> Usage
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>What is shadcn/ui?</CardTitle>
                                        <CardDescription>Open code you own, not a dependency</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-4 md:grid-cols-3">
                                        {[
                                            ['Accessible', 'Built on Base UI primitives that follow WAI-ARIA patterns'],
                                            ['Themeable', 'Styled with Tailwind CSS v4 and CSS variables'],
                                            ['Open Code', 'Components live in your project, so you can change anything'],
                                        ].map(([title, text]) => (
                                            <div key={title} className="rounded-lg border bg-muted/40 p-4">
                                                <p className="font-medium">{title}</p>
                                                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="installation">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Already installed</CardTitle>
                                        <CardDescription>
                                            These components are in <Code>components/ui</Code>, configured by <Code>components.json</Code>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {installedComponents.map((name) => (
                                                <Badge key={name} variant="secondary">
                                                    {name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="usage">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>How to use</CardTitle>
                                        <CardDescription>Import components from @/components/ui</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <pre className="overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm">
                                            {`import { Button } from '@/components/ui/button'

export default function Page() {
    return <Button variant="outline">Click me</Button>
}`}
                                        </pre>
                                        <div className="flex flex-wrap gap-2">
                                            <Button>Primary</Button>
                                            <Button variant="outline">Click me</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </Section>

                    <Section title="Accordion">
                        <Accordion className="w-full">
                            <AccordionItem value="accessible">
                                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                                <AccordionContent>Yes. It follows the WAI-ARIA design pattern and is built on Base UI primitives.</AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="styled">
                                <AccordionTrigger>How do I change the theme?</AccordionTrigger>
                                <AccordionContent>
                                    Edit the CSS variables in <Code>styles/index.css</Code>. Light mode uses <Code>:root</Code> and dark mode uses{' '}
                                    <Code>.dark</Code>.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="animated">
                                <AccordionTrigger>Is it animated?</AccordionTrigger>
                                <AccordionContent>Yes. Accordions, dialogs, sheets and menus animate with tw-animate-css.</AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </Section>

                    <Section title="Get More Components">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PackageIcon className="size-5" />
                                    Explore the Full Component Library
                                </CardTitle>
                                <CardDescription>This project includes {installedComponents.length} of the 50+ components shadcn/ui offers.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ol className="list-inside list-decimal space-y-2 text-sm">
                                    <li>Browse the components in the shadcn/ui docs</li>
                                    <li>
                                        Add one from <Code>MyApp.Client</Code>, e.g. <Code>npx shadcn@latest add select</Code>
                                    </li>
                                    <li>
                                        Import it from <Code>@/components/ui/select</Code>
                                    </li>
                                </ol>
                            </CardContent>
                            <CardFooter className="flex flex-wrap gap-3">
                                <a href="https://ui.shadcn.com/docs/components" target="_blank" rel="noopener noreferrer" className={buttonVariants()}>
                                    Browse Components <ExternalLinkIcon />
                                </a>
                                <a
                                    href="https://ui.shadcn.com/blocks"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={buttonVariants({ variant: 'outline' })}
                                >
                                    Blocks <ExternalLinkIcon />
                                </a>
                                <a
                                    href="https://ui.shadcn.com/docs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={buttonVariants({ variant: 'outline' })}
                                >
                                    Documentation <ExternalLinkIcon />
                                </a>
                            </CardFooter>
                        </Card>
                    </Section>

                    <div className="flex justify-center">
                        <SrcPage path="shadcn-ui/shadcn-ui.tsx" />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
