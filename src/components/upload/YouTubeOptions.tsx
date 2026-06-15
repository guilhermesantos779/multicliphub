'use client'
import { Info } from 'lucide-react'

const YOUTUBE_CATEGORIES = [
  { id: '20', label: 'Gaming' },
  { id: '24', label: 'Entretenimento' },
  { id: '17', label: 'Esportes' },
  { id: '22', label: 'Pessoas e blogs' },
  { id: '28', label: 'Ciência e tecnologia' },
  { id: '10', label: 'Música' },
  { id: '23', label: 'Comédia' },
  { id: '25', label: 'Notícias e política' },
  { id: '26', label: 'Guias e estilo' },
  { id: '19', label: 'Viagens e eventos' },
]

export interface YouTubeOptionsData {
  categoryId: string
  madeForKids: boolean
  selfDeclaredMadeForKids: boolean
}

interface YouTubeOptionsProps {
  value: YouTubeOptionsData
  onChange: (v: YouTubeOptionsData) => void
}

export function YouTubeOptions({ value, onChange }: YouTubeOptionsProps) {
  function update(partial: Partial<YouTubeOptionsData>) {
    onChange({ ...value, ...partial })
  }

  return (
    <div className="rounded-xl border border-white/[0.07]
      bg-white/[0.03] p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-2 pb-3
        border-b border-white/[0.06]">
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0"
          fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505
            3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0
            0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016
            3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505
            0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12
            24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12
            9.545 15.568Z"/>
        </svg>
        <span className="text-sm font-semibold text-white">
          Configurações do YouTube
        </span>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold tracking-widest
          uppercase text-white/40">
          Categoria
        </label>
        <select
          value={value.categoryId}
          onChange={e => update({ categoryId: e.target.value })}
          className="w-full bg-white/[0.04] border border-white/[0.08]
            rounded-xl px-3 py-2.5 text-sm text-white
            focus:outline-none focus:border-[#00E5A0]/30
            transition appearance-none cursor-pointer"
        >
          <option value="" disabled className="bg-[#0B0F19]">
            Selecione uma categoria
          </option>
          {YOUTUBE_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}
              className="bg-[#0B0F19]">
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* COPPA — Made for Kids */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold tracking-widest
            uppercase text-white/40">
            Público
          </label>
          <Tooltip text="Exigido pelo YouTube (lei COPPA). Conteúdo destinado ao público infantil tem restrições de comentários, notificações e personalização de anúncios." />
        </div>

        <div className="space-y-2">
          <label className="flex items-start gap-3 cursor-pointer
            group p-3 rounded-xl hover:bg-white/[0.03] transition">
            <input
              type="radio"
              name="coppa"
              checked={!value.madeForKids}
              onChange={() => update({
                madeForKids: false,
                selfDeclaredMadeForKids: false
              })}
              className="mt-0.5 accent-[#00E5A0]"
            />
            <div>
              <p className="text-sm text-white/80 font-medium">
                Não é destinado a crianças
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                Conteúdo para público geral, jovem ou adulto
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer
            group p-3 rounded-xl hover:bg-white/[0.03] transition">
            <input
              type="radio"
              name="coppa"
              checked={value.madeForKids}
              onChange={() => update({
                madeForKids: true,
                selfDeclaredMadeForKids: true
              })}
              className="mt-0.5 accent-[#00E5A0]"
            />
            <div>
              <p className="text-sm text-white/80 font-medium">
                Destinado a crianças
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                Algumas funcionalidades serão limitadas
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

function Tooltip({ text }: { text: string }) {
  return (
    <div className="relative group">
      <Info size={13} className="text-white/25 cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2
        mb-2 w-64 p-2.5 bg-[#161825] border border-white/[0.08]
        rounded-xl text-xs text-white/50 leading-relaxed
        opacity-0 group-hover:opacity-100 transition
        pointer-events-none z-20 shadow-xl">
        {text}
      </div>
    </div>
  )
}
