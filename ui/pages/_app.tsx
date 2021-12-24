import { AppProps } from "next/app"
import "../styles/index.css"
import "../styles/main.css"

import { useApp } from "../lib/gateway"
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    (async () => useApp().load())()
  }, [])
  return <Component {...pageProps} />
}
