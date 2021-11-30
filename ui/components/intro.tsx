import { ChangeEvent, useState } from "react"
import { CMS_NAME } from "../lib/constants"
import { swrClient } from "../lib/gateway"
import { Hello } from "../lib/dtos"

const HelloApi = ({ name }:any) => {
  const { data, error } = swrClient.get(() => new Hello({ name }))
  if (error) return <div className="ml-2 text-red-500">{error.message}</div>
  return <div className="ml-3 mt-2 text-2xl">{data ? data.result : 'loading...'}</div>
}

const Intro = () => {

  const [inputValue, setInputValue] = useState<string>("Next.js");
  const onChange = async (e:ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  
    return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        Next.js
      </h1>
      <div className="flex flex-col">
        <h4 className="text-lg mt-5">
          A statically generated site (SSG) example using{' '}
          <a
            href="https://nextjs.org/"
            className="underline hover:text-success duration-200 transition-colors"
          >
            Next.js
          </a>,
          {' ' + CMS_NAME} &amp; {' '}
          <a href="https://servicestack.net" className="underline hover:text-success duration-200 transition-colors">ServiceStack</a>.
        </h4>
        <div className="flex items-center flex-wrap sm:flex-nowrap">
          <input type="text" className="mt-2 sm:text-lg rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" 
                 value={inputValue} onChange={onChange} />
          <HelloApi name={inputValue} />
        </div>
      </div>
    </section>
  )
}

export default Intro
