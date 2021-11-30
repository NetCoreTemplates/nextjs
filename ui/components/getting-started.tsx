import { ChangeEvent, useEffect, useState } from "react"
import ShellCommand from "./shell-command"

export const GettingStarted = () => {
    let [project, setProject] = useState('ProjectName')
    let [apiPath, setApiPath] = useState(`api/${project}`)
    const handleChange = (e:ChangeEvent<HTMLInputElement>) => setProject(e.target.value.replace(/[\W]+/g,''));

    useEffect(() => {
        const resolvePath = (path:string) => navigator.userAgent.indexOf("Win") >= 0 ? path.replace(/\//g,'\\') : path
        setApiPath(resolvePath(`api/${project}`))
    }, [project])

    return (<section>
        <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8 whitespace-nowrap text-center pt-8">
            Getting Started
        </h2>
        <div className="mb-8 md:mb-16">
            <div className="sm:mx-0 sm:px-4 sm:py-8 flex justify-evenly">
                <div className="flex flex-col">

                    <h4 className="py-6 text-center text-xl">Create New Project</h4>
                    <input type="text" value={project} onChange={handleChange} autoComplete="off" spellCheck="false"
                           className="mb-8 sm:text-lg rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"/>

                    <ShellCommand className="mb-2">dotnet tool install -g x</ShellCommand>
                    <ShellCommand className="mb-2">mkdir {project} &amp;&amp; cd {project}</ShellCommand>
                    <ShellCommand className="mb-2">x new nextjs</ShellCommand>

                    <h4 className="py-6 text-center text-xl">Build Client UI &amp; Run Dev Server</h4>
                    <ShellCommand className="mb-2">cd ui &amp;&amp; npm run build:local</ShellCommand>
                    <ShellCommand className="mb-2">npm run dev</ShellCommand>

                    <h4 className="py-6 text-center text-xl">Run Server .NET Project (New Terminal)</h4>
                    <ShellCommand className="mb-2">cd {apiPath}</ShellCommand>
                    <ShellCommand className="mb-2">dotnet watch</ShellCommand>

                    <div className="mt-8 text-center">

                        <div className="flex justify-center">
                            <a className="bg-purple-500 text-purple-50 rounded px-2 py-0.5 mx-1"
                               href="/posts/rider">rider
                            </a>
                            <a className="bg-purple-500 text-purple-50 rounded px-2 py-0.5 mx-1"
                               href="/posts/vs">visualstudio
                            </a>
                        </div>

                        <h3 className="mt-4 sm:text-2xl">Use npm dev server for UI Development</h3>
                        <div className="text-lg hover:text-green-600"><a
                            href="http://localhost:3000">http://localhost:3000</a></div>

                        <h3 className="mt-4 sm:text-2xl">`npm run build:local` to view in .NET App</h3>
                        <div className="text-lg hover:text-green-600"><a
                            href="https://localhost:5001">https://localhost:5001</a></div>

                    </div>

                </div>
            </div>
        </div>
    </section>)
}

export default GettingStarted