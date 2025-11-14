'use client'

import { useState } from "react"
import { TextInput } from "@servicestack/react"
import { swrClient } from "@/lib/gateway.client"
import { Hello } from "@/lib/dtos"
import { CMS_NAME } from "@/lib/constants"

const HelloApi = ({ name }:any) => {
  const { data, error } = swrClient.get(() => new Hello({ name }))
  if (error) return <div className="ml-2 text-red-500 dark:text-red-400">{error.message}</div>
  return <div className="ml-3 mt-2 text-gray-900 dark:text-gray-100">{data ? data.result : 'loading...'}</div>
}

const Intro = () => {

  const [inputValue, setInputValue] = useState<string>("Next.js");
    return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8 text-gray-900 dark:text-gray-100">
        Next.js
      </h1>
      <div className="flex flex-col">
        <h4 className="text-lg mt-5 text-gray-700 dark:text-gray-300">
          A statically rendered example using{' '}
          <a
            href="https://nextjs.org/"
            className="underline hover:text-success duration-200 transition-colors"
          >
            Next.js
          </a>
          <span className="px-1">&amp;</span>
          <a href="https://servicestack.net" className="underline hover:text-success duration-200 transition-colors">
            {CMS_NAME}
          </a>
        </h4>
        <div className="flex items-center flex-wrap sm:flex-nowrap">
          <TextInput id="name" label="" value={inputValue} onChange={setInputValue} />
          <HelloApi name={inputValue} />
        </div>
      </div>
    </section>
  )
}

export default Intro
