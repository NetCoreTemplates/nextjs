import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test (only needed for React component tests)
afterEach(() => {
  cleanup()
})

