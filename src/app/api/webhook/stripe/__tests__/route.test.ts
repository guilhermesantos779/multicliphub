import { describe, it, expect, vi } from 'vitest'
import Stripe from 'stripe'

// Dummy creds so getStripe() can construct a client and constructEvent has a
// secret to verify against. Stripe's constructor doesn't validate the key.
process.env.STRIPE_SECRET_KEY ||= 'sk_test_dummy'
process.env.STRIPE_WEBHOOK_SECRET ||= 'whsec_test_dummy'

// The admin client is built before the event switch — return a chainable no-op.
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      update: () => ({ eq: async () => ({ error: null }) }),
      select: () => ({ eq: async () => ({ data: [] }) }),
      insert: async () => ({ error: null }),
      single: async () => ({ data: null }),
    }),
  }),
}))
vi.mock('@/lib/discord/notify', () => ({ notifyDiscord: async () => {} }))

import { POST } from '@/app/api/webhook/stripe/route'

const SECRET = process.env.STRIPE_WEBHOOK_SECRET!
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function makeRequest(body: string, signature: string) {
  return new Request('http://localhost/api/webhook/stripe', {
    method: 'POST',
    body,
    headers: { 'stripe-signature': signature, 'Content-Type': 'application/json' },
  }) as never
}

describe('Stripe webhook route', () => {
  it('retorna 400 para assinatura inválida', async () => {
    const res = await POST(makeRequest('{}', 'bogus-signature'))
    expect(res.status).toBe(400)
  })

  it('retorna 200 para evento válido não tratado', async () => {
    const payload = JSON.stringify({ id: 'evt_test', type: 'unknown.event', data: { object: {} } })
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret: SECRET })
    const res = await POST(makeRequest(payload, header))
    expect(res.status).toBe(200)
  })
})
