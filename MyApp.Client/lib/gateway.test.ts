import { describe, expect, it } from 'vite-plus/test'
import { cn } from './utils'
import { getRedirect, Routes } from './gateway'

describe('cn', () => {
    it('merges conflicting tailwind classes', () => {
        expect(cn('p-2 text-sm', 'p-4')).toBe('text-sm p-4')
    })

    it('ignores falsy values', () => {
        expect(cn('a', false, null, undefined, 'c')).toBe('a c')
    })
})

describe('gateway', () => {
    it('builds signin routes', () => {
        expect(Routes.signin()).toBe('/signin')
        expect(Routes.signin('/bookings-auto')).toBe('/signin?redirect=/bookings-auto')
    })

    it('reads redirect from search params', () => {
        expect(getRedirect(new URLSearchParams('redirect=/profile'))).toBe('/profile')
        expect(getRedirect(new URLSearchParams())).toBeNull()
        expect(getRedirect({ redirect: ['/a', '/b'] })).toBe('/a')
    })
})
