'use client'

import { appendQueryString, nameOf, IReturn } from "@servicestack/client"
import useSWR from "swr"
import { client } from "./gateway"

// Typed Stale While Revalidate client
class SwrClient {
    client: any

    constructor(client: any) {
        this.client = client
    }

    get<T>(fn: () => IReturn<T> | string) {
        return useSWR(() => {
            let request = fn()
            return appendQueryString(`SwrClient:${nameOf(request)}`, request)
        }, _ => this.client.get(fn()))
    }
}

export const swrClient = new SwrClient(client)
