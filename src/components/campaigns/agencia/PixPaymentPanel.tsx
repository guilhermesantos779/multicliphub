'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatCurrencyBRL } from '@/lib/utils'

interface PixPaymentPanelProps {
  totalCents: number
  onConfirmed: () => void
}

// TODO: substituir QR code e código copia-e-cola mockados pela integração
// real com Asaas (Agente 4 — pagamentos-asaas). O polling de confirmação
// também deve vir de um webhook real, não do botão de simulação abaixo.
const MOCK_PIX_CODE =
  '00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-mock-multicliphub5204000053039865802BR5920MULTICLIP HUB LTDA6009SAO PAULO62070503***6304ABCD'

function MockQrCode() {
  const cells = Array.from({ length: 121 }, (_, i) => {
    const seed = (i * 37 + 11) % 100
    return seed > 45
  })

  return (
    <div className="grid aspect-square w-full max-w-[168px] grid-cols-11 gap-[2px] rounded-lg bg-white p-3">
      {cells.map((filled, i) => (
        <div key={i} className={filled ? 'bg-[#0B0F19]' : 'bg-white'} />
      ))}
    </div>
  )
}

export function PixPaymentPanel({ totalCents, onConfirmed }: PixPaymentPanelProps) {
  const [copied, setCopied] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(MOCK_PIX_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSimulateConfirmation = () => {
    setConfirming(true)
    setTimeout(() => {
      onConfirmed()
    }, 1200)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 rounded-2xl border border-white/[0.08] bg-[#111111] p-6 text-center">
      <div>
        <div className="text-[12px] uppercase tracking-wide text-[#666666]">Total a pagar via Pix</div>
        <div className="text-[26px] font-semibold text-white">{formatCurrencyBRL(totalCents)}</div>
      </div>

      <MockQrCode />

      <div className="w-full">
        <div className="mb-1.5 text-left text-[11px] font-medium uppercase tracking-wide text-[#444444]">
          Pix copia e cola
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2 text-left text-[11px] text-[#888888]">
            {MOCK_PIX_CODE}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-lg bg-white/[0.06] px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-white/[0.1]"
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-[#f59e0b]/[0.08] px-3 py-2 text-[12px] text-[#f59e0b]">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="inline-block h-3 w-3 rounded-full border-2 border-[#f59e0b] border-t-transparent"
        />
        Aguardando confirmação de pagamento
      </div>

      {/* Ação apenas para revisão/demo local — a confirmação real chega via webhook do Asaas */}
      <button
        type="button"
        onClick={handleSimulateConfirmation}
        disabled={confirming}
        className="text-[11px] text-[#444444] underline decoration-dotted transition-colors hover:text-[#888888] disabled:opacity-50"
      >
        {confirming ? 'Simulando confirmação…' : 'Simular confirmação (mock)'}
      </button>
    </div>
  )
}
