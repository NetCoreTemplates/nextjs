import { appendQueryString, IReturn, JsonServiceClient, nameOf } from '@servicestack/client'
import { Authenticate, Hello } from "./dtos"
import useSWR from "swr";

export const Routes = {
    signin: (redirectTo?:string) => redirectTo ? `/signin?redirect=${redirectTo}` : `/signin`,
    forbidden: () => '/forbidden',
}

export const client = new JsonServiceClient(process.env.apiBaseUrl)
    .useBasePath("/api")

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
