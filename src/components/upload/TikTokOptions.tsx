'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'

export interface TikTokPostOptions {
  privacyLevel:
    | 'PUBLIC_TO_EVERYONE'
    | 'MUTUAL_FOLLOW_FRIENDS'
    | 'FOLLOWER_OF_CREATOR'
    | 'SELF_ONLY'
  commentDisabled: boolean
  duetDisabled: boolean
  stitchDisabled: boolean
  brandOrganicToggle: boolean
  brandContentToggle: boolean
}

const DEFAULT_OPTIONS: TikTokPostOptions = {
  privacyLevel: 'PUBLIC_TO_EVERYONE',
  commentDisabled: false,
  duetDisabled: false,
  stitchDisabled: false,
  brandOrganicToggle: false,
  brandContentToggle: false,
}

interface TikTokOptionsProps {
  creatorUsername: string
  onChange: (options: TikTokPostOptions) => void
}

export function TikTokOptions({ creatorUsername, onChange }: TikTokOptionsProps) {
  const [options, setOptions] = useState<TikTokPostOptions>(DEFAULT_OPTIONS)

  function update(partial: Partial<TikTokPostOptions>) {
    const next = { ...options, ...partial }
    setOptions(next)
    onChange(next)
  }

  return (
    <div className="space-y-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      {/* TikTok header */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <span className="text-sm font-semibold text-white">Configurações do TikTok</span>
      </div>

      {/* Creator info — required by TikTok */}
      <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm">
          @
        </div>
        <div>
          <p className="text-xs text-white/40">Publicando como</p>
          <p className="text-sm font-medium text-white">@{creatorUsername}</p>
        </div>
      </div>

      {/* Privacy level — REQUIRED by TikTok */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80">
          Quem pode ver
          <span className="ml-1 text-red-400">*</span>
        </label>
        <select
          value={options.privacyLevel}
          onChange={(e) =>
            update({ privacyLevel: e.target.value as TikTokPostOptions['privacyLevel'] })
          }
          className="w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-[#00E5A0] focus:outline-none"
        >
          <option value="PUBLIC_TO_EVERYONE">Todos (público)</option>
          <option value="MUTUAL_FOLLOW_FRIENDS">Amigos mútuos</option>
          <option value="FOLLOWER_OF_CREATOR">Seguidores</option>
          <option value="SELF_ONLY">Somente eu (privado)</option>
        </select>
      </div>

      {/* Interaction controls — REQUIRED by TikTok */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-white/80">Interações</p>
        <div className="space-y-3">
          <Toggle
            label="Permitir comentários"
            checked={!options.commentDisabled}
            onChange={(v) => update({ commentDisabled: !v })}
          />
          <Toggle
            label="Permitir Duet"
            checked={!options.duetDisabled}
            onChange={(v) => update({ duetDisabled: !v })}
          />
          <Toggle
            label="Permitir Stitch"
            checked={!options.stitchDisabled}
            onChange={(v) => update({ stitchDisabled: !v })}
          />
        </div>
      </div>

      {/* Commercial content disclosure — REQUIRED by TikTok */}
      <div className="space-y-3 border-t border-white/10 pt-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white/80">Divulgação de conteúdo</p>
          <Tooltip text="O TikTok exige que você declare se o conteúdo promove uma marca ou produto, mesmo que não seja pago." />
        </div>

        <div className="space-y-3">
          <Toggle
            label="Conteúdo de marca própria"
            description="Este vídeo promove minha marca ou produto."
            checked={options.brandOrganicToggle}
            onChange={(v) => update({ brandOrganicToggle: v })}
          />
          <Toggle
            label="Conteúdo patrocinado"
            description="Recebi pagamento, produto ou serviço para criar este vídeo."
            checked={options.brandContentToggle}
            onChange={(v) => update({ brandContentToggle: v })}
          />
        </div>

        {(options.brandOrganicToggle || options.brandContentToggle) && (
          <div className="rounded-lg border border-[#00E5A0]/20 bg-[#00E5A0]/10 p-3">
            <p className="text-xs leading-relaxed text-[#00E5A0]">
              Ao ativar a divulgação, o TikTok exibirá automaticamente o rótulo &quot;Conteúdo
              pago&quot; ou &quot;Parceria paga&quot; no seu vídeo.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="group flex cursor-pointer items-start gap-3">
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`h-6 w-10 rounded-full transition-colors ${checked ? 'bg-[#00E5A0]' : 'bg-white/20'}`}>
          <div
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </div>
      </div>
      <div>
        <p className="text-sm text-white/80 transition-colors group-hover:text-white">{label}</p>
        {description && <p className="mt-0.5 text-xs text-white/40">{description}</p>}
      </div>
    </label>
  )
}

function Tooltip({ text }: { text: string }) {
  return (
    <div className="group relative">
      <Info size={14} className="cursor-help text-white/30" />
      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg border border-white/10 bg-[#1a1a2e] p-2 text-xs leading-relaxed text-white/60 opacity-0 transition-opacity group-hover:opacity-100">
        {text}
      </div>
    </div>
  )
}
