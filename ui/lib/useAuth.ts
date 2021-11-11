import Router from "next/router";
import useSWR, { KeyedMutator, useSWRConfig } from "swr";
import { client } from "./gateway";
import { Authenticate, AuthenticateResponse } from "./dtos";

const KEY = "/api/Authenticate"

export type AuthContext = {
  signedIn: boolean, 
  attrs: string[], 
  loading: boolean, 
  signout: (redirectTo?:string) => void, 
  revalidate:KeyedMutator<AuthenticateResponse>, 
  hasRole:(role:string) => boolean, 
  hasPermission:(permission:string) => boolean,
}
export type OptionalAuthContext = AuthContext & {
  auth: AuthenticateResponse|undefined,
}
export type AuthenticatedContext = AuthContext & {
  auth: AuthenticateResponse,
}

type Props = {}
export default function useAuth({}: Props = {}) : OptionalAuthContext {
  const { data:auth, mutate:revalidate, error } = useSWR(KEY, key => client.post(new Authenticate()))
  const { cache } = useSWRConfig()
  const loading = error === undefined && auth === undefined
  const signedIn = error === undefined && auth !== undefined
  
  let attrs:string[] = []
  if (!loading && auth) {
    (auth.roles || []).forEach(role => attrs.push(`role:${role}`));
    (auth.permissions || []).forEach(perm => attrs.push(`perm:${perm}`));
  }

  async function signout(redirectTo?:string) {
    await client.post(new Authenticate({ provider: 'logout' }));
    (cache as any).delete(KEY);
    revalidate()
    if (redirectTo) {
      Router.push(redirectTo)
    }
  }

  const hasRole = (role:string) => (auth?.roles || []).indexOf(role) >= 0
  const hasPermission = (permission:string) => (auth?.permissions || []).indexOf(permission) >= 0
  
  return { auth, signedIn, attrs, loading, signout, revalidate, hasRole, hasPermission }
}
