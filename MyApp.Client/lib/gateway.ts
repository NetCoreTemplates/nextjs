import { JsonServiceClient, combinePaths } from "@servicestack/client"
import { Authenticate } from "@/lib/dtos"

export const Routes = {
    signin: (redirectTo?: string) => redirectTo ? `/signin?redirect=${redirectTo}` : `/signin`,
    forbidden: () => '/forbidden',
}

export const BaseUrl = typeof window === 'undefined'
    ? (process.env.apiBaseUrl || '')
    : (process.env.apiBaseUrl || '')

export function apiUrl(path: string) {
    const base = typeof window === 'undefined' ? process.env.apiBaseUrl : process.env.apiBaseUrl
    return combinePaths(base || '', path)
}

export const client = new JsonServiceClient()

// Load Metadata & Auth State on Startup
// This needs to be called on client side only
export async function init() {
    if (typeof window === 'undefined') return

    const { useMetadata, authContext } = await import("@servicestack/react")
    const metadata = useMetadata(client)
    const authCtx = authContext()

    return await Promise.all([
        metadata.loadMetadata(),
        client.post(new Authenticate())
            .then(r => {
                authCtx.signIn(r)
            }).catch(() => {
            authCtx.signOut()
        })
    ])
}

export function getRedirect(searchParams: URLSearchParams | Record<string, string | string[] | undefined>) {
    const redirect = searchParams instanceof URLSearchParams
        ? searchParams.get('redirect')
        : searchParams['redirect']
    return redirect && Array.isArray(redirect)
        ? redirect[0]
        : redirect
}
