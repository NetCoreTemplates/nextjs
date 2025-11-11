import Link from "next/link"
import { AutoQueryGrid } from "@servicestack/react"
import Page from "@/components/layout-page"
import { ValidateAuth } from "@/lib/auth"
import SrcPage from "@/components/src-page"

function Index() {


    return (<Page title="Bookings CRUD (Auto Columns)" className="max-w-screen-lg">

        <div className="mb-4 flex justify-end">
            <Link href="/bookings-custom" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                View Custom Bookings →
            </Link>
        </div>

        <div className="mt-4 flex flex-col ">
            <AutoQueryGrid type="Booking"/>

            <div className="mt-4 text-center text-gray-400 flex justify-center -ml-6">
                <SrcPage path="bookings-auto.tsx" />
            </div>
        </div>

    </Page>)
}

export default ValidateAuth(Index, {role: 'Employee'})

