import { Icon } from "@iconify/react"
import React, { useState, ReactNode, ChangeEvent, KeyboardEvent, MouseEvent, useEffect } from "react"
import classNames from "classnames"
import Page from "../components/layout-page"
import { TextInput } from "../components/form"
import { client } from "../lib/gateway"
import { CreateTodo, DeleteTodo, DeleteTodos, QueryTodos, Todo, UpdateTodo } from "../lib/dtos"
import { ResponseStatus } from "@servicestack/client"

export type Filter = "all" | "finished" | "unfinished"

const TodosMvc = () => {

    const [newTodo, setNewTodo] = useState('')
    
    const [todos, setTodos] = useState([] as Todo[])
    
    const [filter, setFilter] = useState<Filter>("all")
    
    const [error, setError] = useState<ResponseStatus | undefined>()

    const finishedTodos = todos.filter(x => x.isFinished)
    const unfinishedTodos = todos.filter(x => !x.isFinished)
    const filteredTodos = filter == "finished" 
        ? finishedTodos
        : filter == "unfinished"
            ? unfinishedTodos
            : todos

    const refreshTodos = async (errorStatus?:ResponseStatus) => {
        setError(errorStatus)
        const api = await client.api(new QueryTodos())
        if (api.succeeded) {
            setTodos(api.response!.results ?? [])
        }
    }
    const addTodo = async () => {
        setTodos([...todos, new Todo({ id: -1, text: newTodo })])
        let api = await client.api(new CreateTodo({ text: newTodo }))
        if (api.succeeded)
            setNewTodo('')
        await refreshTodos(api.error)
    }
    const removeTodo = async (id?: number) => {
        setTodos(todos.filter(x => x.id != id))
        let api = await client.api(new DeleteTodo({ id }))
        await refreshTodos(api.error)
    }
    const removeFinishedTodos = async () => {
        let ids = todos.filter(x => x.isFinished).map(x => x.id!)
        if (ids.length == 0) return
        setTodos(todos.filter(x => !x.isFinished))
        let api = await client.api(new DeleteTodos({ ids }))
        await refreshTodos(api.error)
    }
    const toggleTodo = async (id?: number) => {
        const todo = todos.find(x => x.id == id)!
        todo.isFinished = !todo.isFinished
        let api = await client.api(new UpdateTodo(todo))
        await refreshTodos(api.error)
    }
    
    useEffect(() => { (async () => { await refreshTodos() })() }, [])
    
    return (<Page title="Todos Application" className="max-w-xl">
        <div>
            <div className="mb-3">
                <TextInput status={error} id="Text" placeholder="What needs to be done?" label=""
                           value={newTodo} onChange={(e:ChangeEvent<HTMLInputElement>) => setNewTodo(e.target.value)}
                           onKeyUp={async (e:KeyboardEvent<HTMLInputElement>) => { e.stopPropagation(); if (e.key == "Enter") await addTodo() }} />
            </div>
            <div className="bg-white shadow overflow-hidden rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                {filteredTodos.map(todo => (
                    <li key={todo.id} className="px-6 py-4">
                        <div className="relative flex items-start" onClick={() => toggleTodo(todo.id)}>
                            <div className="flex items-center h-6">
                                {todo.isFinished
                                    ? <Icon icon="mdi:check-circle" className="text-green-600" />
                                    : <Icon icon="mdi:checkbox-blank-circle-outline" />}
                            </div>
                            <div className="ml-3 flex-grow">
                                <label className={classNames(todo.isFinished ? 'line-through' : '')}>{ todo.text }</label>
                            </div>
                            <div>
                            {todo.isFinished ? 
                                <Icon icon="mdi:trash-can-outline" className="cursor-pointer" onClick={() => removeTodo(todo.id)} /> 
                                : null}
                            </div>
                        </div>
                    </li>
                ))}
                </ul>
            </div>
        <div className="mt-4 flex justify-between">
            <div className="text-gray-400 leading-8 mr-4">
                { unfinishedTodos.length } <span className="hidden sm:inline">item(s)</span> left
            </div>
            <div className="inline-flex shadow-sm rounded-md">
                <FilterTab className="rounded-l-lg border" active={filter=="all"} onClick={() => setFilter("all")}>
                    All
                </FilterTab>
                <FilterTab className="border-t border-b" active={filter=="unfinished"} onClick={() => setFilter("unfinished")}>
                    Active
                </FilterTab>
                <FilterTab className="rounded-r-md border" active={filter=="finished"} onClick={() => setFilter("finished")}>
                    Completed
                </FilterTab>
            </div>
            <div className="leading-8 ml-4">
                <a href="#" className={ finishedTodos.length === 0 ? 'invisible' : '' } 
                   onClick={async e => { e.preventDefault(); await removeFinishedTodos() }}>
                    clear <span className="hidden sm:inline">completed</span>
                </a>
            </div>
        </div>
        <div className="mt-4 text-center text-gray-400 flex justify-center -ml-6">
            <a href="https://github.com/NetCoreTemplates/nextjs/blob/main/ui/pages/todomvc.tsx" className="mx-2">
                <Icon icon="logos:react" className="w-4 h-4 inline-flex" /> todomvc.tsx
            </a>
        </div>
    </div>
    </Page>)
}

type FilterTabProps = { 
    active:boolean 
    className:string
    onClick: (e: MouseEvent<HTMLAnchorElement>) => void
    children: ReactNode 
}
function FilterTab({ active, className, onClick, children }: FilterTabProps) {
    return (<a href="#" className={classNames(`border-gray-200 text-sm font-medium px-4 py-2 hover:bg-gray-100 
      focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 
      dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white`, 
      active ? 'text-blue-700 dark:bg-blue-600' : 'text-gray-900 hover:text-blue-700 dark:bg-gray-700', className)}
      onClick={e => { e.preventDefault(); onClick(e) }}>{children}</a>)
}
export default TodosMvc