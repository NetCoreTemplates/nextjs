import Link from "next/link"
import { useRouter } from "next/router"
import { useAuth, PrimaryButton, SecondaryButton, DarkModeToggle } from "@servicestack/react"
import { appAuth } from "@/lib/auth"

type NavItem = {
    href?:string,
    name:string,
    type?:string,
    show?:string,
    hide?:string,
    onClick?:() => void
}

export default function () {

    const items:NavItem[] = [
        { href: '/shadcn-ui', name: 'shadcn/ui'},
        { href: '/posts', name: 'Blog'},
        { href: '/todomvc', name: 'Todos'},
        { href: '/bookings-auto', name: 'Bookings'},
        { href: '/features', name: 'Features'},
    ]

    const { user, hasRole, signOut } = appAuth()
    const router = useRouter()
    if (user) {
        items.push(...[
            hasRole('Admin') 
                ? { href:"/admin", name:"Admin", show:"role:Admin" }
                : { href:"/profile", name:"Profile" },
            { type:'Button', onClick: () => signOut('/'), name:"Sign Out" },
        ].filter(x => !!x))
    } else {
        items.push({ type:'Button', href:"/signin", name:"Sign In" })
    }

    return (<header className="border-b border-gray-200 dark:border-gray-700 pr-3 bg-white dark:bg-gray-800">
        <div className="flex flex-wrap items-center">
            <div className="flex-shrink flex-grow-0">
                <Link href="/">
                    <div className="p-4 cursor-pointer"><img className="w-8 h-8" src="/assets/img/logo.svg" alt="MyApp logo" /></div>
                </Link>
            </div>
            <div className="flex flex-grow flex-shrink flex-nowrap justify-end items-center">
                <nav className="relative flex flex-grow">
                    <ul className="flex flex-wrap items-center justify-end w-full m-0">
                    {items.map(x => {
                        const isActive = router.asPath === x.href || router.asPath.startsWith(x.href + '/')
                        return (<li key={x.name} className="relative flex flex-wrap just-fu-start m-0">{x.type === 'Button'
                            ? <SecondaryButton className="m-2" href={x.href} onClick={x.onClick}>{x.name}</SecondaryButton>
                            : x.type == 'PrimaryButton'
                                ? <PrimaryButton className="m-2" href={x.href} onClick={x.onClick}>{x.name}</PrimaryButton>
                                : (<Link href={x.href!} className={`flex items-center justify-start mw-full p-4 text-gray-700 dark:text-gray-200 hover:text-success transition-colors${isActive ? ' text-success font-semibold': ''}`}>
                                    {x.name}
                                   </Link>)}
                            </li>)
                    })}
                        <li className="relative flex flex-wrap just-fu-start m-0">
                            <DarkModeToggle />
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>)
}
