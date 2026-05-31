'use client'
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Topbar } from '@/components/dashboard/Topbar'
import { PlatformIcon } from '@/components/shared/PlatformIcon'
import { useUser } from '@/hooks/useUser'
import { useToast } from '@/components/shared/Toast'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { Platform } from '@/types/api.types'

type Step = 1 | 2 | 3

const STEPS = [
  { id: 1 as const, label: 'Vídeo' },
  { id: 2 as const, label: 'Configurar' },
  { id: 3 as const, label: 'Publicar' },
]

const PLATFORMS: Platform[] = ['tiktok', 'instagram', 'youtube']

const platformNames: Record<Platform, string> = {
  tiktok: 'TikTok',
  instagram: 'Reels',
  youtube: 'Shorts',
}

type PublishStatus = 'pending' | 'publishing' | 'published' | 'failed'

const statusIcons: Record<PublishStatus, React.ReactNode> = {
  pending: <div className="h-4 w-4 rounded-full border border-white/[0.2]" />,
  publishing: <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#00E5A0] border-t-transparent" />,
  published: <span className="text-[#DEFF9A] font-bold text-sm">✓</span>,
  failed: <span className="text-[#ef4444] font-bold text-sm">✗</span>,
}

export default function UploadPage() {
  const { canPost, profile } = useUser()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>(1)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['tiktok', 'instagram', 'youtube'])
  const [useAI, setUseAI] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishResults, setPublishResults] = useState<Record<Platform, PublishStatus>>({
    tiktok: 'pending', instagram: 'pending', youtube: 'pending',
  })

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('video/')) {
      toast('Arquivo inválido. Envie um arquivo de vídeo (MP4, MOV, WebM)', 'error')
      return
    }
    if (f.size > 500 * 1024 * 1024) {
      toast('Arquivo muito grande. Máximo 500MB', 'error')
      return
    }
    setFile(f)
    setTitle(f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '))
    setStep(2)
  }, [toast])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  const handlePublish = async () => {
    if (!file || selectedPlatforms.length === 0) return
    if (!canPost) {
      toast('Limite de posts atingido. Faça upgrade para continuar', 'error')
      return
    }

    setStep(3)
    setPublishing(true)

    for (const platform of selectedPlatforms) {
      setPublishResults(prev => ({ ...prev, [platform]: 'publishing' }))
      await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
      setPublishResults(prev => ({ ...prev, [platform]: 'published' }))
      // Count this publication toward the activity heatmap + monthly ranking.
      // When real OAuth publishing lands, keep this call at the success point.
      if (profile?.id) {
        const supabase = createClient()
        await supabase.rpc('register_publication', {
          p_user_id: profile.id,
          p_platform: platform,
        })
      }
    }

    setPublishing(false)
    toast(`Clipe publicado com sucesso em ${selectedPlatforms.length} plataforma${selectedPlatforms.length !== 1 ? 's' : ''}!`, 'success')
  }

  const resetForm = () => {
    setStep(1)
    setFile(null)
    setTitle('')
    setCaption('')
    setPublishResults({ tiktok: 'pending', instagram: 'pending', youtube: 'pending' })
  }

  return (
    <div>
      <Topbar title="Upload de Vídeo" />

      <div className="mx-auto max-w-lg p-6 space-y-6">
        {/* Stepper */}
        <div className="flex items-center">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300',
                    step > s.id ? 'bg-[#00E5A0] text-[#0B0F19]' :
                    step === s.id ? 'bg-[#00E5A0] text-[#0B0F19] ring-2 ring-[#00E5A0]/30' :
                    'bg-[#1a1a1a] text-[#444444]'
                  )}
                >
                  {step > s.id ? '✓' : s.id}
                </div>
                <span className={cn('text-[11px]', step >= s.id ? 'text-white' : 'text-[#444444]')}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('mx-2 mb-4 h-px flex-1 transition-colors duration-300', step > s.id ? 'bg-[#00E5A0]' : 'bg-white/[0.08]')} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1 – Upload */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  'cursor-pointer rounded-2xl border-2 border-dashed p-16 text-center transition-all duration-200',
                  isDragging
                    ? 'border-[#00E5A0] bg-[#00E5A0]/[0.04]'
                    : 'border-white/[0.1] hover:border-[#00E5A0]/50 hover:bg-white/[0.02]'
                )}
              >
                <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-[#1a1a1a] mx-auto">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="mb-1 text-[14px] font-medium text-white">
                  {isDragging ? 'Solte o arquivo aqui' : 'Toque para selecionar o vídeo'}
                </div>
                <div className="text-[12px] text-[#444444]">MP4, MOV, WebM · Máximo 500MB</div>
              </div>
            </motion.div>
          )}

          {/* STEP 2 – Configurar */}
          {step === 2 && file && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Preview do arquivo */}
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#111111] p-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#1a1a1a]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-[13px] font-medium text-white">{file.name}</div>
                  <div className="text-[11px] text-[#444444]">{(file.size / (1024 * 1024)).toFixed(1)} MB</div>
                </div>
                <button onClick={() => { setFile(null); setStep(1) }} className="text-[#444444] hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Título e Caption */}
              <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-4 space-y-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">Título</label>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ex: Neymar faz o gol mais insano da temporada 🔥"
                    className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white placeholder-[#333333] outline-none transition-colors focus:border-[#00E5A0]/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">Legenda / Caption</label>
                  <textarea
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="Escreva a legenda que será usada em todas as plataformas..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white placeholder-[#333333] outline-none transition-colors focus:border-[#00E5A0]/50"
                  />
                </div>
              </div>

              {/* Plataformas */}
              <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-4">
                <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">Distribuir em</label>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORMS.map(p => {
                    const selected = selectedPlatforms.includes(p)
                    return (
                      <motion.button
                        key={p}
                        type="button"
                        onClick={() => togglePlatform(p)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200',
                          selected
                            ? 'border-[#00E5A0]/50 bg-[#00E5A0]/[0.08]'
                            : 'border-white/[0.06] bg-[#0a0a0a] hover:border-white/[0.12]'
                        )}
                      >
                        <PlatformIcon platform={p} size={32} withLink={false} />
                        <span className={cn('text-[11px] font-medium', selected ? 'text-[#3CFFB8]' : 'text-[#666666]')}>
                          {platformNames[p]}
                        </span>
                        <div className={cn(
                          'flex h-4 w-4 items-center justify-center rounded-full border',
                          selected ? 'border-[#00E5A0] bg-[#00E5A0]' : 'border-white/[0.2]'
                        )}>
                          {selected && <span className="text-[8px] font-bold text-white">✓</span>}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Toggle IA */}
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#111111] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#1a1030]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DEFF9A" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-white">Otimização por IA</div>
                    <div className="text-[11px] text-[#444444]">Adapta legenda e hashtags para cada algoritmo</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUseAI(v => !v)}
                  className={cn(
                    'relative h-5 w-9 rounded-full transition-colors duration-300',
                    useAI ? 'bg-[#00E5A0]' : 'bg-[#222222]'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300',
                    useAI ? 'left-[18px]' : 'left-0.5'
                  )} />
                </button>
              </div>

              {/* Botão publicar */}
              <motion.button
                type="button"
                onClick={handlePublish}
                disabled={selectedPlatforms.length === 0 || !title}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00E5A0] py-3.5 text-[14px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Publicar Agora em {selectedPlatforms.length} plataforma{selectedPlatforms.length !== 1 ? 's' : ''}
              </motion.button>

              <button type="button" className="w-full text-center text-[12px] text-[#444444] hover:text-[#00E5A0] transition-colors">
                ou Agendar publicação para outro horário
              </button>
            </motion.div>
          )}

          {/* STEP 3 – Status de publicação */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-5">
                <div className="mb-4 text-center">
                  <div className="text-[15px] font-medium text-white mb-1">
                    {publishing ? 'Publicando seu clipe...' : 'Publicado com sucesso! 🎉'}
                  </div>
                  <div className="text-[12px] text-[#444444]">
                    {publishing
                      ? 'Aguarde enquanto distribuímos para as plataformas'
                      : `Distribuído para ${selectedPlatforms.length} plataforma${selectedPlatforms.length !== 1 ? 's' : ''}`}
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedPlatforms.map(p => {
                    const result = publishResults[p]
                    return (
                      <div key={p} className="flex items-center gap-3 rounded-lg bg-[#0a0a0a] p-3">
                        <PlatformIcon platform={p} size={28} withLink={false} />
                        <div className="flex-1">
                          <div className="text-[13px] font-medium text-white">{platformNames[p]}</div>
                          <div className="text-[11px] text-[#444444]">
                            {result === 'pending' ? 'Aguardando...' :
                             result === 'publishing' ? 'Enviando...' :
                             result === 'published' ? 'Publicado ✓' : 'Falhou'}
                          </div>
                        </div>
                        <div className="grid h-6 w-6 place-items-center">
                          {statusIcons[result]}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {!publishing && (
                <div className="flex gap-3">
                  <button
                    onClick={resetForm}
                    className="flex-1 rounded-xl border border-white/[0.1] py-3 text-[13px] font-medium text-white transition-colors hover:border-white/[0.2]"
                  >
                    Publicar novo clipe
                  </button>
                  <a
                    href="/historico"
                    className="flex-1 rounded-xl bg-[#00E5A0] py-3 text-center text-[13px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584]"
                  >
                    Ver no Histórico
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
