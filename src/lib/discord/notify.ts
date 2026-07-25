// Server-only helper that forwards app events to the MultiBot webhook.
//
// IMPORTANT: this reads BOT_WEBHOOK_SECRET — never import it from a Client
// Component. It is a no-op until BOT_WEBHOOK_URL + BOT_WEBHOOK_SECRET are set
// (i.e. after the bot is deployed on Railway), so it is safe to wire the call
// sites in advance.

export type DiscordEventType =
  | 'ticket.created'
  | 'ticket.status_changed'
  | 'achievement.unlocked'
  | 'ranking.updated'
  | 'plan.upgraded'

export async function notifyDiscord(
  type: DiscordEventType,
  data: object
): Promise<void> {
  const botUrl = process.env.BOT_WEBHOOK_URL
  const secret = process.env.BOT_WEBHOOK_SECRET
  if (!botUrl || !secret) return // bot not configured, skip silently

  try {
    await fetch(`${botUrl}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-multicliphub-signature': secret,
      },
      body: JSON.stringify({ type, data }),
    })
  } catch {
    // Non-critical — a bot notification failure must never break the app.
  }
}
