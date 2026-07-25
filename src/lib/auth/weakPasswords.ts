// src/lib/auth/weakPasswords.ts
// Lightweight, offline weak-password guard. Not a replacement for HaveIBeenPwned
// (a Supabase Pro feature), but it blocks the credential-stuffing fodder most
// likely to appear in breach dumps, plus trivial patterns and self-referential
// passwords. Runs client-side at sign-up.

// Top breached/common passwords (normalized lowercase). Kept small on purpose —
// these cover the overwhelming majority of "weakest" real-world choices.
const COMMON = new Set([
  '12345678', '123456789', '1234567890', '12345678910', '123123123',
  'password', 'password1', 'password123', 'passw0rd', 'senha123', 'senha1234',
  'qwerty123', 'qwertyuiop', 'asdfghjkl', '1q2w3e4r', '1q2w3e4r5t',
  'abc12345', 'a1b2c3d4', '11111111', '00000000', 'aaaaaaaa',
  'iloveyou', 'admin123', 'welcome1', 'welcome123', 'letmein1',
  'football', 'baseball', 'sunshine', 'princess', 'dragon123',
  'monkey123', 'master123', 'superman', 'batman123', 'trustno1',
  'whatever1', 'computer1', 'samsung123', 'google123', 'mudar123',
  'brasil123', 'flamengo1', 'corinthians', 'gremio123', 'palmeiras',
])

// A few obvious keyboard/numeric runs (checked case-insensitively).
const SEQUENCES = [
  'abcdefgh', 'qwertyui', 'asdfghjk', '01234567', '12345678', '87654321',
]

interface Context {
  email?: string
  username?: string
}

export function isWeakPassword(password: string, ctx: Context = {}): boolean {
  const pw = password.trim().toLowerCase()
  if (pw.length < 8) return true
  if (COMMON.has(pw)) return true

  // All identical characters, e.g. "aaaaaaaa" / "00000000".
  if (/^(.)\1+$/.test(pw)) return true

  // Contains a long keyboard/numeric run.
  if (SEQUENCES.some(seq => pw.includes(seq))) return true

  // Self-referential: password is basically the username or email local-part.
  const username = ctx.username?.trim().toLowerCase()
  if (username && username.length >= 4 && pw.includes(username)) return true

  const localPart = ctx.email?.split('@')[0]?.trim().toLowerCase()
  if (localPart && localPart.length >= 4 && pw.includes(localPart)) return true

  return false
}
