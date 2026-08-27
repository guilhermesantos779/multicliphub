'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/shared/Logo'

export default function RedefinirSenhaPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  // The /auth/callback route already exchanged the recovery code for a
  // session before redirecting here — just confirm one exists before
  // letting the user submit a new password.
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setError('Link expirado ou inválido. Solicite um novo link de redefinição.')
      }
      setReady(true)
    })
  }, [])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError('Não foi possível redefinir a senha. Solicite um novo link.')
      return
    }
    router.push('/inicio')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo height={36} variant="mint" />
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-7">
          <div className="mb-6 text-center">
            <h1 className="text-[20px] font-semibold text-white">Nova senha</h1>
            <p className="mt-1 text-[13px] text-[#555555]">Escolha uma nova senha pra sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">Nova senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-lg border border-white/[0.08] bg-[#111111] px-3 py-2.5 text-[13px] text-white placeholder-[#333333] outline-none transition-colors focus:border-[#00E5A0]/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">Confirmar senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                placeholder="Repita a senha"
                className="w-full rounded-lg border border-white/[0.08] bg-[#111111] px-3 py-2.5 text-[13px] text-white placeholder-[#333333] outline-none transition-colors focus:border-[#00E5A0]/50"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-[#ef4444]/20 bg-[#ef4444]/[0.08] px-3 py-2 text-[12px] text-[#ef4444]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !ready}
              className="w-full rounded-xl bg-[#00E5A0] py-3 text-[13px] font-medium text-[#0B0F19] font-semibold transition-colors hover:bg-[#00B584] disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Redefinir senha'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
