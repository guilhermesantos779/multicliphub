'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Topbar } from '@/components/dashboard/Topbar'
import { PlatformIcon } from '@/components/shared/PlatformIcon'
import { useUser } from '@/hooks/useUser'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useToast } from '@/components/shared/Toast'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { TikTokOptions, type TikTokPostOptions } from '@/components/upload/TikTokOptions'
import { VideoPreview } from '@/components/upload/VideoPreview'
import { ThumbnailSelector, type ThumbnailSource } from '@/components/upload/ThumbnailSelector'
import { HashtagsInput } from '@/components/upload/HashtagsInput'
import { CaptionField, type CaptionValue } from '@/components/upload/CaptionField'
import { YouTubeOptions, type YouTubeOptionsData } from '@/components/upload/YouTubeOptions'
import { LocationField } from '@/components/upload/LocationField'
import { CollabTags } from '@/components/upload/CollabTags'
import { PlatformPreview } from '@/components/upload/PlatformPreview'
import type { Platform } from '@/types/api.types'

type Step = 1 | 2 | 3

const STEPS = [
  { id: 1 as const, key: 'step_video' },
  { id: 2 as const, key: 'step_configure' },
  { id: 3 as const, key: 'step_publish' },
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
  const t = useTranslations('upload')
  const { canPost, profile } = useUser()
  const { markItem } = useOnboarding()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>(1)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState<CaptionValue>('')
  const [thumbnail, setThumbnail] = useState<ThumbnailSource>(null)
  const [capturedFrames, setCapturedFrames] = useState<Array<{ dataUrl: string; time: number }>>([])
  const [hashtags, setHashtags] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [collabTags, setCollabTags] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['tiktok', 'instagram', 'youtube'])
  const [tiktokOptions, setTiktokOptions] = useState<TikTokPostOptions | null>(null)
  const [youtubeOptions, setYoutubeOptions] = useState<YouTubeOptionsData>({
    categoryId: '20',          // Gaming as default
    madeForKids: false,
    selfDeclaredMadeForKids: false,
  })
  const [useAI, setUseAI] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishResults, setPublishResults] = useState<Record<Platform, PublishStatus>>({
    tiktok: 'pending', instagram: 'pending', youtube: 'pending',
  })

  // Single object URL for the uploaded video, shared by the inline player and
  // the platform preview mockup. Owned here so both consume the same blob URL.
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!file) { setVideoUrl(null); return }
    const u = URL.createObjectURL(file)
    setVideoUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [file])

  // Caption shown in the preview: unified string or the first platform's text.
  const firstPlatform = selectedPlatforms[0]
  const previewCaption = typeof caption === 'string'
    ? caption
    : (firstPlatform ? caption[firstPlatform] ?? '' : '')
  const previewThumbnail = thumbnail?.type === 'frame'
    ? thumbnail.dataUrl
    : thumbnail?.type === 'upload'
    ? thumbnail.previewUrl
    : null

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('video/')) {
      toast(t('err_invalid_file'), 'error')
      return
    }
    if (f.size > 500 * 1024 * 1024) {
      toast(t('err_too_large'), 'error')
      return
    }
    setFile(f)
    setTitle(f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '))
    setStep(2)
  }, [toast, t])

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

  // Real TikTok publish: starts the post and polls until it completes or fails.
  // Returns true only on PUBLISH_COMPLETE.
  const publishTikTok = async (videoPublicUrl: string): Promise<boolean> => {
    const tiktokCaption = typeof caption === 'string' ? caption : (caption.tiktok ?? '')
    try {
      const res = await fetch('/api/publish/tiktok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_url: videoPublicUrl,
          title,
          caption: tiktokCaption,
          hashtags,
          // Sandbox apps can only post privately. Switch to tiktokOptions.privacyLevel
          // once the app is approved for production.
          privacy_level: 'SELF_ONLY',
          comment_disabled: tiktokOptions?.commentDisabled ?? false,
          duet_disabled: tiktokOptions?.duetDisabled ?? false,
          stitch_disabled: tiktokOptions?.stitchDisabled ?? false,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        console.error('[upload] TikTok publish failed:', data)
        return false
      }

      // Poll status every 3s for up to ~3 minutes.
      const publishId = data.publish_id as string
      for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 3000))
        const sres = await fetch(`/api/publish/tiktok/status?publish_id=${encodeURIComponent(publishId)}`)
        const sdata = await sres.json()
        if (sdata.completed) return true
        if (sdata.failed) {
          console.error('[upload] TikTok publish failed:', sdata.fail_reason)
          return false
        }
      }
      console.warn('[upload] TikTok publish timed out — check TikTok Studio')
      return false
    } catch (e) {
      console.error('[upload] TikTok publish error:', e)
      return false
    }
  }

  const handlePublish = async () => {
    if (!file || selectedPlatforms.length === 0) return
    if (!canPost) {
      toast(t('err_limit'), 'error')
      return
    }

    setStep(3)
    setPublishing(true)

    const supabase = createClient()

    // TikTok needs a real fetchable file: upload the clip to Storage once.
    // Show progress on the TikTok row and surface any failure to the user
    // instead of leaving the step silently stuck.
    let videoPublicUrl: string | null = null
    const wantsTikTok = selectedPlatforms.includes('tiktok')
    if (wantsTikTok) {
      setPublishResults(prev => ({ ...prev, tiktok: 'publishing' }))
      if (!profile?.id) {
        toast('Perfil ainda carregando — tente novamente em instantes', 'error')
      } else {
        try {
          const ext = file.name.split('.').pop() || 'mp4'
          const path = `${profile.id}/${Date.now()}.${ext}`
          const { error: upErr } = await supabase.storage
            .from('videos')
            .upload(path, file, { contentType: file.type, upsert: false })
          if (upErr) throw upErr
          videoPublicUrl = supabase.storage.from('videos').getPublicUrl(path).data.publicUrl
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'erro desconhecido'
          console.error('[upload] Storage upload failed:', e)
          toast(`Falha ao enviar o vídeo: ${msg}`, 'error')
        }
      }
    }

    // Per-platform: TikTok publishes for real; Instagram/YouTube stay simulated
    // until their integrations land.
    for (const platform of selectedPlatforms) {
      if (platform !== 'tiktok') {
        setPublishResults(prev => ({ ...prev, [platform]: 'publishing' }))
      }

      let ok = true
      if (platform === 'tiktok') {
        ok = videoPublicUrl ? await publishTikTok(videoPublicUrl) : false
      } else {
        await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
      }

      setPublishResults(prev => ({ ...prev, [platform]: ok ? 'published' : 'failed' }))

      // Count successful publications toward the activity heatmap + ranking.
      if (ok && profile?.id) {
        await supabase.rpc('register_publication', {
          p_user_id: profile.id,
          p_platform: platform,
        })
      }
    }

    setPublishing(false)
    toast(t('success_published', { count: selectedPlatforms.length }), 'success')
    // Onboarding: first successful publish completes this step.
    markItem('first_upload')
  }

  const resetForm = () => {
    setStep(1)
    setFile(null)
    setTitle('')
    setCaption('')
    setThumbnail(null)
    setCapturedFrames([])
    setHashtags([])
    setLocation('')
    setCollabTags([])
    setPublishResults({ tiktok: 'pending', instagram: 'pending', youtube: 'pending' })
  }

  return (
    <div>
      <Topbar title={t('title')} />

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
                  {t(s.key)}
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
                  {isDragging ? t('drop_here') : t('tap_select')}
                </div>
                <div className="text-[12px] text-[#444444]">{t('file_hint')}</div>
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
              {/* Video preview com player inline */}
              <VideoPreview
                file={file}
                objectUrl={videoUrl}
                onFrameCapture={(dataUrl, time) => {
                  // Keep the last 5 captured frames for the thumbnail strip.
                  setCapturedFrames(prev => [{ dataUrl, time }, ...prev].slice(0, 5))
                  setThumbnail({ type: 'frame', dataUrl, time })
                }}
              />

              {/* Trocar vídeo */}
              <button
                type="button"
                onClick={() => { setFile(null); setStep(1) }}
                className="-mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#666666] transition-colors hover:text-white"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Trocar vídeo
              </button>

              {/* Seletor de capa */}
              <ThumbnailSelector
                value={thumbnail}
                onChange={setThumbnail}
                capturedFrames={capturedFrames}
              />

              {/* Pré-visualização por plataforma (recolhida por padrão) */}
              <PlatformPreview
                videoUrl={videoUrl}
                thumbnailUrl={previewThumbnail}
                title={title}
                caption={previewCaption}
                hashtags={hashtags}
                username={profile?.username ?? 'usuario'}
                platforms={selectedPlatforms}
              />

              {/* Título */}
              <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-4">
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">{t('label_title')}</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={t('placeholder_title')}
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white placeholder-[#333333] outline-none transition-colors focus:border-[#00E5A0]/50"
                />
              </div>

              {/* Legenda (única ou por plataforma) + Hashtags */}
              <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-4">
                <CaptionField
                  platforms={selectedPlatforms}
                  value={caption}
                  onChange={setCaption}
                />
                <HashtagsInput
                  value={hashtags}
                  onChange={setHashtags}
                  platforms={selectedPlatforms}
                />
              </div>

              {/* Localização (Instagram + YouTube) e colaboradores (Instagram) */}
              <LocationField
                value={location}
                onChange={setLocation}
                platforms={selectedPlatforms}
              />
              <CollabTags
                value={collabTags}
                onChange={setCollabTags}
                platforms={selectedPlatforms}
              />

              {/* Plataformas */}
              <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-4">
                <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">{t('label_distribute')}</label>
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

              {/* TikTok compliance options — shown only when TikTok is a destination */}
              {selectedPlatforms.includes('tiktok') && (
                <TikTokOptions
                  creatorUsername={profile?.username ?? 'sua conta'}
                  onChange={setTiktokOptions}
                />
              )}

              {/* YouTube options — shown only when YouTube is a destination */}
              {selectedPlatforms.includes('youtube') && (
                <YouTubeOptions
                  value={youtubeOptions}
                  onChange={setYoutubeOptions}
                />
              )}

              {/* Toggle IA */}
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#111111] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#1a1030]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DEFF9A" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-white">{t('ai_title')}</div>
                    <div className="text-[11px] text-[#444444]">{t('ai_desc')}</div>
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
                {t('publish_now', { count: selectedPlatforms.length })}
              </motion.button>

              <button type="button" className="w-full text-center text-[12px] text-[#444444] hover:text-[#00E5A0] transition-colors">
                {t('schedule')}
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
                    {publishing ? t('publishing_title') : t('published_title')}
                  </div>
                  <div className="text-[12px] text-[#444444]">
                    {publishing
                      ? t('publishing_desc')
                      : t('published_desc', { count: selectedPlatforms.length })}
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
                            {result === 'pending' ? t('result_pending') :
                             result === 'publishing' ? t('result_publishing') :
                             result === 'published' ? t('result_published') : t('result_failed')}
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
                    {t('publish_new')}
                  </button>
                  <a
                    href="/historico"
                    className="flex-1 rounded-xl bg-[#00E5A0] py-3 text-center text-[13px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584]"
                  >
                    {t('see_history')}
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
