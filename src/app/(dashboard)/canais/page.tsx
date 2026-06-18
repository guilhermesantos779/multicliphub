'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Topbar } from '@/components/dashboard/Topbar'
import { PlatformIcon } from '@/components/shared/PlatformIcon'
import { useUser } from '@/hooks/useUser'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useToast } from '@/components/shared/Toast'
import { createClient } from '@/lib/supabase/client'
import type { Platform } from '@/types/api.types'

interface Channel {
  id: string
  platform: Platform
  channel_name: string
  channel_id: string
  is_active: boolean
  created_at: string
}

const PLATFORM_INFO: Record<Platform, { name: string; color: string; desc: string }> = {
  tiktok:    { name: 'TikTok',            color: '#fe2c55', desc: 'Publique TikToks automaticamente' },
  instagram: { name: 'Instagram Reels',   color: '#c13584', desc: 'Publique Reels com 1 clique' },
  youtube:   { name: 'YouTube Shorts',    color: '#ff0000', desc: 'Suba Shorts direto do painel' },
}

export default function CanaisPage() {
  const { profile } = useUser()
  const { markItem } = useOnboarding()
  const { toast } = useToast()
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('channels')
        .select('id, platform, channel_name, channel_id, is_active, created_at')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
      setChannels((data as Channel[]) || [])
      setLoading(false)
      // Onboarding: having at least one active channel completes this step.
      if ((data || []).some((c) => c.is_active)) markItem('connect_channel')
    }
    load()
  }, [profile, markItem])

  const handleDisconnect = async (id: string) => {
    const supabase = createClient()
    await supabase.from('channels').update({ is_active: false }).eq('id', id)
    setChannels(prev => prev.map(c => c.id === id ? { ...c, is_active: false } : c))
    toast('Canal desconectado', 'info')
  }

  // Permanently removes the channel row (token included), unlike disconnect
  // which only deactivates it.
  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('channels').delete().eq('id', id)
    if (error) { toast('Erro ao excluir conta', 'error'); return }
    setChannels(prev => prev.filter(c => c.id !== id))
    setConfirmDelete(null)
    toast('Conta excluída', 'info')
  }

  const handleConnect = (platform: Platform) => {
    toast(`Redirecionando para ${PLATFORM_INFO[platform].name}…`, 'info')
    setTimeout(() => { window.location.href = `/api/auth/oauth/${platform}` }, 800)
  }

  const connected = channels.filter(c => c.is_active)

  return (
    <div>
      <Topbar title="Gestão de Canais" />
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-white">Canais Conectados</h2>
            <p className="mt-0.5 text-[12px] text-[#888888]">
              {connected.length} de 3 plataformas ativas
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 rounded-full bg-[#9146FF] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#7c3aed]"
          >
            + Conectar canal
          </button>
        </div>

        {/* Lista */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111111] divide-y divide-white/[0.04]">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="h-9 w-9 rounded-full bg-white/[0.06]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-32 rounded bg-white/[0.06]" />
                  <div className="h-2.5 w-20 rounded bg-white/[0.04]" />
                </div>
              </div>
            ))
          ) : channels.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="mb-3 text-4xl">🔗</div>
              <div className="text-[14px] font-medium text-white mb-1">Nenhum canal conectado</div>
              <div className="text-[12px] text-[#444444] mb-4">Conecte suas redes para publicar com 1 clique</div>
              <button
                onClick={() => setModal(true)}
                className="rounded-lg bg-[#9146FF] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#7c3aed]"
              >
                Conectar agora
              </button>
            </div>
          ) : (
            channels.map((ch, i) => {
              const info = PLATFORM_INFO[ch.platform]
              return (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <PlatformIcon platform={ch.platform} size={20} withLink={false} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-white truncate">
                      {ch.channel_name}
                    </div>
                    <div className="text-[11px] text-[#444444]">{info.name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
                      style={ch.is_active
                        ? { color: '#00E5A0', background: 'rgba(0,229,160,0.08)' }
                        : { color: '#555555', background: 'rgba(102,102,102,0.08)' }
                      }
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ch.is_active ? '#00E5A0' : '#555' }} />
                      {ch.is_active ? 'Ativo' : 'Desconectado'}
                    </span>
                    {ch.is_active ? (
                      <button
                        onClick={() => handleDisconnect(ch.id)}
                        className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-[11px] text-[#666666] transition-colors hover:border-[#ef4444]/30 hover:text-[#ef4444]"
                      >
                        Desconectar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(ch.platform)}
                        className="rounded-lg border border-[#9146FF]/30 bg-[#9146FF]/[0.08] px-3 py-1.5 text-[11px] text-[#9146FF] transition-colors hover:bg-[#9146FF]/[0.15]"
                      >
                        Reconectar
                      </button>
                    )}
                    {confirmDelete === ch.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(ch.id)}
                          className="text-[11px] font-semibold text-[#ef4444] hover:text-[#ff6b6b]"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-[11px] text-[#555555] hover:text-white"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(ch.id)}
                        title="Excluir conta permanentemente"
                        className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-[11px] text-[#555555] transition-colors hover:border-[#ef4444]/30 hover:text-[#ef4444]"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Cards plataformas disponíveis */}
        <div>
          <h3 className="mb-3 text-[13px] font-semibold text-[#888888] uppercase tracking-wide">Plataformas suportadas</h3>
          <div className="grid grid-cols-3 gap-4">
            {(Object.entries(PLATFORM_INFO) as [Platform, typeof PLATFORM_INFO[Platform]][]).map(([platform, info]) => {
              const isConnected = connected.some(c => c.platform === platform)
              return (
                <div
                  key={platform}
                  className="rounded-xl border border-white/[0.06] bg-[#111111] p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <PlatformIcon platform={platform} size={22} withLink={false} />
                    {isConnected && (
                      <span className="rounded-full bg-[#00E5A0]/10 px-2 py-0.5 text-[10px] font-medium text-[#00E5A0]">
                        Conectado
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white">{info.name}</div>
                    <div className="text-[11px] text-[#444444] mt-0.5">{info.desc}</div>
                  </div>
                  {!isConnected && (
                    <button
                      onClick={() => handleConnect(platform)}
                      className="w-full rounded-lg border border-white/[0.08] py-2 text-[12px] font-medium text-[#888888] transition-colors hover:border-[#9146FF]/40 hover:text-[#9146FF]"
                    >
                      Conectar
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <p className="text-[11px] text-[#333333]">
          A integração OAuth com TikTok, Instagram e YouTube requer domínio verificado e credenciais configuradas em{' '}
          <code className="text-[#555555]">TIKTOK_CLIENT_KEY</code>,{' '}
          <code className="text-[#555555]">INSTAGRAM_CLIENT_ID</code> e{' '}
          <code className="text-[#555555]">YOUTUBE_CLIENT_ID</code> no ambiente.
        </p>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setModal(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#111111] p-6" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-white">Conectar Canal</h3>
              <button onClick={() => setModal(false)} className="text-[#444444] hover:text-white">✕</button>
            </div>
            <div className="space-y-2">
              {(Object.entries(PLATFORM_INFO) as [Platform, typeof PLATFORM_INFO[Platform]][]).map(([platform, info]) => (
                <button
                  key={platform}
                  onClick={() => { setModal(false); handleConnect(platform) }}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/[0.08] p-3.5 text-left transition-colors hover:border-[#9146FF]/30 hover:bg-[#9146FF]/[0.04]"
                >
                  <PlatformIcon platform={platform} size={18} withLink={false} />
                  <span className="flex-1 text-[13px] text-white">{info.name}</span>
                  <span className="text-[#444444]">→</span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-[#444444]">
              Você será redirecionado para autenticar com segurança.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
