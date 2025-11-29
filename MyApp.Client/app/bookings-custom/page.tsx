'use client'

import { useState } from "react"
import Link from "next/link"
import { useFormatters, AutoQueryGrid, TextLink, PreviewFormat, AutoEditForm, Icon } from "@servicestack/react"
import Page from "@/components/layout-page"
import { ValidateAuth } from "@/lib/auth"
import SrcPage from "@/components/src-page"

function BookingsCustom() {
    const { currency } = useFormatters()

    return (<Page title="Bookings CRUD (Custom Columns)">

        <div className="mb-4 flex justify-end">
            <Link href="/bookings-auto" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                ← View Auto Bookings
            </Link>
        </div>

        <div className="mt-4 flex flex-col ">
            <AutoQueryGrid
                type="Booking"
                hide={['copyApiUrl','downloadCsv']}
                selectedColumns={['id', 'name', 'cost', 'bookingStartDate', 'bookingEndDate', 'roomNumber', 'createdBy', 'discount']}
                visibleFrom={{
                    name: 'xl',
                    bookingStartDate: 'sm',
                    bookingEndDate: 'xl',
                    createdBy: '2xl'
                }}
                columnSlots={{
                    id: ({ id }: any) => (
                        <span className="text-gray-900" dangerouslySetInnerHTML={{ __html: id }} />
                    ),
                    name: ({ name }: any) => <>{name}</>,
                    cost: ({ cost }: any) => (
                        <span dangerouslySetInnerHTML={{ __html: currency(cost) }} />
                    ),
                    createdBy: ({ createdBy }: any) => (
                        <span dangerouslySetInnerHTML={{ __html: createdBy }} />
                    )
                }}
                headerSlots={{
                    'roomNumber-header': () => (
                        <><span className="hidden lg:inline">Room </span>No</>
                    ),
                    'bookingStartDate-header': () => (
                        <>Start<span className="hidden lg:inline"> Date</span></>
                    ),
                    'bookingEndDate-header': () => (
                        <>End<span className="hidden lg:inline"> Date</span></>
                    ),
                    'createdBy-header': () => <>Employee</>
                }}
            />

            <div className="mt-4 text-center text-gray-400 flex justify-center -ml-6">
                <SrcPage path="bookings-custom/page.tsx" />
            </div>
        </div>

    </Page>)
}

export default ValidateAuth(BookingsCustom, {role: 'Employee'})
