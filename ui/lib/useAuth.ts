import Router from "next/router"
import useSWR, { KeyedMutator, useSWRConfig } from "swr"
import { client } from "./gateway"
import { Authenticate, AuthenticateResponse } from "./dtos"

const KEY = "/api/Authenticate"

export type AuthContext = {
  signedIn: boolean
  attrs: string[]
  loading: boolean
  signout: (redirectTo?:string) => void
  revalidate:KeyedMutator<AuthenticateResponse>
  hasRole:(role:string) => boolean
  hasPermission:(permission:string) => boolean
}
export type OptionalAuthContext = AuthContext & {
  auth: AuthenticateResponse|undefined
}
export type AuthenticatedContext = AuthContext & {
  auth: AuthenticateResponse
}

type Props = {}
export default function useAuth({}: Props = {}) : OptionalAuthContext {
  const { data:auth, mutate:revalidate, error } = useSWR(KEY, key => client.post(new Authenticate()))
  const { cache } = useSWRConfig()
  const loading = error === undefined && auth === undefined
  const signedIn = error === undefined && auth !== undefined
  
  let attrs:string[] = !loading && auth ? [
      'auth',
      ...(auth?.roles || []).map(role => `role:${role}`),
      ...(auth?.permissions || []).map(perm => `perm:${perm}`),
    ] : []

  async function signout(redirectTo?:string) {
    await client.post(new Authenticate({ provider: 'logout' }));
    (cache as any).delete(KEY);
    await revalidate()
    if (redirectTo) {
      await Router.push(redirectTo)
    }
  }

  const isAdmin = () => (auth?.roles || []).indexOf('Admin') >= 0
  const hasRole = (role:string) => (auth?.roles || []).indexOf(role) >= 0 || isAdmin()
  const hasPermission = (permission:string) => (auth?.permissions || []).indexOf(permission) >= 0 || isAdmin()
  
  return { auth, signedIn, attrs, loading, signout, revalidate, hasRole, hasPermission }
}
