import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, dateInputFormat } from './utils'

describe('utils', () => {
  describe('formatCurrency', () => {
    it('should format number as USD currency', () => {
      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })

    it('should return empty string for falsy values', () => {
      expect(formatCurrency(undefined)).toBe('')
      expect(formatCurrency(0)).toBe('')
    })
  })

  describe('dateInputFormat', () => {
    it('should format date with dashes', () => {
      const date = new Date('2025-11-11T00:00:00Z')
      const result = dateInputFormat(date)
      // Result will be in format like "11-11-2025" or "2025-11-11" depending on locale
      expect(result).toMatch(/\d{1,4}-\d{1,2}-\d{1,4}/)
    })
  })
})

