import React, { ChangeEvent, FormEventHandler, useState } from "react"
import { Icon } from "@iconify/react"

import {
    CloseButton,
    PrimaryButton,
    ErrorSummary,
    TextInput,
    TextAreaInput,
    SelectInput, 
} from "../../components/form"
import SrcLink from "../../components/src-link"

import { useClient, useApp, ApiContext } from "../../lib/gateway"
import { CreateBooking, RoomType } from "../../lib/dtos"
import { dateInputFormat } from "../../lib/utils"

type CreateProps = {
    className?: string
    onDone: () => void
}
function Create ({ className, onDone }:CreateProps) {

    const visibleFields = "name,roomType,roomNumber,bookingStartDate,bookingEndDate,cost,notes"

    const app = useApp()
    const client = useClient()

    const [request, setRequest] = useState(new CreateBooking({
        roomType: RoomType.Single,
        roomNumber: 0,
        cost: 0,
        bookingStartDate: dateInputFormat(new Date())
    }))

    const onSubmit:FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const api = await client.api(request)
        if (api.succeeded) onDone()
    }

    const change = (f:(dto:CreateBooking,value:string) => void) => {
        return (e:ChangeEvent<HTMLInputElement>) => {
            f(request, e.target.value)
            setRequest(new CreateBooking(request))
        }
    }

    return (<ApiContext.Provider value={client}>
<form onSubmit={onSubmit} className={className}>
<div className="shadow overflow-hidden sm:rounded-md bg-white">
    <div className="relative px-4 py-5 bg-white sm:p-6">

        <CloseButton onClose={onDone}/>
    
        <fieldset>
            <legend className="text-base font-medium text-gray-900 text-center mb-4">New Booking</legend>
    
            <ErrorSummary except={visibleFields} className="mb-4" />
    
            <div className="grid grid-cols-6 gap-6">
    
                <div className="col-span-6 sm:col-span-3">
                    <TextInput id="name" required placeholder="Name for this booking"
                       defaultValue={request.name} onChange={change((x,value) => x.name = value)} />
                </div>
        
                <div className="col-span-6 sm:col-span-3">
                    <SelectInput id="roomType" options={app.enumOptions('RoomType')}
                       defaultValue={request.roomType} onChange={change((x,value) => x.roomType = value as RoomType)} />
                </div>
            
                <div className="col-span-6 sm:col-span-3">
                    <TextInput type="number" id="roomNumber" min="0" required
                       defaultValue={request.roomNumber} onChange={change((x,value) => x.roomNumber = Number(value))} />
                </div>
            
                <div className="col-span-6 sm:col-span-3">
                    <TextInput type="number" id="cost" min="0" required
                       defaultValue={request.cost} onChange={change((x,value) => x.cost = Number(value))} />
                </div>
            
                <div className="col-span-6 sm:col-span-3">
                    <TextInput type="date" id="bookingStartDate" required
                       defaultValue={request.bookingStartDate} onChange={change((x,value) => x.bookingStartDate = value)} />
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <TextInput type="date" id="bookingEndDate"
                       defaultValue={request.bookingEndDate} onChange={change((x,value) => x.bookingEndDate = value)} />
                </div>
            
                <div className="col-span-6">
                    <TextAreaInput id="notes" placeholder="Notes about this booking" style={{ height: '6rem' }}
                       defaultValue={request.notes} onChange={change((x,value) => x.notes = value)} />
                </div>
            </div>
        </fieldset>
    </div>

    <div className="mt-4 px-4 py-3 bg-gray-50 text-right sm:px-6">
        <div className="flex justify-between items-center">
            <SrcLink href="https://github.com/NetCoreTemplates/nextjs/blob/main/ui/pages/bookings-crud/create.tsx">
                <Icon icon="logos:vue" className="w-5 h-5 inline" />
            </SrcLink>
            <div><PrimaryButton>Create Booking</PrimaryButton></div>
        </div>
    </div>

</div>
</form>
</ApiContext.Provider>)
}
export default Create
