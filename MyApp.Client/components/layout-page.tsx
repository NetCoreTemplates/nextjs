import { FC } from "react"
import Head from "next/head"
import Nav from "./nav"
import Footer from "./footer"
import Meta from "./meta"

type Props = {
  title: string,
  className?: string,
  bodyClass?: string,
  children: React.ReactNode,
}

const Page: FC<Props> = ({ title, className, bodyClass, children }) => {
  return (
    <>
      <Meta />
      <Head>
        <title>{title}</title>
      </Head>
      <Nav />
      <div className="min-h-screen">
        <main>
          <div className={`max-w-7xl mx-auto px-5 ${className ?? ''}`}>
            <div className={bodyClass ?? 'max-w-5xl'}>
              <h1 className="text-4xl font-bold my-8 text-gray-900 dark:text-gray-100">{title}</h1>
              {children}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default Page
