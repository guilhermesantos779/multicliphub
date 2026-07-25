'use client'
import { useEffect } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useUsernameCheck } from '@/hooks/useUsernameCheck'
import { normalizeUsername, USERNAME_MAX } from '@/lib/username'

interface UsernameInputProps {
  value: string
  onChange: (value: string) => void
  /** Editor only: the user's CURRENT username, so an unchanged value skips the check. */
  currentUsername?: string
  disabled?: boolean
  /** Reports availability so the parent can block submit. */
  onAvailabilityChange?: (available: boolean | null, isChecking: boolean) => void
  autoFocus?: boolean
}

export function UsernameInput({
  value, onChange, currentUsername, disabled, onAvailabilityChange, autoFocus,
}: UsernameInputProps) {
  const { result, check } = useUsernameCheck(currentUsername)

  // Run an initial check (covers a pre-filled value in the editor)
  useEffect(() => { check(value) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onAvailabilityChange?.(result.available, result.isChecking)
  }, [result.available, result.isChecking]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(raw: string) {
    const normalized = normalizeUsername(raw)
    onChange(normalized)
    check(normalized)
  }

  const { available, isChecking, message } = result
  const borderColor =
    isChecking ? 'focus:border-white/30'
    : available === true ? 'border-[#00E5A0]/50 focus:border-[#00E5A0]/60'
    : available === false ? 'border-[#ef4444]/50 focus:border-[#ef4444]/60'
    : 'focus:border-[#00E5A0]/50'

  const messageColor =
    available === true ? 'text-[#00E5A0]'
    : available === false ? 'text-[#ef4444]'
    : 'text-white/50'

  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-[13px] text-[#555555]">
          @
        </span>
        <input
          type="text"
          inputMode="text"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoFocus={autoFocus}
          disabled={disabled}
          value={value}
          maxLength={USERNAME_MAX}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="seu_nickname"
          aria-invalid={available === false}
          className={[
            'w-full rounded-lg border bg-[#111111] py-2.5 pl-7 pr-10 text-[13px] text-white',
            'placeholder-[#333333] outline-none transition-colors border-white/[0.08]',
            'disabled:opacity-50',
            borderColor,
          ].join(' ')}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {isChecking ? (
            <Loader2 size={16} className="animate-spin text-white/40" />
          ) : available === true ? (
            <CheckCircle size={16} className="text-[#00E5A0]" />
          ) : available === false ? (
            <XCircle size={16} className="text-[#ef4444]" />
          ) : null}
        </span>
      </div>

      {message && <p className={`mt-1.5 text-[12px] ${messageColor}`}>{message}</p>}

      <p className="mt-1.5 text-[11px] text-[#444444]">
        Seu perfil ficará em multicliphub.com/perfil/
        <span className="text-[#666666]">{value || 'seu_nickname'}</span>
      </p>
    </div>
  )
}
