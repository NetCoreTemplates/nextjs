import React from "react";
import { lastRightPart, combinePaths } from "@servicestack/client"

type SrcLink = {
    href:string
    iconSrc?:string
    children?: React.ReactNode
}
export default ({ href, iconSrc, children } : SrcLink) => {
    const baseUrl = "https://github.com/NetCoreTemplates/nextjs/blob/main"
    const url = href.includes('://') ? href : combinePaths(baseUrl, href)
    const fileName = lastRightPart(href, '/')
    return iconSrc
        ? (<a href={url} className="mr-3 text-gray-500 hover:text-gray-600 text-decoration-none">
            <img src={iconSrc} className="w-5 h-5 inline-flex text-purple-800 mr-1" alt="file icon"/>{fileName}</a>)
        : (<a href={url} className="mr-3 text-gray-400 hover:text-gray-500 text-decoration-none">
            {children} {fileName}</a>)
}
