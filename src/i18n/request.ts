import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

// Cookie-based i18n (no URL routing). The active locale lives in the `LOCALE`
// cookie, set by the header LanguageSelector. Default is pt-BR.
export const LOCALES = ['pt-BR', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'pt-BR'
export const LOCALE_COOKIE = 'LOCALE'

export default getRequestConfig(async () => {
  const store = await cookies()
  const requested = store.get(LOCALE_COOKIE)?.value
  const locale: Locale = LOCALES.includes(requested as Locale)
    ? (requested as Locale)
    : DEFAULT_LOCALE

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
