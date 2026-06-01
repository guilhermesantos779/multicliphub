'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TICKET_ATTACH_BUCKET } from '@/lib/support'

interface AttachmentImageProps {
  path: string // storage path inside the private bucket
  name?: string | null
  onOpen?: (url: string) => void
}

// Resolves a signed URL for a private-bucket image and renders a thumbnail.
export function AttachmentImage({ path, name, onOpen }: AttachmentImageProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const { data, error } = await supabase.storage
        .from(TICKET_ATTACH_BUCKET)
        .createSignedUrl(path, 3600)
      if (cancelled) return
      if (error || !data) setFailed(true)
      else setUrl(data.signedUrl)
    })()
    return () => { cancelled = true }
  }, [path])

  if (failed) {
    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-[10px] text-white/30">
        imagem
      </div>
    )
  }
  if (!url) {
    return <div className="h-20 w-20 animate-pulse rounded-lg bg-white/[0.06]" />
  }
  return (
    <button
      type="button"
      onClick={() => onOpen?.(url)}
      className="overflow-hidden rounded-lg border border-white/[0.08] transition-transform hover:scale-[1.03]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={name || 'Anexo'} className="h-20 w-20 object-cover" />
    </button>
  )
}

// Simple, dependency-free lightbox modal
export function Lightbox({ url, onClose }: { url: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!url) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [url, onClose])

  if (!url) return null
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="Anexo" className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain" />
    </div>
  )
}
