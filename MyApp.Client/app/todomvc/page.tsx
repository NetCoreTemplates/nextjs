'use client'

import { useState, type ReactNode, KeyboardEvent, MouseEvent, useEffect } from "react"
import { classNames, ResponseStatus } from "@servicestack/client"
import { TextInput } from "@servicestack/react"
import Page from "@/components/layout-page"
import { client } from "@/lib/gateway"
import { CreateTodo, DeleteTodo, DeleteTodos, QueryTodos, Todo, UpdateTodo } from "@/lib/dtos"
import SrcPage from "@/components/src-page"

export type Filter = "all" | "finished" | "unfinished"

export default function TodosMvc() {

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

    const refreshTodos = async (errorStatus?: ResponseStatus) => {
        setError(errorStatus)
        const api = await client.api(new QueryTodos())
        if (api.succeeded) {
            setTodos(api.response!.results ?? [])
        }
    }
    const addTodo = async () => {
        setTodos([...todos, new Todo({id: -1, text: newTodo})])
        let api = await client.api(new CreateTodo({text: newTodo}))
        if (api.succeeded)
            setNewTodo('')
        await refreshTodos(api.error)
    }
    const removeTodo = async (id?: number) => {
        setTodos(todos.filter(x => x.id != id))
        let api = await client.api(new DeleteTodo({id}))
        await refreshTodos(api.error)
    }
    const removeFinishedTodos = async () => {
        let ids = todos.filter(x => x.isFinished).map(x => x.id!)
        if (ids.length == 0) return
        setTodos(todos.filter(x => !x.isFinished))
        let api = await client.api(new DeleteTodos({ids}))
        await refreshTodos(api.error)
    }
    const toggleTodo = async (id?: number) => {
        const todo = todos.find(x => x.id == id)!
        todo.isFinished = !todo.isFinished
        let api = await client.api(new UpdateTodo(todo))
        await refreshTodos(api.error)
    }

    useEffect(() => {
        (async () => {
            await refreshTodos()
        })()
    }, [])

    return (<Page title="Todos Application">
        <div className="max-w-xl">
            <div className="mb-3">
                <TextInput status={error} id="Text" placeholder="What needs to be done?" label=""
                           value={newTodo} onChange={setNewTodo}
                           onKeyUp={async (e: KeyboardEvent<HTMLInputElement>) => {
                               e.stopPropagation();
                               if (e.key == "Enter") await addTodo()
                           }}/>
            </div>
            <div className="bg-white dark:bg-black shadow overflow-hidden rounded-md">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTodos.map(todo => (
                        <li key={todo.id} className="px-6 py-4">
                            <div className="relative flex items-start" onClick={() => toggleTodo(todo.id)}>
                                <div className="flex items-center h-6">
                                    {todo.isFinished
                                        ? <svg className="size-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/></svg>
                                        : <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>}
                                </div>
                                <div className="ml-3 flex-grow">
                                    <label className={classNames(todo.isFinished ? 'line-through' : '')}>{todo.text}</label>
                                </div>
                                <div>
                                    {todo.isFinished ?
                                        <svg onClick={() => removeTodo(todo.id)} className="cursor-pointer size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                          <path fill="currentColor" d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zM7 6h10v13H7zm2 2v9h2V8zm4 0v9h2V8z"/>
                                        </svg>
                                        : null}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4 flex justify-between">
                <div className="text-gray-400 leading-8 mr-4">
                    {unfinishedTodos.length} <span className="hidden sm:inline">item(s)</span> left
                </div>
                <div className="inline-flex shadow-sm rounded-md">
                    <FilterTab className="rounded-l-lg border" active={filter == "all"}
                               onClick={() => setFilter("all")}>
                        All
                    </FilterTab>
                    <FilterTab className="border-t border-b" active={filter == "unfinished"}
                               onClick={() => setFilter("unfinished")}>
                        Active
                    </FilterTab>
                    <FilterTab className="rounded-r-md border" active={filter == "finished"}
                               onClick={() => setFilter("finished")}>
                        Completed
                    </FilterTab>
                </div>
                <div className="leading-8 ml-4">
                    <span className={finishedTodos.length === 0 ? 'invisible' : 'cursor-pointer' }
                          onClick={async e => {
                              e.preventDefault();
                              await removeFinishedTodos()
                          }}>
                        clear <span className="hidden sm:inline">completed</span>
                    </span>
                </div>
            </div>

            <div className="mt-4 text-center text-gray-400 flex justify-center -ml-6">
                <SrcPage path="bookings-custom/page.tsx" />
            </div>

        </div>
    </Page>)
}

type FilterTabProps = {
    active: boolean
    className: string
    onClick: (e: MouseEvent<HTMLSpanElement>) => void
    children: ReactNode
}

function FilterTab({active, className, onClick, children}: FilterTabProps) {
    return (<span className={classNames(`cursor-pointer border-gray-200 text-sm font-medium px-4 py-2 hover:bg-gray-100
      focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600
      dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white`,
        active ? 'text-blue-700 dark:bg-blue-600' : 'text-gray-900 hover:text-blue-700 dark:bg-gray-700', className)}
                  onClick={e => {
                      e.preventDefault();
                      onClick(e)
                  }}>{children}</span>)
}
