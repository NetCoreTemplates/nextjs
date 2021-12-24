import { dateFmt, toDate, toDateFmt } from "@servicestack/client"

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})
export const formatCurrency = (n?:number) => n ? formatter.format(n) : ''
export const formatDate = (s?:string) => s ? toDateFmt(s) : ''

export const dateInputFormat = (d:Date) => dateFmt(d).replace(/\//g,'-')

export function sanitizeForUi(dto:any) {
    if (!dto) return {}
    Object.keys(dto).forEach(key => {
        let value = dto[key]
        if (typeof value == 'string') {
            if (value.startsWith('/Date'))
                dto[key] = dateInputFormat(toDate(value))
        }
    })
    return dto
}