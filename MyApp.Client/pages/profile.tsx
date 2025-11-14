import React from "react"
import Page from "../components/layout-page"
import {SecondaryButton} from "@servicestack/react"
import {appAuth, ValidateAuth} from "@/lib/auth"

function Profile() {
    const {user, signOut} = appAuth()
    return (<Page title={user.displayName + ' Profile'}>
        <div className="max-w-3xs flex flex-col justify-center items-center">
            <svg className="w-36 h-36 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            <div className="text-gray-900 dark:text-gray-100">{user.displayName}</div>
            <div className="text-gray-700 dark:text-gray-300">{user.userName}</div>
            <div className="mt-2">
                {(user.roles || []).map(role =>
                    <span key={role}
                          className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">{role}</span>)}
            </div>
            <SecondaryButton className="mt-8" onClick={signOut}>Sign Out</SecondaryButton>
        </div>
    </Page>)
}

export default ValidateAuth(Profile)
