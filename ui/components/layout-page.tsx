import { FC, useEffect } from 'react'
import Head from 'next/head'
import Nav from './nav'
import Footer from './footer'
import Meta from './meta'
import Breadcrumbs from './breadcrumbs'
import { useRouter } from 'next/router'
import { SuccessEventHandler } from './form'
import { Authenticate, AuthenticateResponse } from '../lib/dtos'
import { client } from '../lib/gateway'

type Props = {
  title: string,
  children: React.ReactNode
}

const Page: FC<Props> = ({ title, children }) => {
  let router = useRouter()
  // if (onAuth || onNoAuth) {
  //   useEffect(() => {
  //     (async () => {
  //       try {
  //         let response = await client.post(new Authenticate())
  //         if (onAuth) onAuth({ response, router })
  //       } catch (e) {
  //         if (onNoAuth) onNoAuth({ router })
  //       }
  //     })()
  //   }, [])
  // }

  return (
    <>
      <Meta />
      <Head>
        <title>{title}</title>
      </Head>
      <Nav />
      <div className="min-h-screen">
        <main>
          <div className="container mx-auto px-5">
            <Breadcrumbs className="my-8" name={title} />
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default Page