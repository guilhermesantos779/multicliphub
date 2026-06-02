'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import {
  normalizeUsername, validateUsername, USERNAME_ERROR_MESSAGE,
} from '@/lib/username'

interface CheckResult {
  available: boolean | null // null = not checked yet / checking
  message: string
  isChecking: boolean
}

const IDLE: CheckResult = { available: null, message: '', isChecking: false }

export function useUsernameCheck(currentUsername?: string) {
  const [result, setResult] = useState<CheckResult>(IDLE)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const reqIdRef = useRef(0)

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  const check = useCallback((value: string) => {
    const normalized = normalizeUsername(value)
    clearTimeout(debounceRef.current)

    // Keeping their current nick — no check needed
    if (currentUsername && normalized === currentUsername.toLowerCase()) {
      setResult({ available: true, message: 'Seu nickname atual', isChecking: false })
      return
    }

    if (!normalized) { setResult(IDLE); return }

    // Client-side validation first (no network)
    const err = validateUsername(normalized)
    if (err) {
      setResult({ available: false, message: USERNAME_ERROR_MESSAGE[err], isChecking: false })
      return
    }

    // Debounced availability call (500ms after typing stops)
    setResult({ available: null, message: '', isChecking: true })
    const reqId = ++reqIdRef.current
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/username/check?username=${encodeURIComponent(normalized)}`)
        const data = await res.json()
        if (reqId !== reqIdRef.current) return // a newer keystroke superseded this
        setResult({ available: data.available, message: data.message, isChecking: false })
      } catch {
        if (reqId !== reqIdRef.current) return
        setResult({ available: null, message: 'Erro ao verificar disponibilidade', isChecking: false })
      }
    }, 500)
  }, [currentUsername])

  return { result, check }
}
