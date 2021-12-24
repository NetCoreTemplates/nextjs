import React from "react";
import { lastRightPart } from "@servicestack/client";

type SrcLink = {
    href:string
    iconSrc?:string
    children?: React.ReactNode
}
export default function SrcLink({ href, iconSrc, children } : SrcLink) {
    const fileName = lastRightPart(href, '/')
    return iconSrc 
        ? (<a href={href} className="mr-3 text-gray-500 hover:text-gray-600 text-decoration-none">
            <img src={iconSrc} className="w-5 h-5 inline-flex text-purple-800 mr-1" alt="file icon"/>{fileName}</a>)
        : (<a href={href} className="mr-3 text-gray-400 hover:text-gray-500 text-decoration-none">
            {children} {fileName}</a>)
}
