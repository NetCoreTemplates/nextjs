import Page from "../components/layout-page"
import { Form, FormLoading, ErrorSummary, Input, Checkbox, Button, PrimaryButton, getRedirect, Redirecting } from "../components/form"
import { client } from "../lib/gateway"
import { Authenticate } from "../lib/dtos"
import { SyntheticEvent, useEffect, useState } from "react"
import { serializeToObject } from "@servicestack/client"
import useAuth from "../lib/useAuth"
import Router from "next/router"

export default () => {

    const [usernameValue, setUsernameValue] = useState<string>()
    const [passwordValue, setPasswordValue] = useState<string>()

    const setUser = (email:string) => {
        setUsernameValue(email)
        setPasswordValue('p@55wOrd')
    }

    const { signedIn, revalidate } = useAuth();
    useEffect(() => {
        if (signedIn) Router.replace(getRedirect() || "/");
    }, [signedIn]);
    if (signedIn) return <Redirecting />

    const onSubmit = (e:SyntheticEvent<HTMLFormElement>) => { 
        const { userName, password, rememberMe } = serializeToObject(e.currentTarget); 
        return client.post(new Authenticate({ provider:'credentials', userName, password, rememberMe }))
    }

    return (<Page title="Sign In">
        <Form className="max-w-prose" 
                onSubmit={onSubmit}
                onSuccess={ctx => revalidate()}>
            <div className="shadow overflow-hidden sm:rounded-md">
                <ErrorSummary except="userName,password" />
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="flex flex-col gap-y-4">
                        <Input id="userName" name="Email" description="Email you signed up with" defaultValue={usernameValue} />
                        <Input id="password" name="Password" type="password" description="6 characters or more" defaultValue={passwordValue} />
                        <Checkbox id="rememberMe" name="Remember Me" />
                    </div>
                </div>
                <div className="pt-5 px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <div className="flex justify-end">
                        <FormLoading className="flex-1" />
                        <Button href="/signup">Register New User</Button>
                        <PrimaryButton className="ml-3">Login</PrimaryButton>
                    </div>
                </div>
            </div>
        </Form>
        
        <div className="flex mt-8 ml-8">
            <h3 className="mr-4 leading-8 text-gray-500">Quick Links</h3>
            <span className="relative z-0 inline-flex shadow-sm rounded-md">
                <button type="button" onClick={e => setUser('admin@email.com')}
                    className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    admin@email.com
                </button>
                <button type="button" onClick={e => setUser('new@user.com')}
                    className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    new@user.com
                </button>
            </span>
        </div>
    </Page>)
}
