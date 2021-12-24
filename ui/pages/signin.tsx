import { serializeToObject } from "@servicestack/client"
import { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from "react"
import Router from "next/router"

import Page from "../components/layout-page"
import { FormLoading, ErrorSummary, TextInput, Checkbox, SecondaryButton, PrimaryButton, getRedirect, Redirecting } from "../components/form"
import { useClient, ApiContext } from "../lib/gateway"
import { Authenticate, UpdateBooking } from "../lib/dtos"
import useAuth from "../lib/useAuth"

export default () => {

    const client = useClient()
    const [getUsername, setUsername] = useState<string>()
    const [getPassword, setPassword] = useState<string>()

    const setUser = (email:string) => {
        setUsername(email)
        setPassword('p@55wOrd')
    }

    const { signedIn, revalidate } = useAuth();
    useEffect(() => {
        if (signedIn) Router.replace(getRedirect() || "/");
    }, [signedIn]);
    if (signedIn) return <Redirecting />

    const onSubmit = async (e:SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { userName, password, rememberMe } = serializeToObject(e.currentTarget);
        const api = await client.api(new Authenticate({ provider:'credentials', userName, password, rememberMe }))
        if (api.succeeded) 
            await revalidate()
    }

    const change = (setField:(Dispatch<SetStateAction<string | undefined>>)) => 
        (e:ChangeEvent<HTMLInputElement>) => setField(e.target.value)

    return (<Page title="Sign In">
        <ApiContext.Provider value={client}>
        <form className="max-w-prose" onSubmit={onSubmit}>
            <div className="shadow overflow-hidden sm:rounded-md">
                <ErrorSummary except="userName,password" />
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="flex flex-col gap-y-4">
                        <TextInput id="userName" help="Email you signed up with" 
                                   value={getUsername} onChange={change(setUsername)} />
                        <TextInput id="password" type="password" help="6 characters or more"
                                   value={getPassword} onChange={change(setPassword)} />
                        <Checkbox id="rememberMe" />
                    </div>
                </div>
                <div className="pt-5 px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <div className="flex justify-end">
                        <FormLoading className="flex-1" />
                        <SecondaryButton href="/signup">Register New User</SecondaryButton>
                        <PrimaryButton className="ml-3">Login</PrimaryButton>
                    </div>
                </div>
            </div>
        </form>
        </ApiContext.Provider>
        
        <div className="flex mt-8">
            <h3 className="hidden xs:block mr-4 leading-8 text-gray-500">Quick Links</h3>
            <span className="relative z-0 inline-flex shadow-sm rounded-md">
                <button type="button" onClick={e => setUser('admin@email.com')}
                    className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    admin@email.com
                </button>
                <button type="button" onClick={e => setUser('manager@email.com')}
                        className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    manager@email.com
                </button>
                <button type="button" onClick={e => setUser('employee@email.com')}
                        className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    employee@email.com
                </button>
                <button type="button" onClick={e => setUser('new@user.com')}
                        className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    new@user.com
                </button>
            </span>
        </div>
    </Page>)
}
