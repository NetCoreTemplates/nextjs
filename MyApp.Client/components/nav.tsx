'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
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

export default function Nav() {
    const pathname = usePathname()

    const items:NavItem[] = [
        { href: '/shadcn-ui', name: 'shadcn/ui'},
        { href: '/posts', name: 'Blog'},
        { href: '/todomvc', name: 'Todos'},
        { href: '/bookings-auto', name: 'Bookings'},
        { href: '/features', name: 'Features'},
    ]

    const { user, hasRole, signOut } = appAuth()
    const navClass = (path:string) => [
        "p-4 flex items-center justify-start mw-full hover:text-sky-500 dark:hover:text-sky-400",
        pathname === path || pathname.startsWith(path + '/') ? "text-link-dark dark:text-link-dark" : "",
    ].join(" ")

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
                        const isActive = pathname === x.href || pathname.startsWith(x.href + '/')
                        return (<li key={x.name} className="relative flex flex-wrap just-fu-start m-0">{x.type === 'Button'
                            ? <SecondaryButton className="m-2" href={x.href} onClick={x.onClick}>{x.name}</SecondaryButton>
                            : x.type == 'PrimaryButton'
                                ? <PrimaryButton className="m-2" href={x.href} onClick={x.onClick}>{x.name}</PrimaryButton>
                                : (<Link href={x.href!} className={`flex items-center justify-start mw-full p-4 text-gray-700 dark:text-gray-200 hover:text-success transition-colors${isActive ? ' text-success font-semibold': ''}`}>
                                    {x.name}
                                   </Link>)}
                            </li>)
                    })}
                        {user
                            ? (<>
                                {hasRole('Admin')
                                    ? <li className="relative flex flex-wrap just-fu-start m-0">
                                        <Link href="/admin" className={navClass('/admin')}>Admin</Link>
                                    </li> : null}
                                <li>
                                    <div className="mx-3 relative">
                                        <div>
                                            <Link href="/profile"
                                                  className="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50 dark:lg:hover:bg-gray-900 dark:ring-offset-black"
                                                  id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                                <img className="h-8 w-8 rounded-full" src={user.profileUrl} alt=""/>
                                                <span
                                                    className="hidden ml-3 text-gray-700 dark:text-gray-300 text-sm font-medium lg:block">
                                                <span className="sr-only">Open user menu for </span>
                                                    {user.userName}
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                                <li className="mr-3 relative flex flex-wrap just-fu-start m-0">
                                    <SecondaryButton onClick={() => signOut()}>
                                        Sign Out
                                    </SecondaryButton>
                                </li>
                            </>)
                            : (<li className="relative flex flex-wrap just-fu-start m-0">
                                <SecondaryButton className="m-2">
                                    <Link href="/signin">Sign In</Link>
                                </SecondaryButton>
                            </li>)
                        }
                        <li className="relative flex flex-wrap just-fu-start m-0">
                            <DarkModeToggle />
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>)
}
