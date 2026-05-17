import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: vi.fn(), language: 'ru' },
  }),
}))

import WhatsAppButton from '../components/WhatsAppButton'

describe('WhatsAppButton', () => {
  it('renders the WhatsApp link', () => {
    render(<WhatsAppButton />)
    const link = document.querySelector('a[href*="wa.me"]')
    expect(link).toBeTruthy()
    expect(link.getAttribute('href')).toContain('wa.me')
  })

  it('opens in new tab', () => {
    render(<WhatsAppButton />)
    const link = document.querySelector('a[href*="wa.me"]')
    expect(link.getAttribute('target')).toBe('_blank')
  })
})
