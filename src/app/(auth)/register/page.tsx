'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/shared/Logo'

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('As senhas não coincidem'); return }
    if (password.length < 8) { setError('Senha deve ter mínimo 8 caracteres'); return }
    if (!agreed) { setError('Aceite os termos para continuar'); return }

    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const handleGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const fields = [
    { label: 'Nome completo', value: name, set: setName, type: 'text', placeholder: 'Seu nome' },
    { label: 'E-mail', value: email, set: setEmail, type: 'email', placeholder: 'seu@email.com' },
    { label: 'Senha', value: password, set: setPassword, type: 'password', placeholder: 'Mínimo 8 caracteres' },
    { label: 'Confirmar senha', value: confirm, set: setConfirm, type: 'password', placeholder: 'Repita a senha' },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo height={36} variant="mint" />
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-7">
          <div className="mb-6 text-center">
            <h1 className="text-[20px] font-semibold text-white">Crie sua conta</h1>
            <p className="mt-1 text-[13px] text-[#555555]">7 dias grátis · Sem cartão de crédito</p>
          </div>

          <button
            onClick={handleGoogle}
            className="mb-4 flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.1] bg-white py-2.5 text-[13px] font-medium text-black transition-all hover:bg-white/90"
          >
            <GoogleIcon />
            Continuar com Google
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[11px] text-[#333333]">ou</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            {fields.map(f => (
              <div key={f.label}>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">{f.label}</label>
                <input
                  type={f.type}
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  required
                  placeholder={f.placeholder}
                  className="w-full rounded-lg border border-white/[0.08] bg-[#111111] px-3 py-2.5 text-[13px] text-white placeholder-[#333333] outline-none transition-colors focus:border-[#00E5A0]/50"
                />
              </div>
            ))}

            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#9146FF]"
              />
              <span className="text-[11px] leading-relaxed text-[#444444]">
                Concordo com os{' '}
                <Link href="/terms" target="_blank" className="text-[#00E5A0] hover:underline">Termos de Uso</Link>
                {' '}e{' '}
                <Link href="/privacy" target="_blank" className="text-[#00E5A0] hover:underline">Política de Privacidade</Link>
              </span>
            </label>

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
              {loading ? 'Criando conta...' : 'Criar minha conta'}
            </button>
          </form>

          <p className="mt-4 text-center text-[12px] text-[#444444]">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-[#00E5A0] hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
