import { describe, it, expect } from 'vitest'
import {
  usernameSchema,
  checkoutSchema,
  createTicketSchema,
  createPublicationSchema,
} from '../index'

describe('usernameSchema', () => {
  it('aceita username válido', () => {
    expect(usernameSchema.safeParse('rochaqi').success).toBe(true)
    expect(usernameSchema.safeParse('clipper_123').success).toBe(true)
    expect(usernameSchema.safeParse('user-name').success).toBe(true)
  })

  it('rejeita username muito curto', () => {
    expect(usernameSchema.safeParse('ab').success).toBe(false)
  })

  it('rejeita username muito longo', () => {
    expect(usernameSchema.safeParse('a'.repeat(21)).success).toBe(false)
  })

  it('rejeita caracteres especiais e maiúsculas', () => {
    expect(usernameSchema.safeParse('user@name').success).toBe(false)
    expect(usernameSchema.safeParse('user name').success).toBe(false)
    expect(usernameSchema.safeParse('UserName').success).toBe(false)
  })
})

describe('checkoutSchema', () => {
  it('aceita planos válidos', () => {
    expect(checkoutSchema.safeParse({ plan: 'clipper', billing: 'monthly' }).success).toBe(true)
    expect(checkoutSchema.safeParse({ plan: 'king', billing: 'annual' }).success).toBe(true)
  })

  it('rejeita plano inválido', () => {
    expect(checkoutSchema.safeParse({ plan: 'basic', billing: 'monthly' }).success).toBe(false)
  })

  it('rejeita billing inválido', () => {
    expect(checkoutSchema.safeParse({ plan: 'pro', billing: 'weekly' }).success).toBe(false)
  })
})

describe('createTicketSchema', () => {
  it('aceita ticket válido', () => {
    const result = createTicketSchema.safeParse({
      subject: 'Problema no upload',
      category: 'bug',
      message: 'O upload falha ao tentar publicar no TikTok.',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita subject muito curto', () => {
    expect(createTicketSchema.safeParse({ subject: 'Bug', category: 'bug' }).success).toBe(false)
  })

  it('rejeita categoria inválida', () => {
    expect(createTicketSchema.safeParse({
      subject: 'Problema no sistema',
      category: 'reclamacao',
    }).success).toBe(false)
  })
})

describe('createPublicationSchema', () => {
  it('aceita publicação válida', () => {
    expect(createPublicationSchema.safeParse({
      title: 'Meu clipe do dia',
      platforms: ['tiktok', 'instagram'],
    }).success).toBe(true)
  })

  it('rejeita sem plataformas', () => {
    expect(createPublicationSchema.safeParse({ title: 'Clipe', platforms: [] }).success).toBe(false)
  })

  it('rejeita plataforma inválida', () => {
    expect(createPublicationSchema.safeParse({ title: 'Clipe', platforms: ['facebook'] }).success).toBe(false)
  })

  it('rejeita hashtags demais', () => {
    expect(createPublicationSchema.safeParse({
      title: 'Clipe',
      platforms: ['tiktok'],
      hashtags: Array.from({ length: 31 }, (_, i) => `tag${i}`),
    }).success).toBe(false)
  })
})
