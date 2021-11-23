import { JsonServiceClient } from "@servicestack/client"

export const Routes = {
    signin: (redirectTo?:string) => redirectTo ? `/signin?redirect=${redirectTo}` : `/signin`,
    forbidden: () => '/forbidden',
}

export const client = new JsonServiceClient(process.env.apiBaseUrl)
    .useBasePath("/api")