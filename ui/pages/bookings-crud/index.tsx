import React, { MouseEventHandler, useEffect, useState } from "react"
import Page from "../../components/layout-page"
import { OutlineButton, ValidateAuth } from "../../components/form"

import Create from "./create"
import Edit from "./edit"
import { Booking, QueryBookings } from "../../lib/dtos"
import { Icon } from "@iconify/react";
import { formatCurrency, formatDate } from "../../lib/utils";
import { useClient } from "../../lib/gateway";
import SrcLink from "../../components/src-link";

function Index () {

    const client = useClient()
    const [newBooking, setNewBooking] = useState<boolean>(false)
    const [editBookingId, setEditBookingId] = useState<number|undefined>()
    const [bookings, setBookings] = useState<Booking[]>([])
    const [expandAbout, setExpandAbout] = useState<boolean>(false)
    useEffect(() => {
        (async () => await refreshBookings())()
    }, [])

    const reset = (args:{ newBooking?: boolean, editBookingId?:number } = {}) => {
        setNewBooking(args.newBooking ?? false)
        setEditBookingId(args.editBookingId ?? undefined)
    }

    const onDone = async () => {
        reset()
        await refreshBookings()
    }

    const refreshBookings = async () => {
        const api = await client.api(new QueryBookings())
        if (api.succeeded) {
            setBookings(api.response!.results ?? [])
        }
    }

    const toggleAbout:MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault()
        setExpandAbout(!expandAbout)
    }

    return (<Page title="Bookings CRUD" className="max-w-fit">
        {newBooking 
            ? <Create className="max-w-screen-sm" onDone={onDone} /> 
            : editBookingId
                ? <Edit id={editBookingId} className="max-w-screen-sm" onDone={onDone} /> 
                : (<OutlineButton onClick={() => reset({newBooking:true})}>New Booking</OutlineButton>)}
        {bookings.length == 0 ? null : (
            <div className="mt-4 flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr className="select-none">
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <Icon icon="fluent:add-circle-24-regular" className="w-6 h-6 cursor-pointer" onClick={() => reset({newBooking:true})} />
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Id
                                    </th>
                                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <span className="hidden sm:inline">Room </span>Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <span className="hidden sm:inline">Room </span>No
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cost
                                    </th>
                                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created By
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {bookings.map((booking,index) => 
                                (<tr key={booking.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Icon icon="mdi:square-edit-outline" className="w-6 h-6 cursor-pointer" onClick={() => reset({editBookingId:booking.id})} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.id}
                                    </td>
                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.roomType}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.roomNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatCurrency(booking.cost)}
                                    </td>
                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(booking.bookingStartDate)}
                                    </td>
                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.createdBy}
                                    </td>
                                </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>)}
        
        <div className="mt-5 flex">
            <a href="#" onClick={toggleAbout}
            className="mr-3 flex text-gray-400 hover:text-gray-400 text-decoration-none">
            {!expandAbout
                ? <Icon icon="mdi:chevron-right" className="h-6 w-6" aria-hidden="true"/>
                : <Icon icon="mdi:chevron-down" className="h-6 w-6" aria-hidden="true"/>}
            About</a>
            <SrcLink href="https://github.com/NetCoreTemplates/nextjs/blob/main/api/MyApp.ServiceModel/Bookings.cs">
                <Icon icon="mdi:code-tags" className="w-5 h-5 inline" />
            </SrcLink>
            <SrcLink href="https://github.com/NetCoreTemplates/nextjs/blob/main/ui/pages/bookings-crud/index.tsx">
                <Icon icon="logos:vue" className="w-5 h-5 inline" />
            </SrcLink>
        </div>
        {!expandAbout ? null : 
        (<div className="mt-3 text-gray-500 max-w-screen-md">
            <h2 className="font-medium text-2xl mb-2">Creating a multi-user .NET Core Booking system in minutes</h2>
            <blockquote className="mb-4">
                The Bookings service implementation is built using
                <a href="https://docs.servicestack.net/autoquery-crud"> AutoQuery CRUD </a>
                which enables rapid development of typed CRUD Services using only declarative POCO DTOs, allowing for
                developing entire
                <a href="https://docs.servicestack.net/autoquery-crud#advanced-crud-example"> audited </a>
                and <a href="https://docs.servicestack.net/autoquery-audit-log"> verifiably logged </a>
                data-driven systems in a fraction of time
                <a href="https://docs.servicestack.net/autoquery-crud-bookings"> more...</a>
            </blockquote>
            <iframe className="youtube" src="https://www.youtube.com/embed/nhc4MZufkcM" frameBorder={0} allow="autoplay; encrypted-media" allowFullScreen />
        </div>)}
    </Page>)
}
export default ValidateAuth(Index, { role:'Employee' })
