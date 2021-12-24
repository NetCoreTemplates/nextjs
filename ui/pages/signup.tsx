import React, { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from "react"
import Router, { useRouter } from "next/router"
import { serializeToObject, leftPart, rightPart, toPascalCase, createError } from "@servicestack/client"

import Page from "../components/layout-page"
import { FormLoading, ErrorSummary, TextInput, Checkbox, PrimaryButton, getRedirect, Redirecting } from "../components/form"
import { useClient, ApiContext } from "../lib/gateway"
import { Register } from "../lib/dtos"
import useAuth from "../lib/useAuth"

export default () => {

    const client = useClient()
    const [getDisplayName, setDisplayName] = useState<string>()
    const [getUsername, setUsername] = useState<string>()
    const [getPassword, setPassword] = useState<string>()

    const setUser = (email:string) => {
        let first = leftPart(email, '@');
        let last = rightPart(leftPart(email, '.'), '@')
        setDisplayName(toPascalCase(first) + ' ' + toPascalCase(last))
        setUsername(email)
        setPassword('p@55wOrd')
    }

    const { signedIn, revalidate } = useAuth()
    const router = useRouter()
    useEffect(() => {
        if (signedIn) Router.replace(getRedirect() || "/")
    }, [signedIn])
    if (signedIn) return <Redirecting />

    const onSubmit = async (e:SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { displayName, userName, password, confirmPassword, autoLogin } = serializeToObject(e.currentTarget);
        if (password !== confirmPassword) {
            client.setError( { fieldName:'confirmPassword', message:'Passwords do not match'})
            return
        }

        const api = await client.api(new Register({ displayName, email: userName, password, confirmPassword, autoLogin }))
        if (api.succeeded) {
            await revalidate()
            await router.push("/signin")
        }
    }

    const change = (setField:(Dispatch<SetStateAction<string | undefined>>)) =>
        (e:ChangeEvent<HTMLInputElement>) => setField(e.target.value)

    return (<Page title="Sign Up">
        <ApiContext.Provider value={client}>
        <form onSubmit={onSubmit} className="max-w-prose">
            <div className="shadow overflow-hidden sm:rounded-md">
                <ErrorSummary except="displayName,userName,password,confirmPassword" />
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="flex flex-col gap-y-4">
                        <TextInput id="displayName" help="Your first and last name" 
                                   value={getDisplayName} onChange={change(setDisplayName)} />
                        <TextInput id="userName" 
                                   value={getUsername} onChange={change(setUsername)} />
                        <TextInput id="password" type="password" help="6 characters or more" 
                                   value={getPassword} onChange={change(setPassword)} />
                        <TextInput id="confirmPassword" type="password" defaultValue={getPassword} />
                        <Checkbox id="autoLogin" />
                    </div>
                </div>
                <div className="pt-5 px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <div className="flex justify-end">
                        <FormLoading className="flex-1" />
                        <PrimaryButton className="ml-3">Sign Up</PrimaryButton>
                    </div>
                </div>
            </div>
        </form>
        </ApiContext.Provider>
        
        <div className="flex mt-8 ml-8">
            <h3 className="mr-4 leading-8 text-gray-500">Quick Links</h3>
            <span className="relative z-0 inline-flex shadow-sm rounded-md">
                <button type="button" onClick={e => setUser('new@user.com')}
                    className="-ml-px relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    new@user.com
                </button>
            </span>
        </div>
    </Page>)
}
