import Page from '../components/layout-page'
import { ShieldCheckIcon } from '@heroicons/react/outline'
import React from 'react'
import { Button, ValidateAuth } from '../components/form'

export default () => {
    return (<ValidateAuth requiredRole="Admin" render={({ auth, signout }) => 
        <Page title="Admin Page">

            <div className="flex flex-col items-center justify-center">
                <ShieldCheckIcon className="w-36 h-36 text-gray-700" />
                <div>{auth.displayName}</div>
                <div>{auth.userName}</div>
                <div className="mt-2">
                    {(auth.roles || []).map(role => 
                    <span key={role} className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-indigo-100 text-indigo-800">{role}</span>)}
                </div>
                <Button className="mt-8" onClick={(e:any) => signout()}>Sign Out</Button>
            </div>

        </Page>}
    />)
}
