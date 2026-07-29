import { randomBytes } from 'crypto'

// Toggle between the two invite-redemption UX variants requested for review:
// - 'manual': redeeming a code creates a 'pendente' row; agency staff must
//   approve it (POST /api/agencia/roster/[memberId]/approve) before the
//   clipper is 'ativo' and counted in the roster/metrics.
// - 'auto': redeeming a code activates the membership immediately
//   ('ativo', joined_at = now()) — no approval step, staff can still remove
//   anyone anytime.
// The roster UI adapts on its own (it only renders a "pendentes" section
// when such rows exist), so switching this one constant is enough to demo
// both behaviors end-to-end.
export const INVITE_APPROVAL_MODE: 'manual' | 'auto' = 'manual'

export function generateInviteCode(): string {
  return randomBytes(6).toString('base64url')
}
