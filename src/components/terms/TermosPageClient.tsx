'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TermsContent } from '@/components/terms/TermsContent'

type Tipo = 'clipador' | 'agencia'

interface TermsVersion {
  id: string
  versao: string
  conteudo: string
}

const TABS: { tipo: Tipo; label: string }[] = [
  { tipo: 'clipador', label: 'Clipador' },
  { tipo: 'agencia', label: 'Agência' },
]

export function TermosPageClient() {
  const [tipo, setTipo] = useState<Tipo>('clipador')
  const [versions, setVersions] = useState<Record<Tipo, TermsVersion | null>>({ clipador: null, agencia: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function run() {
      const supabase = createClient()
      const { data } = await supabase
        .from('terms_versions')
        .select('id, tipo, versao, conteudo, vigente_a_partir')
        .lte('vigente_a_partir', new Date().toISOString())
        .order('vigente_a_partir', { ascending: false })
      if (!active) return
      const byTipo: Record<Tipo, TermsVersion | null> = { clipador: null, agencia: null }
      for (const row of data ?? []) {
        const t = row.tipo as Tipo
        if (!byTipo[t]) byTipo[t] = { id: row.id, versao: row.versao, conteudo: row.conteudo }
      }
      setVersions(byTipo)
      setLoading(false)
    }
    run()
    return () => { active = false }
  }, [])

  const current = versions[tipo]

  return (
    <main className="min-h-screen bg-[#0B0F19]">
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        <div className="mb-8">
          <Link href="/landing" className="mb-6 inline-block text-sm text-white/40 transition-colors hover:text-white">
            ← Voltar ao site
          </Link>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#00E5A0]">
            MultiClip Hub
          </p>
          <h1 className="mb-4 text-3xl font-black text-white md:text-4xl">Termos de Uso</h1>
          <p className="text-sm text-white/40">Os termos mudam conforme o tipo de conta — escolha abaixo.</p>
        </div>

        <div className="mb-6 flex gap-2">
          {TABS.map(tab => (
            <button
              key={tab.tipo}
              onClick={() => setTipo(tab.tipo)}
              className={`rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors ${
                tipo === tab.tipo
                  ? 'border-[#00E5A0]/40 bg-[#00E5A0]/[0.08] text-[#00E5A0]'
                  : 'border-white/[0.08] text-white/50 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-4 w-full animate-pulse rounded bg-white/[0.06]" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-white/[0.06]" />
          </div>
        ) : current ? (
          <TermsContent versao={current.versao} conteudo={current.conteudo} />
        ) : (
          <p className="text-[13px] text-white/50">Nenhuma versão de termos publicada ainda para esse tipo de conta.</p>
        )}

        <div className="mt-12 flex gap-4 border-t border-white/10 pt-6 text-sm text-white/40">
          <Link href="/privacidade" className="transition-colors hover:text-white">
            Política de Privacidade
          </Link>
          <Link href="/landing" className="transition-colors hover:text-white">
            Início
          </Link>
        </div>
      </div>
    </main>
  )
}
