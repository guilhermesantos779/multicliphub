import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { notifyDiscord } from '@/lib/discord/notify'
import type Stripe from 'stripe'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const ROLE_MAP: Record<string, string> = {
  clipper: 'clipper',
  pro: 'pro',
  king: 'king',
}

function getPlanFromPrice(): Record<string, string> {
  return {
    [process.env.STRIPE_PRICE_CLIPPER_MONTHLY || '']: 'clipper',
    [process.env.STRIPE_PRICE_CLIPPER_ANNUAL  || '']: 'clipper',
    [process.env.STRIPE_PRICE_PRO_MONTHLY     || '']: 'pro',
    [process.env.STRIPE_PRICE_PRO_ANNUAL      || '']: 'pro',
    [process.env.STRIPE_PRICE_KING_MONTHLY    || '']: 'king',
    [process.env.STRIPE_PRICE_KING_ANNUAL     || '']: 'king',
  }
}

async function updateUserPlan(userId: string, plan: string, subId: string) {
  const admin = getSupabaseAdmin()
  await admin
    .from('profiles')
    .update({
      plan,
      role: ROLE_MAP[plan] || 'clipper',
      stripe_subscription_id: subId,
      plan_expires_at: null,
    })
    .eq('id', userId)

  // Notify the Discord bot so it can announce the upgrade and sync the role.
  // No-op until BOT_WEBHOOK_URL / BOT_WEBHOOK_SECRET are configured.
  const { data: profile } = await admin
    .from('profiles')
    .select('username, discord_id')
    .eq('id', userId)
    .single()
  if (profile) {
    await notifyDiscord('plan.upgraded', {
      username: profile.username,
      plan,
      discord_id: profile.discord_id ?? undefined,
    })
  }
}

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body, sig, process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  const supabaseAdmin = getSupabaseAdmin()
  const PLAN_FROM_PRICE = getPlanFromPrice()

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId  = session.metadata?.supabase_user_id
        const plan    = session.metadata?.plan
        if (userId && plan && session.subscription) {
          await updateUserPlan(userId, plan, session.subscription as string)
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub     = event.data.object as Stripe.Subscription
        const userId  = sub.metadata?.supabase_user_id
        const priceId = sub.items.data[0]?.price.id
        const plan    = priceId ? PLAN_FROM_PRICE[priceId] : undefined
        if (userId && plan) {
          await updateUserPlan(userId, plan, sub.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub    = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              plan: null,
              role: 'trial',
              stripe_subscription_id: null,
            })
            .eq('id', userId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice    = event.data.object as Stripe.Invoice
        const customerId = typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id
        if (customerId) {
          const { data: profiles } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', customerId)
          if (profiles?.[0]) {
            await supabaseAdmin
              .from('notifications')
              .insert({
                user_id: profiles[0].id,
                type:    'payment_failed',
                title:   'Falha no pagamento',
                message: 'Não conseguimos processar seu pagamento. Verifique seu cartão.',
              })
          }
        }
        break
      }
    }
  } catch (err) {
    // Return 500 so Stripe retries — a swallowed DB failure here would mean the
    // user paid but never got their plan, with no redelivery.
    console.error(`Webhook handler error for ${event.type}:`, err)
    return NextResponse.json({ error: 'Handler failed, will retry' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
