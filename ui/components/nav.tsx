import Link from 'next/link'
import { useRouter } from 'next/router'
import useAuth from '../lib/useAuth'
import { PrimaryButton, Button } from './form'

type NavItem = { 
    href?:string, 
    name:string, 
    type?:string,
    show?:string,
    hide?:string,
    onClick?:(e:any) => void
}

export default function () {

    const items:NavItem[] = [
        { href: '/about', name: 'About'},
    ]

    const { auth, attrs, signout } = useAuth()
    const router = useRouter()
    if (auth) {
        items.push(...[
            { href:"/profile", name:"Profile" },
            { href:"/admin", name:"Admin", show:"role:Admin" },
            { type:'Button', onClick: (e:any) => signout('/'), name:"Sign Out" },
        ])
    } else {
        items.push({ type:'Button', href:"/signin", name:"Sign In" })
        items.push({ type:'PrimaryButton', href:"/signup", name:"Register" })
    }
    const showItems = items.filter(x => {
        if (x.show && attrs.indexOf(x.show) === -1) return false
        if (x.hide && attrs.indexOf(x.hide) >= 0) return false
        return true
    })

    return (<header className="border-b border-gray-200 pr-3">
        <div className="flex flex-wrap items-center">
            <div className="flex-shrink flex-grow-0">
                <Link href="/">
                    <div className="p-4 cursor-pointer"><img src="/favicon/favicon-32x32.png" alt="MyApp logo" /></div>
                </Link>
            </div>
            <div className="flex flex-grow flex-shrink flex-nowrap justify-end items-center">
                <nav className="relative flex flex-grow">
                    <ul className="flex flex-wrap items-center justify-end w-full m-0">
                    {showItems.map(x => <li key={x.name} className="relative flex flex-wrap just-fu-start m-0">{x.type === 'Button'
                        ? <Button className="mx-2" href={x.href} onClick={x.onClick}>{x.name}</Button>
                        : x.type == 'PrimaryButton'
                            ? <PrimaryButton className="mx-2" href={x.href} onClick={x.onClick}>{x.name}</PrimaryButton>
                            : (<Link href={x.href!}>
                                <a className={`flex items-center justify-start mw-full p-4 hover:text-success${router.asPath === x.href ? ' text-success': ''}`}>{x.name}</a>
                                </Link>)}
                        </li>)}
                    </ul>
                </nav>
            </div>
        </div>
    </header>)
}
