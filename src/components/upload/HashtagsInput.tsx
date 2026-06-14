'use client'
import { useState, useRef, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import type { Platform } from '@/types/api.types'

// Platform hashtag limits
const LIMITS: Record<Platform, number> = {
  tiktok:    5,
  instagram: 30,
  youtube:   15,
}

const SUGGESTIONS = [
  'clip', 'gaming', 'streamer', 'highlights', 'twitch',
  'kick', 'youtube', 'foryou', 'fyp', 'viral',
  'gamer', 'gameplay', 'melhoresmoments', 'clipdodia',
]

interface HashtagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  platforms: Platform[]
}

export function HashtagsInput({
  value,
  onChange,
  platforms,
}: HashtagsInputProps) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function addTag(raw: string) {
    const tag = raw.replace(/^#+/, '').trim().toLowerCase()
    if (!tag || value.includes(tag) || value.length >= 30) return
    onChange([...value, tag])
    setInput('')
  }

  function removeTag(tag: string) {
    onChange(value.filter(t => t !== tag))
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const filtered = SUGGESTIONS.filter(
    s => s.includes(input.toLowerCase()) && !value.includes(s)
  ).slice(0, 6)

  // Platform status
  const counts = platforms.map(p => ({
    platform: p,
    count: value.length,
    limit: LIMITS[p],
    ok: value.length <= LIMITS[p],
  }))

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] font-bold tracking-widest
          uppercase text-white/40">
          Hashtags
        </label>
        <div className="flex items-center gap-3">
          {counts.map(c => (
            <span
              key={c.platform}
              className={`text-[10px] font-semibold ${
                c.ok ? 'text-white/25' : 'text-red-400'
              }`}
            >
              {c.platform === 'tiktok' ? 'TT' :
               c.platform === 'instagram' ? 'IG' : 'YT'}
              {' '}
              {c.count}/{c.limit}
            </span>
          ))}
        </div>
      </div>

      {/* Tag chips + input */}
      <div
        className="min-h-[44px] p-2 rounded-xl
          bg-white/[0.04] border border-white/[0.08]
          flex flex-wrap gap-1.5 items-center
          focus-within:border-[#00E5A0]/30 transition cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1
              px-2 py-0.5 rounded-full
              bg-[#00E5A0]/10 border border-[#00E5A0]/20
              text-[12px] font-semibold text-[#00E5A0]"
          >
            #{tag}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); removeTag(tag) }}
              className="hover:text-white transition"
            >
              <X size={10} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          value={input}
          onChange={e => {
            setInput(e.target.value.replace(/\s/g, ''))
            setShowSuggestions(true)
          }}
          onKeyDown={handleKey}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={value.length === 0 ? '#gaming #clip...' : ''}
          className="flex-1 min-w-[120px] bg-transparent
            text-sm text-white outline-none placeholder:text-white/20"
        />
      </div>

      {/* Suggestions */}
      {showSuggestions && filtered.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {filtered.map(s => (
            <button
              type="button"
              key={s}
              onMouseDown={() => addTag(s)}
              className="text-[11px] px-2.5 py-1 rounded-full
                bg-white/[0.04] border border-white/[0.07]
                text-white/40 hover:text-white hover:border-white/20
                transition"
            >
              #{s}
            </button>
          ))}
        </div>
      )}

      <p className="mt-1.5 text-[11px] text-white/25">
        Pressione Enter ou espaço para adicionar. As hashtags são
        adicionadas automaticamente à legenda de cada plataforma.
      </p>
    </div>
  )
}
