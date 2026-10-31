import { afterEach } from 'vite-plus/test'
import { cleanup } from '@testing-library/react'

// Cleanup after each test (only needed for React component tests)
afterEach(() => {
    cleanup()
})
