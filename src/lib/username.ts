// Single source of truth for nickname (username) rules — shared by the
// availability API, the register form, and the profile editor.
// Keep in sync with the DB constraint `username_format` and the
// generate_username() / handle_new_user() triggers.

export const USERNAME_REGEX = /^[a-z0-9_-]{3,20}$/
export const USERNAME_MIN = 3
export const USERNAME_MAX = 20

// Routes / brand words that cannot be used as nicknames.
export const RESERVED_USERNAMES = [
  'admin', 'suporte', 'api', 'www', 'multicliphub', 'help',
  'ranking', 'perfil', 'config', 'login', 'register',
  'dashboard', 'upload', 'analytics', 'historico', 'canais',
] as const

/** Lowercase + trim. Usernames are always stored and compared lowercase. */
export function normalizeUsername(value: string): string {
  return value.toLowerCase().trim()
}

export type UsernameError = 'empty' | 'too_short' | 'too_long' | 'format' | 'reserved'

/** Returns null when valid, or a machine-readable error code. */
export function validateUsername(value: string): UsernameError | null {
  const u = normalizeUsername(value)
  if (!u) return 'empty'
  if (u.length < USERNAME_MIN) return 'too_short'
  if (u.length > USERNAME_MAX) return 'too_long'
  if (!USERNAME_REGEX.test(u)) return 'format'
  if ((RESERVED_USERNAMES as readonly string[]).includes(u)) return 'reserved'
  return null
}

/** PT-BR user-facing message for each error code. */
export const USERNAME_ERROR_MESSAGE: Record<UsernameError, string> = {
  empty: 'Escolha um nickname',
  too_short: 'Mínimo 3 caracteres',
  too_long: 'Máximo 20 caracteres',
  format: 'Use apenas letras, números, _ ou -',
  reserved: 'Este nickname é reservado',
}
