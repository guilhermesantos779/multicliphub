'use client'
import { useState, useRef } from 'react'
import { MapPin, X } from 'lucide-react'
import type { Platform } from '@/types/api.types'

// Static list of common Brazilian cities + option to type any
const SUGGESTIONS = [
  'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG',
  'Brasília, DF', 'Salvador, BA', 'Fortaleza, CE',
  'Curitiba, PR', 'Manaus, AM', 'Recife, PE', 'Porto Alegre, RS',
  'Goiânia, GO', 'Belém, PA', 'Guarulhos, SP', 'Campinas, SP',
  'São Luís, MA', 'Maceió, AL', 'Natal, RN', 'Teresina, PI',
  'Campo Grande, MS', 'João Pessoa, PB', 'Suzano, SP',
]

interface LocationFieldProps {
  value: string
  onChange: (v: string) => void
  platforms: Platform[]
}

export function LocationField({
  value,
  onChange,
  platforms,
}: LocationFieldProps) {
  const [input, setInput] = useState(value)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Only show for Instagram and YouTube
  const supported = platforms.filter(
    p => p === 'instagram' || p === 'youtube'
  )
  if (supported.length === 0) return null

  const filtered = SUGGESTIONS.filter(s =>
    s.toLowerCase().includes(input.toLowerCase()) && s !== value
  ).slice(0, 6)

  function select(city: string) {
    onChange(city)
    setInput(city)
    setOpen(false)
  }

  function clear() {
    onChange('')
    setInput('')
  }

  return (
    <div className="mb-5" ref={ref}>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-[11px] font-bold tracking-widest
          uppercase text-white/40">
          Localização
        </label>
        <span className="text-[10px] text-white/20 font-medium">
          {supported.map(p =>
            p === 'instagram' ? 'Instagram' : 'YouTube'
          ).join(' · ')}
        </span>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 bg-white/[0.04]
          border border-white/[0.08] rounded-xl px-3 py-2.5
          focus-within:border-[#00E5A0]/30 transition">
          <MapPin
            size={16}
            className={value ? 'text-[#00E5A0]' : 'text-white/25'}
          />
          <input
            value={input}
            onChange={e => {
              setInput(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() =>
              setTimeout(() => setOpen(false), 150)
            }
            placeholder="Cidade, Estado"
            className="flex-1 bg-transparent text-sm text-white
              placeholder:text-white/20 outline-none"
          />
          {value && (
            <button type="button" onClick={clear}>
              <X size={14} className="text-white/30
                hover:text-white transition" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1
            bg-[#161825] border border-white/[0.08] rounded-xl
            overflow-hidden shadow-xl z-20">
            {filtered.map(city => (
              <button
                type="button"
                key={city}
                onMouseDown={() => select(city)}
                className="w-full flex items-center gap-2.5
                  px-3 py-2.5 text-sm text-white/60
                  hover:bg-white/[0.05] hover:text-white
                  transition text-left"
              >
                <MapPin size={13} className="text-white/25
                  flex-shrink-0" />
                {city}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
