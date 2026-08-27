'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/shared/Logo'

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/redefinir-senha')}`,
    })
    setLoading(false)
    if (error) {
      setError('Não foi possível enviar o e-mail. Tente novamente em instantes.')
      return
    }
    setSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo height={36} variant="mint" />
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-7">
          {sent ? (
            <div className="text-center">
              <div className="mb-3 text-4xl">📬</div>
              <h1 className="text-[18px] font-semibold text-white">Verifique seu e-mail</h1>
              <p className="mt-2 text-[13px] text-[#888888]">
                Se existir uma conta com o e-mail <span className="text-white">{email}</span>, enviamos um link pra redefinir sua senha.
              </p>
              <Link href="/login" className="mt-5 inline-block text-[13px] text-[#00E5A0] hover:underline">
                Voltar pro login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-[20px] font-semibold text-white">Esqueceu sua senha?</h1>
                <p className="mt-1 text-[13px] text-[#555555]">Enviamos um link de redefinição pro seu e-mail</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
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
                  disabled={loading}
                  className="w-full rounded-xl bg-[#00E5A0] py-3 text-[13px] font-medium text-[#0B0F19] font-semibold transition-colors hover:bg-[#00B584] disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar link de redefinição'}
                </button>
              </form>

              <p className="mt-4 text-center text-[12px] text-[#444444]">
                Lembrou a senha?{' '}
                <Link href="/login" className="text-[#00E5A0] hover:underline">Voltar pro login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
