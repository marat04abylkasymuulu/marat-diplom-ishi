import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('axios', () => {
  const instance = {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  }
  return {
    default: { create: () => instance, ...instance },
  }
})

describe('API utility functions', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('api module exports expected functions', async () => {
    const api = await import('../utils/api')
    expect(api.getCourses).toBeDefined()
    expect(api.getCategories).toBeDefined()
    expect(api.getTeachers).toBeDefined()
    expect(api.getReviews).toBeDefined()
    expect(api.getAchievements).toBeDefined()
    expect(api.getNews).toBeDefined()
    expect(api.getBranches).toBeDefined()
    expect(api.submitContact).toBeDefined()
    expect(api.getFeedbacks).toBeDefined()
    expect(api.submitFeedback).toBeDefined()
    expect(api.getSitePromo).toBeDefined()
    expect(api.resolveMapLink).toBeDefined()
  })
})
