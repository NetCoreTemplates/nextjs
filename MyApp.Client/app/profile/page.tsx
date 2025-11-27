'use client'

import Page from "@/components/layout-page"
import { PrimaryButton, SecondaryButton, TextLink } from "@servicestack/react"
import { appAuth, ValidateAuth } from "@/lib/auth"

function Profile() {
    const { user, signOut } = appAuth()
    return (<Page title={user.displayName + ' Profile'}>
        <div className="mx-auto flex flex-col items-center">
            <img className="my-4 size-36 rounded-full" src={user.profileUrl} alt="User Profile"/>
            <div className="text-gray-900 dark:text-gray-100">{user.displayName}</div>
            <div className="text-gray-700 dark:text-gray-300">{user.userName}</div>
            <div className="mt-2">
                {(user.roles || []).map(role =>
                    <span key={role}
                        className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">{role}</span>)}
            </div>
            <SecondaryButton className="mt-8" onClick={() => signOut()}>Sign Out</SecondaryButton>
            <PrimaryButton className="mt-8" href="/Identity/Account/Manage">
                Identity Auth Account            
            </PrimaryButton>
            <TextLink className="mt-8" href="/">
                🏠 Home
            </TextLink>
        </div>
    </Page>)
}
export default ValidateAuth(Profile)