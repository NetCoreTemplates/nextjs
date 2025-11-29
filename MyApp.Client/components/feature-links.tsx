"use client";

import { usePathname } from "next/navigation"
import { TextLink } from "@servicestack/react"

export default () => {
    const pathname = usePathname()
    const navClass = (path: string) => [
        "text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50",
        pathname?.startsWith(path) ? "font-bold" : "",
    ].join(" ")

    return (
        <nav className="pt-8 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
            <div className="pb-6">
                <TextLink href="/chat" className={navClass("/chat")}>AI Chat</TextLink>
            </div>
            <div className="pb-6">
                <TextLink href="/scalar" className={navClass("/scalar")}>Scalar UI</TextLink>
            </div>
            <div className="pb-6">
                <TextLink href="/ui" className={navClass("/ui")}>API Explorer</TextLink>
            </div>
            <div className="pb-6">
                <TextLink href="/admin-ui" className={navClass("/admin-ui")}>Admin UI</TextLink>
            </div>
            <div className="pb-6">
                <TextLink href="/about" className={navClass("/about")}>About</TextLink>
            </div>
            <div className="pb-6">
                <TextLink href="/posts" className={navClass("/posts")}>Archive</TextLink>
            </div>
            <div className="pb-6">
                <TextLink href="/privacy" className={navClass("/privacy")}>Privacy</TextLink>
            </div>
        </nav>
    )
}
