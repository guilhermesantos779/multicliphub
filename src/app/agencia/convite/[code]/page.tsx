'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

type RedeemState = 'loading' | 'success' | 'error'

export default function AgencyInvitePage() {
  const { code } = useParams<{ code: string }>()
  const router = useRouter()
  const [state, setState] = useState<RedeemState>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [memberStatus, setMemberStatus] = useState<'pendente' | 'ativo' | null>(null)

  useEffect(() => {
    let cancelled = false
    async function redeem() {
      const res = await fetch('/api/agencia/roster/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const json = await res.json()
      if (cancelled) return
      if (!res.ok) {
        setErrorMessage(json.error ?? 'Erro ao entrar na agência')
        setState('error')
        return
      }
      setMemberStatus(json.member?.status ?? null)
      setState('success')
    }
    redeem()
    return () => { cancelled = true }
  }, [code])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] px-4 py-10">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8 flex justify-center">
          <Logo height={36} variant="mint" />
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-7">
          {state === 'loading' && (
            <p className="text-[13px] text-[#888888]">Verificando convite...</p>
          )}
          {state === 'success' && (
            <>
              <div className="mb-3 text-4xl">🎉</div>
              <h1 className="text-[18px] font-semibold text-white">
                {memberStatus === 'ativo' ? 'Você entrou no time!' : 'Pedido enviado!'}
              </h1>
              <p className="mt-2 text-[13px] text-[#888888]">
                {memberStatus === 'ativo'
                  ? 'Você já faz parte do time dessa agência.'
                  : 'A agência vai revisar seu pedido de entrada no time.'}
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="mt-5 w-full rounded-xl bg-[#00E5A0] py-3 text-[13px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584]"
              >
                Ir para o dashboard
              </button>
            </>
          )}
          {state === 'error' && (
            <>
              <div className="mb-3 text-4xl">😕</div>
              <h1 className="text-[18px] font-semibold text-white">Não deu certo</h1>
              <p className="mt-2 text-[13px] text-[#888888]">{errorMessage}</p>
              <Link
                href="/dashboard"
                className="mt-5 inline-block text-[13px] text-[#00E5A0] hover:underline"
              >
                Voltar pro dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
