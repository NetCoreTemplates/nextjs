import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { serializeToObject, leftPart, rightPart, toPascalCase, createError } from '@servicestack/client'

import Page from '../components/layout-page'
import { Form, FormLoading, ErrorSummary, Input, Checkbox, PrimaryButton, getRedirect, Redirecting } from '../components/form'
import { client } from '../lib/gateway'
import { Register } from '../lib/dtos'
import useAuth from '../lib/useAuth'

export default () => {

    const [displayNameValue, setDisplayNameValue] = useState<string>()
    const [usernameValue, setUsernameValue] = useState<string>()
    const [passwordValue, setPasswordValue] = useState<string>()

    const setUser = (email:string) => {
        let first = leftPart(email, '@');
        let last = rightPart(leftPart(email, '.'), '@')
        setDisplayNameValue(toPascalCase(first) + ' ' + toPascalCase(last))
        setUsernameValue(email)
        setPasswordValue('p@55wOrd')
    }

    const { signedIn, revalidate } = useAuth()
    const router = useRouter()
    useEffect(() => {
        if (signedIn) Router.replace(getRedirect() || "/")
    }, [signedIn])
    if (signedIn) return <Redirecting />

    return (<Page title="Sign Up">
        <Form className="max-w-prose" 
                onSubmit={e => { 
                    const { displayName, userName, password, confirmPassword, autoLogin } = serializeToObject(e.currentTarget);
                    if (password !== confirmPassword) {
                        throw createError('ValidationException', 'Passwords do not match', 'confirmPassword')
                    }
                    return client.post(new Register({ displayName, email:userName, password, confirmPassword, autoLogin }))
                }}
                onSuccess={ctx => { revalidate(); router.push('/signin') }}>
            <div className="shadow overflow-hidden sm:rounded-md">
                <ErrorSummary except="displayName,userName,password,confirmPassword" />
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="flex flex-col gap-y-4">
                        <Input id="displayName" name="Display Name" description="Your first and last name" defaultValue={displayNameValue} />
                        <Input id="userName" name="Email" description="" defaultValue={usernameValue} />
                        <Input id="password" type="password" name="Password" description="6 characters or more" defaultValue={passwordValue} />
                        <Input id="confirmPassword" type="password" name="Confirm Password" defaultValue={passwordValue} />
                        <Checkbox id="autoLogin" name="Auto Login" />
                    </div>
                </div>
                <div className="pt-5 px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <div className="flex justify-end">
                        <FormLoading className="flex-1" />
                        <PrimaryButton className="ml-3">Sign Up</PrimaryButton>
                    </div>
                </div>
            </div>
        </Form>
        
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
