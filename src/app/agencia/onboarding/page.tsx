'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/shared/Logo'
import { useToast } from '@/components/shared/Toast'
import type { AgencyProfileType, AgencySocialLink } from '@/types/campaigns.types'

const SOCIAL_PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'X (Twitter)']

export default function AgencyOnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [type, setType] = useState<AgencyProfileType>('agency')
  const [name, setName] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [socialLinks, setSocialLinks] = useState<AgencySocialLink[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    // Usa data URL (não blob:) porque a CSP do projeto só libera `img-src` para 'self' | data: | https:
    const reader = new FileReader()
    reader.onload = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const addSocialLink = () => {
    setSocialLinks(prev => [...prev, { id: crypto.randomUUID(), platform: SOCIAL_PLATFORMS[0], url: '' }])
  }

  const updateSocialLink = (id: string, patch: Partial<AgencySocialLink>) => {
    setSocialLinks(prev => prev.map(link => (link.id === id ? { ...link, ...patch } : link)))
  }

  const removeSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast('Informe o nome da agência ou influenciador', 'error')
      return
    }

    setSubmitting(true)

    // TODO: substituir por chamada real: upload da logo pro Storage +
    // insert em `agency_profiles` (Supabase) quando as migrations do
    // Agente 1 (schema-backend) estiverem mergeadas.
    await new Promise(resolve => setTimeout(resolve, 600))

    setSubmitting(false)
    toast('Perfil criado com sucesso!', 'success')
    router.push('/agencia/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center">
          <Logo height={36} variant="mint" />
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-7">
          <div className="mb-6 text-center">
            <h1 className="text-[20px] font-semibold text-white">Crie seu perfil de campanhas</h1>
            <p className="mt-1 text-[13px] text-[#555555]">
              Conte pra gente quem é você para começar a lançar campanhas para clippers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">
                Tipo de perfil
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['agency', 'influencer'] as AgencyProfileType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded-xl border px-4 py-3 text-left text-[13px] font-medium transition-colors ${
                      type === t
                        ? 'border-[#00E5A0]/50 bg-[#00E5A0]/[0.08] text-[#00E5A0]'
                        : 'border-white/[0.08] text-[#888888] hover:border-white/[0.16]'
                    }`}
                  >
                    {t === 'agency' ? 'Agência' : 'Influenciador'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">
                Nome
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Nome da agência ou seu nome público"
                className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white placeholder-[#333333] outline-none transition-colors focus:border-[#00E5A0]/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">
                Logo
              </label>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a]">
                  {logoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoPreview} alt="Preview da logo" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-lg opacity-30">🖼️</span>
                  )}
                </div>
                <label className="cursor-pointer rounded-lg border border-white/[0.08] px-3 py-2 text-[12px] font-medium text-[#888888] transition-colors hover:border-white/[0.16] hover:text-white">
                  {logoFile ? 'Trocar imagem' : 'Enviar imagem'}
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                placeholder="Conte um pouco sobre a agência/perfil"
                className="w-full resize-none rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white placeholder-[#333333] outline-none transition-colors focus:border-[#00E5A0]/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">
                Site
              </label>
              <input
                value={website}
                onChange={e => setWebsite(e.target.value)}
                type="url"
                placeholder="https://seusite.com"
                className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white placeholder-[#333333] outline-none transition-colors focus:border-[#00E5A0]/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">
                Redes sociais
              </label>
              <div className="space-y-2">
                {socialLinks.map(link => (
                  <div key={link.id} className="flex items-center gap-2">
                    <select
                      value={link.platform}
                      onChange={e => updateSocialLink(link.id, { platform: e.target.value })}
                      className="shrink-0 rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-2 py-2.5 text-[12px] text-white outline-none focus:border-[#00E5A0]/50"
                    >
                      {SOCIAL_PLATFORMS.map(p => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <input
                      value={link.url}
                      onChange={e => updateSocialLink(link.id, { url: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white placeholder-[#333333] outline-none transition-colors focus:border-[#00E5A0]/50"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialLink(link.id)}
                      className="shrink-0 text-[11px] text-[#666666] hover:text-[#ef4444]"
                    >
                      Remover
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/[0.12] py-2.5 text-[12px] font-medium text-[#888888] transition-colors hover:border-[#00E5A0]/40 hover:text-[#00E5A0]"
                >
                  + Adicionar rede social
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#00E5A0] py-3 text-[13px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584] disabled:opacity-50"
            >
              {submitting ? 'Criando perfil...' : 'Criar perfil e continuar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
