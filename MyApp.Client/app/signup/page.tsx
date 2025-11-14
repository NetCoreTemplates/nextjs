'use client'

import { SyntheticEvent, useEffect, useState } from "react"
import { useClient, FormLoading, ErrorSummary, TextInput, PrimaryButton, SecondaryButton, ApiStateContext } from "@servicestack/react"
import { serializeToObject, leftPart, rightPart, toPascalCase } from "@servicestack/client"
import {useRouter, useSearchParams} from "next/navigation"
import Page from "@/components/layout-page"
import { getRedirect } from "@/lib/gateway"
import { Register, RegisterResponse } from "@/lib/dtos"
import { appAuth, Redirecting } from "@/lib/auth"

export default function SignUp() {

    const client = useClient()
    const [displayName, setDisplayName] = useState<string>()
    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [confirmPassword, setConfirmPassword] = useState<string>()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, revalidate } = appAuth()

    const setUser = (email: string) => {
        let first = leftPart(email, '@');
        let last = rightPart(leftPart(email, '.'), '@')
        setDisplayName(toPascalCase(first) + ' ' + toPascalCase(last))
        setUsername(email)
        setPassword('p@55wOrd')
        setConfirmPassword('p@55wOrd')
    }

    useEffect(() => {
        if (user) {
            const redirect = getRedirect(Object.fromEntries(searchParams.entries())) || "/"
            router.replace(redirect)
        }
    }, [user])
    if (user) return <Redirecting/>

    const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        const {displayName, userName, password, confirmPassword, autoLogin} = serializeToObject(e.currentTarget);
        if (password !== confirmPassword) {
            client.setError({fieldName: 'confirmPassword', message: 'Passwords do not match'})
            return
        }

        const api = await client.api(new Register({displayName, email: userName, password, confirmPassword, autoLogin}))
        if (api.succeeded) {
            await revalidate()
            const redirectUrl = (api.response as RegisterResponse).redirectUrl
            if (redirectUrl) {
                location.href = redirectUrl
            } else {
                router.push("/signin")
            }
        }
    }

    return (<Page title="Sign Up">
        <ApiStateContext.Provider value={client}>
            <section className="mt-4 max-w-xl sm:shadow overflow-hidden sm:rounded-md">
                <form onSubmit={onSubmit} className="max-w-prose">
                    <div className="shadow overflow-hidden sm:rounded-md">
                        <ErrorSummary except="displayName,userName,password,confirmPassword"/>
                        <div className="px-4 py-5 bg-white dark:bg-black space-y-6 sm:p-6">
                            <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                                Create a new account.
                            </h3>
                            <div className="flex flex-col gap-y-4">
                                <TextInput id="displayName" help="Your first and last name" autoComplete="name"
                                           value={displayName} onChange={setDisplayName}/>
                                <TextInput id="userName" autoComplete="email"
                                           value={username} onChange={setUsername}/>
                                <TextInput id="password" type="password" help="6 characters or more"
                                           autoComplete="new-password"
                                           value={password} onChange={setPassword}/>
                                <TextInput id="confirmPassword" type="password" value={confirmPassword} onChange={setConfirmPassword}/>
                            </div>
                        </div>
                        <div className="pt-5 px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
                            <div className="flex justify-end">
                                { client.loading ? <FormLoading className="flex-1"/> : null }
                                <PrimaryButton className="ml-3">Sign Up</PrimaryButton>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </ApiStateContext.Provider>

        <div className="flex mt-8 ml-8">
            <h3 className="mr-4 leading-8 text-gray-500 dark:text-gray-400">Quick Links</h3>
            <div className="flex flex-wrap max-w-lg gap-2">
                <SecondaryButton onClick={() => setUser('new@user.com')}>
                    new@user.com
                </SecondaryButton>
            </div>
        </div>
    </Page>)
}
