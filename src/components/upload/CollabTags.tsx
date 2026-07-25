'use client'
import { useState } from 'react'
import { AtSign, X } from 'lucide-react'
import type { Platform } from '@/types/api.types'

interface CollabTagsProps {
  value: string[]      // array of @usernames (without @)
  onChange: (v: string[]) => void
  platforms: Platform[]
}

const MAX = 3 // Instagram allows up to 3 collaborators

export function CollabTags({
  value,
  onChange,
  platforms,
}: CollabTagsProps) {
  const [input, setInput] = useState('')

  // Only relevant for Instagram
  if (!platforms.includes('instagram')) return null

  function add() {
    const tag = input.replace(/^@/, '').trim().toLowerCase()
    if (!tag || value.includes(tag) || value.length >= MAX) return
    onChange([...value, tag])
    setInput('')
  }

  function remove(tag: string) {
    onChange(value.filter(t => t !== tag))
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); add() }
  }

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold tracking-widest
            uppercase text-white/40">
            Colaboradores
          </label>
          <span className="text-[10px] text-white/20 font-medium">
            Instagram · até {MAX}
          </span>
        </div>
        <span className="text-[10px] text-white/25">
          {value.length}/{MAX}
        </span>
      </div>

      <div className="rounded-xl bg-white/[0.03] border
        border-white/[0.07] p-3 space-y-3">

        {/* Added collaborators */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map(tag => (
              <div
                key={tag}
                className="flex items-center gap-1.5 px-3 py-1
                  bg-purple/10 border border-purple/20
                  rounded-full"
              >
                <AtSign size={12} className="text-purple" />
                <span className="text-xs font-semibold
                  text-purple">
                  {tag}
                </span>
                <button
                  type="button"
                  onClick={() => remove(tag)}
                  className="text-purple/60 hover:text-purple
                    transition"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        {value.length < MAX && (
          <div className="flex gap-2">
            <div className="flex items-center gap-2 flex-1
              bg-white/[0.04] border border-white/[0.07]
              rounded-lg px-3 py-2">
              <AtSign size={14} className="text-white/25 flex-shrink-0" />
              <input
                value={input}
                onChange={e =>
                  setInput(e.target.value.replace(/[^a-zA-Z0-9._]/g, ''))
                }
                onKeyDown={handleKey}
                placeholder="usuario_instagram"
                className="flex-1 bg-transparent text-sm
                  text-white placeholder:text-white/20 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={add}
              disabled={!input.trim()}
              className="px-3 py-2 rounded-lg text-sm font-semibold
                bg-purple/15 text-purple border
                border-purple/20 hover:bg-purple/25
                transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Adicionar
            </button>
          </div>
        )}

        <p className="text-[11px] text-white/25 leading-relaxed">
          O colaborador receberá uma notificação e o post aparecerá
          no perfil dele após aceitar.
        </p>
      </div>
    </div>
  )
}
