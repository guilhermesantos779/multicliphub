'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, useSortable, arrayMove,
  verticalListSortingStrategy, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus, Trash2, GripVertical, Camera, Save, Loader2, X, Check,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/shared/Toast'
import { UsernameInput } from '@/components/ui/UsernameInput'
import { normalizeUsername, validateUsername, USERNAME_ERROR_MESSAGE } from '@/lib/username'
import { markChecklistItem } from '@/lib/onboarding/markComplete'
import { ProfileHeader } from './ProfileHeader'
import { AchievementIcon } from './icons/AchievementIcon'
import { PlatformIcon } from './icons/PlatformIcon'
import {
  PLATFORM_META, PLATFORM_ORDER, MAX_PROFILE_LINKS,
  MAX_FEATURED_ACHIEVEMENTS, MAX_BIO_LENGTH, MAX_DISPLAY_NAME_LENGTH,
  type ProfilePlatform, type AchievementTier,
} from '@/lib/profile'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileLink = Database['public']['Tables']['profile_links']['Row']
type Achievement = Database['public']['Tables']['achievements']['Row']

interface EditableLink {
  key: string
  platform: ProfilePlatform
  url: string
  display_name: string
  followers_count: string
}

interface ProfileEditorProps {
  initialProfile: Profile
  initialLinks: ProfileLink[]
  achievements: Achievement[]
  unlockedSlugs: string[]
  /** True when a legacy account is forced to pick a nickname before continuing. */
  setupMode?: boolean
}

export function ProfileEditor({
  initialProfile,
  initialLinks,
  achievements,
  unlockedSlugs,
  setupMode = false,
}: ProfileEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const currentUsername = (initialProfile.username ?? '').toLowerCase()
  const [username, setUsername] = useState(currentUsername)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [usernameChecking, setUsernameChecking] = useState(false)
  const [displayName, setDisplayName] = useState(initialProfile.full_name ?? '')
  const [bio, setBio] = useState(initialProfile.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url ?? '')
  const [bannerUrl, setBannerUrl] = useState(initialProfile.banner_url ?? '')
  const [links, setLinks] = useState<EditableLink[]>(
    initialLinks.map((l) => ({
      key: l.id,
      platform: (l.platform as ProfilePlatform) ?? 'tiktok',
      url: l.url,
      display_name: l.display_name ?? '',
      followers_count: l.followers_count ?? '',
    })),
  )
  const [featured, setFeatured] = useState<string[]>(
    (initialProfile.featured_achievements ?? []).filter((s) =>
      unlockedSlugs.includes(s),
    ),
  )
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'avatar' | 'banner' | null>(null)

  const avatarInput = useRef<HTMLInputElement>(null)
  const bannerInput = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const unlockedAchievements = achievements.filter((a) =>
    unlockedSlugs.includes(a.slug),
  )

  // ── Uploads ──────────────────────────────────────────────────────────────
  async function handleUpload(
    file: File,
    bucket: 'avatars' | 'banners',
    setUrl: (u: string) => void,
  ) {
    if (!file) return
    setUploading(bucket === 'avatars' ? 'avatar' : 'banner')
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${initialProfile.id}/${bucket}-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true, cacheControl: '3600' })
    if (error) {
      toast('Erro ao enviar imagem', 'error')
    } else {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      setUrl(data.publicUrl)
    }
    setUploading(null)
  }

  // ── Links ────────────────────────────────────────────────────────────────
  function addLink() {
    if (links.length >= MAX_PROFILE_LINKS) return
    const used = new Set(links.map((l) => l.platform))
    const next = PLATFORM_ORDER.find((p) => !used.has(p)) ?? 'tiktok'
    setLinks([
      ...links,
      { key: crypto.randomUUID(), platform: next, url: '', display_name: '', followers_count: '' },
    ])
  }

  function updateLink(key: string, patch: Partial<EditableLink>) {
    setLinks((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)))
  }

  function removeLink(key: string) {
    setLinks((prev) => prev.filter((l) => l.key !== key))
  }

  function onLinksDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (over && active.id !== over.id) {
      setLinks((prev) => {
        const from = prev.findIndex((l) => l.key === active.id)
        const to = prev.findIndex((l) => l.key === over.id)
        return arrayMove(prev, from, to)
      })
    }
  }

  // ── Featured achievements ──────────────────────────────────────────────────
  function toggleFeatured(slug: string) {
    setFeatured((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug)
      if (prev.length >= MAX_FEATURED_ACHIEVEMENTS) {
        toast(`Máximo ${MAX_FEATURED_ACHIEVEMENTS} conquistas em destaque`, 'warning')
        return prev
      }
      return [...prev, slug]
    })
  }

  function onFeaturedDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (over && active.id !== over.id) {
      setFeatured((prev) => {
        const from = prev.indexOf(active.id as string)
        const to = prev.indexOf(over.id as string)
        return arrayMove(prev, from, to)
      })
    }
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  async function handleSave() {
    // Server-side rules mirrored client-side — never trust the input blindly.
    const nextUsername = normalizeUsername(username)
    const usernameErr = validateUsername(nextUsername)
    if (usernameErr) {
      toast(USERNAME_ERROR_MESSAGE[usernameErr], 'error')
      return
    }
    if (usernameChecking) {
      toast('Aguarde a verificação do nickname', 'warning')
      return
    }
    if (usernameAvailable === false) {
      toast('Este nickname já está em uso', 'error')
      return
    }

    setSaving(true)
    const usernameChanged = nextUsername !== currentUsername

    const { error: profErr } = await supabase
      .from('profiles')
      .update({
        username: nextUsername,
        full_name: displayName.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl || null,
        banner_url: bannerUrl || null,
        featured_achievements: featured,
      })
      .eq('id', initialProfile.id)

    if (profErr) {
      // 23505 = unique violation (nickname taken), 23514 = check constraint
      // (invalid format / reserved word) — both enforced at the DB level.
      if (profErr.code === '23505') {
        toast('Este nickname já está em uso', 'error')
        setUsernameAvailable(false)
      } else if (profErr.code === '23514') {
        toast('Nickname inválido ou reservado', 'error')
        setUsernameAvailable(false)
      } else {
        toast('Erro ao salvar perfil', 'error')
      }
      setSaving(false)
      return
    }

    // Reconcile links: replace the whole set (simple + reliable for <=6 rows)
    await supabase.from('profile_links').delete().eq('user_id', initialProfile.id)
    const validLinks = links.filter((l) => l.url.trim())
    if (validLinks.length > 0) {
      const { error: linksErr } = await supabase.from('profile_links').insert(
        validLinks.map((l, i) => ({
          user_id: initialProfile.id,
          platform: l.platform,
          url: l.url.trim(),
          display_name: l.display_name.trim() || null,
          followers_count: l.followers_count.trim() || null,
          sort_order: i,
        })),
      )
      if (linksErr) {
        toast('Perfil salvo, mas houve erro nas redes', 'warning')
        setSaving(false)
        return
      }
    }

    // Onboarding: editing the profile completes nickname/photo steps.
    // (This page lives outside the dashboard's OnboardingProvider, so we write
    // straight to the checklist via the lib helper.)
    if (!initialProfile.checklist_completed) {
      await markChecklistItem(supabase, initialProfile.id, 'set_nickname')
      if (avatarUrl) await markChecklistItem(supabase, initialProfile.id, 'upload_photo')
    }

    setSaving(false)

    if (usernameChanged) {
      // The public URL moved — take the user to their new address.
      toast(`Nickname atualizado! Seu perfil agora é /perfil/${nextUsername}`, 'success')
      router.push(`/perfil/${nextUsername}`)
    } else {
      toast('Perfil atualizado!', 'success')
      router.refresh()
    }
  }

  // Preview object shaped like public_profiles
  const previewProfile: Database['public']['Views']['public_profiles']['Row'] = {
    id: initialProfile.id,
    username: initialProfile.username,
    full_name: displayName,
    avatar_url: avatarUrl || null,
    banner_url: bannerUrl || null,
    bio: bio,
    plan: initialProfile.plan,
    total_views: initialProfile.total_views,
    total_posts: initialProfile.total_posts,
    ranking_position: initialProfile.ranking_position,
    featured_achievements: featured,
    created_at: initialProfile.created_at,
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {setupMode && (
        <div className="mb-6 rounded-2xl border border-mint/30 bg-mint/[0.06] px-5 py-4">
          <p className="text-[14px] font-semibold text-mint">
            Escolha seu nickname para acessar seu perfil público.
          </p>
          <p className="mt-1 text-[13px] text-white/60">
            Defina um nickname disponível abaixo e salve para continuar usando a plataforma.
          </p>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-[22px] font-bold tracking-[-0.02em] text-white">
          Editar perfil
        </h1>
        <button
          onClick={handleSave}
          disabled={saving || uploading !== null || usernameChecking || usernameAvailable === false}
          className="inline-flex items-center gap-2 rounded-full bg-purple px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#7c3aed] disabled:opacity-50"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(320px,380px)]">
        {/* ── FORM ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-8">
          {/* SECTION 1 — Identidade */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-md">
            <h2 className="mb-4 font-display text-[15px] font-semibold text-white">Identidade</h2>

            {/* Banner */}
            <label className="mb-2 block text-[12px] font-medium text-white/50">Banner</label>
            <button
              onClick={() => bannerInput.current?.click()}
              className="group relative mb-5 block h-28 w-full overflow-hidden rounded-xl border border-white/[0.08]"
              style={{ background: bannerUrl ? undefined : 'linear-gradient(135deg, #1a0533, #000)' }}
            >
              {bannerUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bannerUrl} alt="" className="h-full w-full object-cover" />
              )}
              <span className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 text-[12px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                {uploading === 'banner' ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                Trocar banner
              </span>
            </button>
            <input
              ref={bannerInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'banners', setBannerUrl)}
            />

            {/* Avatar */}
            <div className="mb-5 flex items-center gap-4">
              <button
                onClick={() => avatarInput.current?.click()}
                className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-black"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-white/40">
                    {(displayName || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  {uploading === 'avatar' ? <Loader2 size={16} className="animate-spin text-white" /> : <Camera size={16} className="text-white" />}
                </span>
              </button>
              <div className="text-[12px] text-white/40">
                Avatar quadrado, mínimo 200×200px.<br />JPG, PNG ou WebP.
              </div>
            </div>
            <input
              ref={avatarInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'avatars', setAvatarUrl)}
            />

            {/* Nickname (username) */}
            <label className="mb-1.5 block text-[12px] font-medium text-white/50">Nickname</label>
            <div className="mb-4">
              <UsernameInput
                value={username}
                onChange={setUsername}
                currentUsername={currentUsername}
                onAvailabilityChange={(available, isChecking) => {
                  setUsernameAvailable(available)
                  setUsernameChecking(isChecking)
                }}
              />
            </div>

            {/* Display name */}
            <label className="mb-1.5 block text-[12px] font-medium text-white/50">Nome de exibição</label>
            <input
              value={displayName}
              maxLength={MAX_DISPLAY_NAME_LENGTH}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Seu nome"
              className="mb-1 w-full rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-purple/50"
            />
            <div className="mb-4 text-right text-[11px] text-white/30">
              {displayName.length}/{MAX_DISPLAY_NAME_LENGTH}
            </div>

            {/* Bio */}
            <label className="mb-1.5 block text-[12px] font-medium text-white/50">Bio</label>
            <textarea
              value={bio}
              maxLength={MAX_BIO_LENGTH}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Conte um pouco sobre você e seu conteúdo."
              className="w-full resize-none rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-purple/50"
            />
            <div className="text-right text-[11px] text-white/30">
              {bio.length}/{MAX_BIO_LENGTH}
            </div>
          </section>

          {/* SECTION 2 — Redes de corte */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-[15px] font-semibold text-white">Redes de corte</h2>
              <button
                onClick={addLink}
                disabled={links.length >= MAX_PROFILE_LINKS}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:border-white/[0.25] hover:text-white disabled:opacity-40"
              >
                <Plus size={13} />
                Adicionar ({links.length}/{MAX_PROFILE_LINKS})
              </button>
            </div>

            {links.length === 0 ? (
              <p className="py-4 text-center text-[13px] text-white/30">
                Nenhuma rede ainda. Clique em adicionar.
              </p>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onLinksDragEnd}>
                <SortableContext items={links.map((l) => l.key)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-3">
                    {links.map((link) => (
                      <SortableLinkRow
                        key={link.key}
                        link={link}
                        onChange={(patch) => updateLink(link.key, patch)}
                        onRemove={() => removeLink(link.key)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </section>

          {/* SECTION 3 — Conquistas em destaque */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-md">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-display text-[15px] font-semibold text-white">Conquistas em destaque</h2>
              <span className="text-[12px] text-white/40">{featured.length}/{MAX_FEATURED_ACHIEVEMENTS}</span>
            </div>
            <p className="mb-4 text-[12px] text-white/40">
              Escolha até {MAX_FEATURED_ACHIEVEMENTS} conquistas para destacar no topo. Arraste para reordenar.
            </p>

            {unlockedAchievements.length === 0 ? (
              <p className="py-4 text-center text-[13px] text-white/30">
                Você ainda não desbloqueou nenhuma conquista.
              </p>
            ) : (
              <>
                {/* Selected (reorderable) */}
                {featured.length > 0 && (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onFeaturedDragEnd}>
                    <SortableContext items={featured} strategy={verticalListSortingStrategy}>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {featured.map((slug) => {
                          const a = achievements.find((x) => x.slug === slug)
                          if (!a) return null
                          return (
                            <SortableFeaturedChip
                              key={slug}
                              slug={slug}
                              achievement={a}
                              onRemove={() => toggleFeatured(slug)}
                            />
                          )
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}

                {/* Pool of unlocked achievements */}
                <div className="flex flex-wrap gap-3">
                  {unlockedAchievements.map((a) => {
                    const active = featured.includes(a.slug)
                    return (
                      <button
                        key={a.slug}
                        onClick={() => toggleFeatured(a.slug)}
                        className={[
                          'relative rounded-xl border p-2 transition-colors',
                          active
                            ? 'border-mint/40 bg-mint/[0.06]'
                            : 'border-white/[0.06] hover:border-white/[0.15]',
                        ].join(' ')}
                        title={a.name}
                      >
                        <AchievementIcon iconType={a.icon_type} tier={a.tier as AchievementTier} size={44} />
                        {active && (
                          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-mint text-black">
                            <Check size={11} strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </section>
        </div>

        {/* ── LIVE PREVIEW ──────────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
            Pré-visualização
          </p>
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/40">
            <ProfileHeader profile={previewProfile} isOwnProfile={false} />
            <div className="h-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sortable link row ────────────────────────────────────────────────────────
function SortableLinkRow({
  link,
  onChange,
  onRemove,
}: {
  link: EditableLink
  onChange: (patch: Partial<EditableLink>) => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.key })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-2 rounded-xl border border-white/[0.06] bg-black/30 p-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-2 cursor-grab text-white/30 hover:text-white/60 active:cursor-grabbing"
        aria-label="Reordenar"
      >
        <GripVertical size={16} />
      </button>

      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <select
            value={link.platform}
            onChange={(e) => onChange({ platform: e.target.value as ProfilePlatform })}
            className="rounded-lg border border-white/[0.08] bg-black/40 px-2.5 py-2 text-[13px] text-white outline-none focus:border-purple/50"
          >
            {PLATFORM_ORDER.map((p) => (
              <option key={p} value={p} className="bg-[#15151c]">
                {PLATFORM_META[p].label}
              </option>
            ))}
          </select>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ background: `${PLATFORM_META[link.platform].color}1A`, color: PLATFORM_META[link.platform].color }}
          >
            <PlatformIcon platform={link.platform} size={17} />
          </span>
          <input
            value={link.url}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder={PLATFORM_META[link.platform].placeholder}
            className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2 text-[13px] text-white outline-none focus:border-purple/50"
          />
        </div>
        <div className="flex gap-2">
          <input
            value={link.display_name}
            onChange={(e) => onChange({ display_name: e.target.value })}
            placeholder="@usuário (opcional)"
            className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2 text-[13px] text-white outline-none focus:border-purple/50"
          />
          <input
            value={link.followers_count}
            onChange={(e) => onChange({ followers_count: e.target.value })}
            placeholder="Seguidores (ex: 2.3M)"
            className="w-40 rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2 text-[13px] text-white outline-none focus:border-purple/50"
          />
        </div>
      </div>

      <button
        onClick={onRemove}
        className="mt-1 text-white/30 transition-colors hover:text-[#ef4444]"
        aria-label="Remover"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

// ── Sortable featured chip ─────────────────────────────────────────────────────
function SortableFeaturedChip({
  slug,
  achievement,
  onRemove,
}: {
  slug: string
  achievement: Achievement
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: slug })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-full border border-mint/30 bg-mint/[0.06] py-1 pl-1 pr-2"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
        aria-label="Reordenar"
      >
        <AchievementIcon iconType={achievement.icon_type} tier={achievement.tier as AchievementTier} size={28} />
      </button>
      <span className="text-[12px] font-medium text-white">{achievement.name}</span>
      <button onClick={onRemove} className="text-white/40 hover:text-white" aria-label="Remover destaque">
        <X size={13} />
      </button>
    </div>
  )
}
