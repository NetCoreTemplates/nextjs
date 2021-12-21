import { FC } from "react"
import Head from "next/head"
import Nav from "./nav"
import Footer from "./footer"
import Meta from "./meta"
import Breadcrumbs from "./breadcrumbs"
import classNames from "classnames";

type Props = {
  title: string,
  className?: string,
  children: React.ReactNode,
}

const Page: FC<Props> = ({ title, className, children }) => {
  return (
    <>
      <Meta />
      <Head>
        <title>{title}</title>
      </Head>
      <Nav />
      <div className="min-h-screen">
        <main>
          <div className={classNames("container mx-auto px-5",className)}>
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
