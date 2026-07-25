// Single source of truth for plan PRICING (client-safe — no secrets here).
// Stripe Price IDs live server-side in src/lib/stripe.
//
// Display rule: annual plans show the monthly-equivalent price (annualMonthlyPrice)
// on the site, but Stripe charges the full yearly total (annualTotal) once a year.

export type PlanId = 'clipper' | 'pro' | 'king'

export interface PlanPricing {
  id: PlanId
  name: string
  monthlyPrice: number       // BRL per month, monthly billing
  annualMonthlyPrice: number // BRL per month equivalent when billed annually
  annualTotal: number        // BRL charged once per year (annualMonthlyPrice * 12)
}

export const ANNUAL_DISCOUNT_PCT = 30

// Annual = 30% off the monthly, billed once per year:
//   monthly * 0.70 -> monthly-equivalent shown on site; * 12 -> yearly total charged.
export const PLAN_PRICES: Record<PlanId, PlanPricing> = {
  clipper: { id: 'clipper', name: 'Clipper', monthlyPrice: 57,  annualMonthlyPrice: 39.9,  annualTotal: 478.8 },
  pro:     { id: 'pro',     name: 'Pro',     monthlyPrice: 97,  annualMonthlyPrice: 67.9,  annualTotal: 814.8 },
  king:    { id: 'king',    name: 'King',    monthlyPrice: 197, annualMonthlyPrice: 137.9, annualTotal: 1654.8 },
}

/** Price shown on a card given the billing toggle (monthly-equivalent value). */
export function displayPrice(id: PlanId, annual: boolean): number {
  const p = PLAN_PRICES[id]
  return annual ? p.annualMonthlyPrice : p.monthlyPrice
}

/** Format a BRL amount PT-BR: integers stay clean ("57"), decimals show 2 places ("39,90"). */
export function formatPriceBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })
}
