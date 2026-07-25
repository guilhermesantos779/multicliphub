'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Loader2, Check, Upload, BarChart3, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useProfileContext } from '@/components/app/ProfileProvider'
import { useToast } from '@/components/shared/Toast'
import { useOnboarding } from '@/hooks/useOnboarding'
import { UsernameInput } from '@/components/ui/UsernameInput'
import { PlatformIcon } from '@/components/shared/PlatformIcon'
import { Logo } from '@/components/shared/Logo'
import { normalizeUsername, validateUsername } from '@/lib/username'
import { Confetti } from './Confetti'

const TOTAL_STEPS = 5
const PLATFORMS = ['tiktok', 'instagram', 'youtube'] as const

export function SetupWizard() {
  const ctx = useProfileContext()
  const profile = ctx?.profile ?? null
  const refresh = ctx?.refresh
  const { toast } = useToast()
  const { completeWizard, markItem } = useOnboarding()

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)

  const currentUsername = (profile?.username ?? '').toLowerCase()
  const [username, setUsername] = useState(currentUsername)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)
  const [savingUsername, setSavingUsername] = useState(false)

  const avatarInput = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url ?? '')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [photoAdded, setPhotoAdded] = useState(false)

  const [finishing, setFinishing] = useState(false)

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  // ── Step 2: save nickname ──────────────────────────────────────────────────
  async function handleSaveUsername(): Promise<boolean> {
    if (!profile) return false
    const next = normalizeUsername(username)
    if (validateUsername(next)) {
      toast('Nickname inválido', 'error')
      return false
    }
    // Unchanged — nothing to write, just advance and mark done (non-blocking).
    if (next === currentUsername) {
      void markItem('set_nickname')
      return true
    }
    setSavingUsername(true)
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ username: next }).eq('id', profile.id)
    setSavingUsername(false)
    if (error) {
      if (error.code === '23505') toast('Este nickname já está em uso', 'error')
      else if (error.code === '23514') toast('Nickname inválido ou reservado', 'error')
      else toast('Erro ao salvar nickname', 'error')
      setAvailable(false)
      return false
    }
    void markItem('set_nickname')
    void refresh?.()
    return true
  }

  async function advanceFromNickname() {
    const ok = await handleSaveUsername()
    if (ok) go(2)
  }

  // ── Step 3: avatar upload ──────────────────────────────────────────────────
  async function handleAvatar(file: File) {
    if (!profile) return
    if (file.size > 5 * 1024 * 1024) {
      toast('Imagem muito grande (máximo 5MB)', 'error')
      return
    }
    setAvatarPreview(URL.createObjectURL(file)) // instant preview
    setUploadingAvatar(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${profile.id}/avatar-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, cacheControl: '3600' })
    if (error) {
      toast('Erro ao enviar imagem', 'error')
      setUploadingAvatar(false)
      return
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', profile.id)
    await markItem('upload_photo')
    await refresh?.()
    setUploadingAvatar(false)
    setPhotoAdded(true)
  }

  // ── Step 5: finish ─────────────────────────────────────────────────────────
  async function finish(startTour: boolean) {
    setFinishing(true)
    await completeWizard({ startTour })
    // Provider flips visibility flags from the refreshed profile.
  }

  const initials = (profile?.full_name || profile?.username || 'U').charAt(0).toUpperCase()

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop — not dismissable on outside click */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Pulsing purple glow behind the card */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(145,70,255,0.25), transparent 70%)' }}
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative w-full max-w-[520px] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0a] shadow-2xl">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.span
              key={i}
              animate={{
                // Bounce when a dot turns purple (tween — springs only allow 2 keyframes).
                scale: i <= step ? [1, 1.4, 1] : 1,
                backgroundColor: i <= step ? '#9146FF' : 'rgba(255,255,255,0.12)',
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-2 w-2 rounded-full"
            />
          ))}
        </div>

        <div className="relative min-h-[420px] px-7 pb-7 pt-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {step === 0 && <StepWelcome onNext={() => go(1)} />}

              {step === 1 && (
                <StepNickname
                  username={username}
                  setUsername={setUsername}
                  currentUsername={currentUsername}
                  onAvailability={(a, c) => { setAvailable(a); setChecking(c) }}
                  canAdvance={available === true && !checking && !savingUsername}
                  saving={savingUsername}
                  onNext={advanceFromNickname}
                />
              )}

              {step === 2 && (
                <StepPhoto
                  preview={avatarPreview}
                  initials={initials}
                  uploading={uploadingAvatar}
                  photoAdded={photoAdded}
                  onPick={() => avatarInput.current?.click()}
                  onSkip={() => go(3)}
                  onNext={() => go(3)}
                />
              )}

              {step === 3 && (
                <StepChannels
                  onConnect={() =>
                    toast('Em breve — conecte seus canais depois na aba Canais', 'info')
                  }
                  onSkip={() => go(4)}
                  onNext={() => go(4)}
                />
              )}

              {step === 4 && (
                <StepDone
                  finishing={finishing}
                  onStartTour={() => finish(true)}
                  onSkipTour={() => finish(false)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <input
          ref={avatarInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleAvatar(e.target.files[0])}
        />
      </div>
    </div>
  )
}

// ── STEP 1 — Welcome ──────────────────────────────────────────────────────────
function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Light streak across the modal */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ x: '-120%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute top-1/3 h-px w-2/3"
          style={{ background: 'linear-gradient(90deg, transparent, #9146FF, #00E5A0, transparent)' }}
        />
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
        className="mt-8 mb-6"
      >
        <Logo height={40} variant="mint" />
      </motion.div>

      <h2 className="font-display text-[24px] font-bold tracking-[-0.02em] text-white">
        Bem-vindo ao MultiClip Hub 🎬
      </h2>
      <p className="mt-3 text-[15px] italic text-white/60">
        &ldquo;O escritório digital do clipador profissional&rdquo;
      </p>
      <p className="mt-4 max-w-[380px] text-[13px] leading-relaxed text-white/50">
        Vamos configurar sua conta em menos de 2 minutos. É rápido e você pode
        personalizar tudo depois.
      </p>

      <button
        onClick={onNext}
        className="mt-8 w-full rounded-xl bg-purple py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#7c3aed]"
      >
        Vamos lá →
      </button>
    </div>
  )
}

// ── STEP 2 — Nickname ─────────────────────────────────────────────────────────
function StepNickname({
  username, setUsername, currentUsername, onAvailability, canAdvance, saving, onNext,
}: {
  username: string
  setUsername: (v: string) => void
  currentUsername: string
  onAvailability: (available: boolean | null, checking: boolean) => void
  canAdvance: boolean
  saving: boolean
  onNext: () => void
}) {
  return (
    <div className="flex flex-col">
      <h2 className="font-display text-[22px] font-bold tracking-[-0.02em] text-white">
        Como você quer ser chamado?
      </h2>
      <p className="mt-2 mb-6 text-[13px] text-white/50">
        Esse será seu nome público na plataforma.
      </p>

      <UsernameInput
        value={username}
        onChange={setUsername}
        currentUsername={currentUsername || undefined}
        onAvailabilityChange={onAvailability}
        autoFocus
      />

      <button
        onClick={onNext}
        disabled={!canAdvance}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#7c3aed] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        Continuar →
      </button>
    </div>
  )
}

// ── STEP 3 — Photo ──────────────────────────────────────────────────────────
function StepPhoto({
  preview, initials, uploading, photoAdded, onPick, onSkip, onNext,
}: {
  preview: string
  initials: string
  uploading: boolean
  photoAdded: boolean
  onPick: () => void
  onSkip: () => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="font-display text-[22px] font-bold tracking-[-0.02em] text-white">
        Mostre sua cara para a comunidade 📸
      </h2>
      <p className="mt-2 mb-6 text-[13px] text-white/50">
        Você pode adicionar ou trocar depois no seu perfil.
      </p>

      <button
        onClick={onPick}
        className="group relative mb-6 h-32 w-32 overflow-hidden rounded-full border-2 border-white/[0.12] bg-purple/[0.12]"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-4xl font-bold text-white/70">
            {initials}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          {uploading ? (
            <Loader2 size={22} className="animate-spin text-white" />
          ) : (
            <Camera size={22} className="text-white" />
          )}
        </span>
      </button>

      <div className="flex w-full gap-3">
        {photoAdded ? (
          <button
            onClick={onNext}
            className="flex-1 rounded-xl bg-purple py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#7c3aed]"
          >
            Continuar →
          </button>
        ) : (
          <>
            <button
              onClick={onPick}
              disabled={uploading}
              className="flex-1 rounded-xl border border-white/[0.12] py-3 text-[14px] font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
            >
              {uploading ? 'Enviando...' : 'Adicionar foto'}
            </button>
            <button
              onClick={onSkip}
              className="flex-1 rounded-xl py-3 text-[14px] font-medium text-white/40 transition-colors hover:text-white/60"
            >
              Pular por agora →
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── STEP 4 — Channels ─────────────────────────────────────────────────────────
function StepChannels({
  onConnect, onSkip, onNext,
}: {
  onConnect: (p: string) => void
  onSkip: () => void
  onNext: () => void
}) {
  const labels: Record<string, string> = {
    tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube',
  }
  return (
    <div className="flex flex-col">
      <h2 className="font-display text-[22px] font-bold tracking-[-0.02em] text-white">
        Onde você publica seus clipes? 📡
      </h2>
      <p className="mt-2 mb-6 text-[13px] text-white/50">
        Conecte agora ou depois em Canais. Você precisa de pelo menos 1 canal para publicar.
      </p>

      <div className="grid grid-cols-3 gap-3">
        {PLATFORMS.map((p) => (
          <div
            key={p}
            className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4"
          >
            <PlatformIcon platform={p} size={26} withLink={false} />
            <span className="text-[12px] font-medium text-white">{labels[p]}</span>
            <button
              onClick={() => onConnect(p)}
              className="w-full rounded-lg border border-purple/30 bg-purple/[0.08] py-1.5 text-[11px] font-medium text-purple transition-colors hover:bg-purple/[0.15]"
            >
              Conectar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={onNext}
          className="flex-1 rounded-xl bg-purple py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#7c3aed]"
        >
          Conectar canais →
        </button>
        <button
          onClick={onSkip}
          className="flex-1 rounded-xl py-3 text-[14px] font-medium text-white/40 transition-colors hover:text-white/60"
        >
          Pular por agora →
        </button>
      </div>
    </div>
  )
}

// ── STEP 5 — Done ──────────────────────────────────────────────────────────────
function StepDone({
  finishing, onStartTour, onSkipTour,
}: {
  finishing: boolean
  onStartTour: () => void
  onSkipTour: () => void
}) {
  const features = [
    { icon: Upload, label: 'Upload simultâneo' },
    { icon: BarChart3, label: 'Analytics unificado' },
    { icon: Crown, label: 'Ranking gamificado' },
  ]
  return (
    <div className="relative flex flex-col items-center text-center">
      <Confetti />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}
        className="mt-6 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint/[0.12]"
      >
        <Check size={32} className="text-mint" strokeWidth={3} />
      </motion.div>

      <h2 className="font-display text-[24px] font-bold tracking-[-0.02em] text-white">
        Tudo pronto! 🚀
      </h2>
      <p className="mt-3 max-w-[380px] text-[13px] leading-relaxed text-white/50">
        Sua conta está configurada. Agora vamos te mostrar o que o MultiClip Hub
        pode fazer por você.
      </p>

      <div className="mt-6 grid w-full grid-cols-3 gap-3">
        {features.map((f) => (
          <div
            key={f.label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3"
          >
            <f.icon size={22} className="text-purple" />
            <span className="text-[11px] leading-tight text-white/70">{f.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onStartTour}
        disabled={finishing}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#7c3aed] disabled:opacity-50"
      >
        {finishing && <Loader2 size={16} className="animate-spin" />}
        Iniciar tour →
      </button>
      <button
        onClick={onSkipTour}
        disabled={finishing}
        className="mt-3 text-[12px] text-white/40 transition-colors hover:text-white/60 disabled:opacity-50"
      >
        Pular tour, ir para o dashboard
      </button>
    </div>
  )
}
