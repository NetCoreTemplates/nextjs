import React, { useEffect } from "react"
import Router, { useRouter } from "next/router"
import { useAuth, Loading } from "@servicestack/react"
import { client, Routes } from "./gateway"
import { Authenticate } from "@/lib/dtos"

export const Redirecting = () => {
  return <Loading className="py-2 pl-4">redirecting ...</Loading>
}

type ValidateAuthProps = {
  role?: string
  permission?: string
  redirectTo?: string
}
export function ValidateAuth<TOriginalProps extends {}>(Component:React.FC<TOriginalProps>, validateProps? :ValidateAuthProps) {
    let { role, permission, redirectTo } = validateProps ?? {}
    const compWithProps: React.FC<TOriginalProps> = (props) => {
        const router = useRouter()
        const authProps = useAuth()
        const { user, isAuthenticated, hasRole } = authProps
        useEffect(() => {
            const goTo = shouldRedirect()
            if (goTo) {
                router.replace(goTo)
            }
        }, [user])

        redirectTo ??= router.pathname

        const shouldRedirect = () => !isAuthenticated
            ? Routes.signin(redirectTo)
            : role && !hasRole(role)
                ? Routes.forbidden()
                : permission && !hasRole(permission)
                    ? Routes.forbidden()
                    : null;

        if (shouldRedirect()) {
            return <Redirecting />
        }

        return <Component {...props} />
    }

    return compWithProps
}

export function appAuth() {
    const authState = useAuth()
    async function revalidate() {
        try {
            const response = await client.post(new Authenticate())
            authState.signIn(response)
        } catch {
            authState.signOut()
        }
    }
    async function signOut(redirectTo?:string) {
        await client.post(new Authenticate({ provider: 'logout' }))
        authState.signOut()
        if (redirectTo) {
            Router.push(redirectTo)
        }
    }
    return { ...authState, revalidate, signOut }
}
