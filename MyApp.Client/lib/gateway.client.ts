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
