import { describe, expect, it, vi } from 'vite-plus/test'
import { render, screen } from '@testing-library/react'
import { client } from '@/lib/gateway'
import { HelloResponse } from '@/lib/dtos'
import { HelloApi } from './intro'

describe('HelloApi', () => {
    it('renders the API response', async () => {
        const get = vi.spyOn(client, 'get').mockResolvedValue(new HelloResponse({ result: 'Hello, Vite+!' }))

        render(<HelloApi name="Vite+" />)

        expect(await screen.findByText('Hello, Vite+!')).toBeTruthy()
        expect(get).toHaveBeenCalledOnce()
    })
})
