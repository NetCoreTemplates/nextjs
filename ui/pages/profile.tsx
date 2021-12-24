import React from "react"
import { Icon } from "@iconify/react"
import Page from "../components/layout-page"
import { SecondaryButton, ValidateAuth } from "../components/form"
import useAuth, { AuthenticatedContext } from "../lib/useAuth";

function Profile ({ auth, signout }: AuthenticatedContext) {
    return (<Page title={auth.displayName + ' Profile'}>
        <div className="flex flex-col items-center justify-center">
            <Icon icon="mdi:account-circle" className="w-36 h-36 text-gray-700" />
            <div>{auth.displayName}</div>
            <div>{auth.userName}</div>
            <div className="mt-2">
                {(auth.roles || []).map(role => 
                <span key={role} className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-indigo-100 text-indigo-800">{role}</span>)}
            </div>
            <SecondaryButton className="mt-8" onClick={(e:any) => signout()}>Sign Out</SecondaryButton>
        </div>
    </Page>)
}
export default ValidateAuth(Profile)
