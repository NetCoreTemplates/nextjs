import { AppProps } from "next/app"
import "../styles/index.css"
import "../styles/main.css"
import "prismjs/themes/prism-tomorrow.css"

import Link from 'next/link'
import { setLinkComponent, Loading, ClientContext } from '@servicestack/react'
import { client, init } from "@/lib/gateway"
import { useEffect } from "react";

// Adapter component to convert react-router 'to' prop to Next.js 'href' prop
const NextLink = ({ to, ...props }: any) => <Link href={to || props.href} {...props} />

setLinkComponent(NextLink)

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    (async () => init())()
  }, [])
  return (
      <ClientContext.Provider value={client}>
        <Component {...pageProps} />
      </ClientContext.Provider>)
}
