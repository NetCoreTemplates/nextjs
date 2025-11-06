import {
    appendQueryString,
    nameOf,
    IReturn,
    ApiResult,
    ApiRequest,
    IReturnVoid,
    EmptyResponse,
    ResponseError,
    ResponseStatus,
    JsonServiceClient, MetadataTypes, combinePaths, createErrorStatus,
} from "@servicestack/client"
import { createContext, useState } from "react"
import useSWR from "swr"

export const Routes = {
    signin: (redirectTo?:string) => redirectTo ? `/signin?redirect=${redirectTo}` : `/signin`,
    forbidden: () => '/forbidden',
}

export const client = new JsonServiceClient(process.env.apiBaseUrl).apply(c => {
    c.basePath = "/api"
    c.headers = new Headers() //avoid pre-flight CORS requests
})

export const ApiContext = createContext<ApiState>({ })
export type ApiState = {
    loading?: boolean
    error?: ResponseStatus
}

export type ErrorArgs = {
    message:string
    errorCode?:string
    fieldName?:string
    errors?:ResponseError[]
}
export type FieldErrorArgs = {
    fieldName:string
    message:string
    errorCode?:string
}
export type ClientContext = ApiState & {
    setError(e:ErrorArgs): void
    addFieldError(e:FieldErrorArgs): void
    api<TResponse>(request: IReturn<TResponse> | ApiRequest, args?: any, method?: string): Promise<ApiResult<TResponse>>
    apiVoid(request: IReturnVoid | ApiRequest, args?: any, method?: string): Promise<ApiResult<EmptyResponse>>
}

// Managed client maintaining loading and error states that can be injected to child components
export function useClient() : ClientContext {
    const [error, setStatus] = useState<ResponseStatus|undefined>()
    const [loading, setLoading] = useState(false)
    
    const setError = ({ message, errorCode, fieldName, errors } : ErrorArgs) => {
        errorCode ??= 'Exception'
        errors ??= []
        return setStatus(fieldName
            ? new ResponseStatus({ errorCode, message,
                errors: [new ResponseError({ fieldName, errorCode, message })] })
            : new ResponseStatus({ errorCode, message, errors }))
    }

    const addFieldError = ({ fieldName, message, errorCode } : FieldErrorArgs) => {
        errorCode ??= 'Exception'
        if (!error) {
            setError({ fieldName, message, errorCode })
        } else {
            let copy = new ResponseStatus(error)
            copy.errors = [...(copy.errors ?? []).filter(x => x.fieldName?.toLowerCase() != fieldName.toLowerCase()),
                new ResponseError({ fieldName, message, errorCode })]
        }
    }

    async function api<TResponse>(request: IReturn<TResponse> | ApiRequest, args?: any, method?: string) {
        setLoading(true)
        const apiResult = await client.api(request)
        setLoading(false)
        setStatus(apiResult.error)
        return apiResult
    }

    async function apiVoid(request: IReturnVoid | ApiRequest, args?: any, method?: string) {
        setLoading(true)
        const apiResult = await client.apiVoid(request)
        setLoading(false)
        setStatus(apiResult.error)
        return apiResult
    }

    return { loading, error, setError, addFieldError, api, apiVoid }
}

export type AppState = {
    loading?: boolean
    error?: ResponseStatus
    metadata?:MetadataTypes
}
const appState:AppState = {}

export function useApp() {

    const load = async (force?:boolean) => {
        if (appState.metadata && !force) return
        let r = await fetch(combinePaths(client.baseUrl, '/types/metadata.json'))
        if (r.ok) {
            let json = await r.text()
            appState.metadata = JSON.parse(json) as MetadataTypes
        } else {
            appState.error = createErrorStatus(r.statusText)
        }
    }

    const getType = (name:string) => appState.metadata?.types?.find(x => x.name?.toLowerCase() == name.toLowerCase())

    const enumOptions = (name:string) => {
        let to:{[key:string]: any} = {}
        let type = getType(name)
        if (type && type.isEnum && type.enumNames != null) {
            for (let i=0; i<type.enumNames.length; i++) {
                const name:string = type.enumNames[i]
                const key = (type.enumValues != null ? type.enumValues[i] : null) ?? name
                to[key] = name
            }
        }
        return to
    }

    return {
        metadata:appState.metadata,
        error:appState.error,
        load,
        getType,
        enumOptions,
    }
}

export function requestKey<T>(request: IReturn<T>) {
    return appendQueryString(nameOf(request), request)
}

class SwrClient {
    client:JsonServiceClient
    constructor(client:JsonServiceClient) { this.client = client }
    get<T>(fn: () => IReturn<T> | string){
        return useSWR(() => {
            let request = fn()
            return appendQueryString(`SwrClient:${nameOf(request)}`, request)
        }, key => this.client.get(fn()))
    }
}
export const swrClient = new SwrClient(client)
