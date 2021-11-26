import { FC } from "react"
import Head from "next/head"
import Nav from "./nav"
import Footer from "./footer"
import Meta from "./meta"
import Breadcrumbs from "./breadcrumbs"

type Props = {
  title: string,
  children: React.ReactNode
}

const Page: FC<Props> = ({ title, children }) => {
  return (
    <>
      <Meta />
      <Head>
        <title>{title}</title>
      </Head>
      <Nav />
        <div className="min-h-screen">
            <main className="flex justify-center">
                <div className="mx-auto px-5">
                    <Breadcrumbs className="my-8" name={title} />
                    <article className="prose lg:prose-xl mb-32">
                        {children}
                    </article>
                </div>
            </main>
        </div>
        <Footer />
    </>
  )
}

export default Page
