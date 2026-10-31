import { appendQueryString, nameOf, IReturn, JsonServiceClient } from "@servicestack/client"
import useSWR from "swr"
import { Authenticate } from "@/lib/dtos"

const serverRoutePaths = [
    '/Identity',
    '/metadata',
    '/api',
    '/ui',
    '/chat',
    '/admin-ui',
    '/swagger',
    '/scalar',
]

export function isServerRoute(path: string) {
    return serverRoutePaths.some(x => path.startsWith(x))
}

export const Routes = {
    signin: (redirectTo?: string) => redirectTo ? `/signin?redirect=${redirectTo}` : `/signin`,
    forbidden: () => '/forbidden',
}

export const client = new JsonServiceClient()

// Load Metadata & Auth State on Startup
// This needs to be called on client side only
export async function init() {
    if (typeof window === 'undefined') return

    const { useMetadata, authContext } = await import("@servicestack/react")
    // oxlint-disable-next-line react/rules-of-hooks -- useMetadata is a factory, not a React hook
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

// Typed Stale While Revalidate client
class SwrClient {
    client: JsonServiceClient

    constructor(client: JsonServiceClient) {
        this.client = client
    }

    // Only call get() from a React component, it wraps the useSWR hook
    get<T>(fn: () => IReturn<T> | string) {
        // oxlint-disable-next-line react/rules-of-hooks -- class method wrapper around useSWR
        return useSWR(() => {
            let request = fn()
            return appendQueryString(`SwrClient:${nameOf(request)}`, request)
        }, () => this.client.get(fn()))
    }
}

export const swrClient = new SwrClient(client)