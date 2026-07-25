'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ImagePlus, Send, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/shared/Toast'
import { formatDate } from '@/lib/utils'
import { AttachmentImage, Lightbox } from './AttachmentImage'
import { uploadTicketImages, validateImage } from './upload'
import { MAX_ATTACHMENTS } from '@/lib/support'

interface Message {
  id: string
  author_id: string
  author_role: 'user' | 'admin'
  body: string
  created_at: string
}
interface Attachment {
  id: string
  message_id: string | null
  file_url: string
  file_name: string | null
}

interface TicketThreadProps {
  ticketId: string
  currentUserId: string
  authorRole: 'user' | 'admin' // role the viewer posts as
  ownerName: string            // ticket owner's display name (for user messages)
  canReply: boolean
  onAfterReply?: () => void
}

export function TicketThread({
  ticketId, currentUserId, authorRole, ownerName, canReply, onAfterReply,
}: TicketThreadProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [sending, setSending] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchThread = useCallback(async () => {
    const supabase = createClient()
    const [msgRes, attRes] = await Promise.all([
      supabase.from('ticket_messages').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true }),
      supabase.from('ticket_attachments').select('id, message_id, file_url, file_name').eq('ticket_id', ticketId),
    ])
    setMessages((msgRes.data as Message[]) ?? [])
    setAttachments((attRes.data as Attachment[]) ?? [])
    setLoading(false)
  }, [ticketId])

  // Initial load + poll-on-focus (refetch when the tab regains focus)
  useEffect(() => {
    fetchThread()
    const onFocus = () => fetchThread()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [fetchThread])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const incoming = Array.from(list)
    const room = MAX_ATTACHMENTS - files.length
    for (const f of incoming.slice(0, room)) {
      const err = validateImage(f)
      if (err) { toast(err, 'error'); continue }
      setFiles((prev) => (prev.length < MAX_ATTACHMENTS ? [...prev, f] : prev))
    }
  }

  const handleSend = async () => {
    if (!body.trim() && files.length === 0) return
    setSending(true)
    const supabase = createClient()
    const { data: msg, error } = await supabase
      .from('ticket_messages')
      .insert({ ticket_id: ticketId, author_id: currentUserId, author_role: authorRole, body: body.trim() || '(imagem)' })
      .select('id')
      .single()
    if (error || !msg) {
      toast('Erro ao enviar mensagem', 'error')
      setSending(false)
      return
    }
    if (files.length > 0) {
      try {
        const uploaded = await uploadTicketImages(supabase, ticketId, currentUserId, files)
        await supabase.from('ticket_attachments').insert(
          uploaded.map((u) => ({ ...u, ticket_id: ticketId, message_id: msg.id, uploaded_by: currentUserId })),
        )
      } catch {
        toast('Mensagem enviada, mas houve erro em uma imagem', 'warning')
      }
    }
    setBody('')
    setFiles([])
    setSending(false)
    await fetchThread()
    onAfterReply?.()
  }

  const attachmentsFor = (messageId: string) => attachments.filter((a) => a.message_id === messageId)

  return (
    <div className="flex flex-col">
      {/* Messages */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="py-8 text-center text-[13px] text-white/30">Carregando conversa...</div>
        ) : (
          messages.map((m) => {
            const isAdmin = m.author_role === 'admin'
            const mine = m.author_id === currentUserId
            const label = isAdmin ? 'Equipe MultiClip Hub' : (mine ? 'Você' : ownerName)
            const atts = attachmentsFor(m.id)
            return (
              <div key={m.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl border p-3 ${
                    isAdmin
                      ? 'border-[#9146FF]/30 bg-[#9146FF]/[0.06]'
                      : 'border-white/[0.08] bg-white/[0.03]'
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className={`text-[11px] font-semibold ${isAdmin ? 'text-[#9146FF]' : 'text-white/80'}`}>
                      {label}
                    </span>
                    {isAdmin && (
                      <span className="rounded-full bg-[#9146FF]/20 px-1.5 py-0.5 text-[8px] font-bold uppercase text-[#9146FF]">
                        Staff
                      </span>
                    )}
                    <span className="text-[10px] text-white/30">{formatDate(m.created_at)}</span>
                  </div>
                  {m.body && m.body !== '(imagem)' && (
                    <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-white/80">{m.body}</p>
                  )}
                  {atts.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {atts.map((a) => (
                        <AttachmentImage key={a.id} path={a.file_url} name={a.file_name} onOpen={setLightbox} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply box */}
      {canReply ? (
        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3">
          {files.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {files.map((f, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(f)} alt={f.name} className="h-16 w-16 rounded-lg object-cover" />
                  <button
                    onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#ef4444] text-white"
                    aria-label="Remover"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Escreva sua resposta..."
            className="w-full resize-none rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2.5 text-[13px] text-white outline-none focus:border-[#9146FF]/50"
          />
          <div className="mt-2 flex items-center justify-between">
            <button
              onClick={() => fileInput.current?.click()}
              disabled={files.length >= MAX_ATTACHMENTS}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-1.5 text-[12px] text-white/60 transition-colors hover:text-white disabled:opacity-40"
            >
              <ImagePlus size={14} />
              Imagem ({files.length}/{MAX_ATTACHMENTS})
            </button>
            <input
              ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp,image/gif"
              multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
            />
            <button
              onClick={handleSend}
              disabled={sending || (!body.trim() && files.length === 0)}
              className="inline-flex items-center gap-2 rounded-full bg-[#9146FF] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#7c3aed] disabled:opacity-50"
            >
              {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Responder
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 text-center text-[13px] text-white/40">
          Este chamado foi fechado. Abra um novo se precisar.
        </div>
      )}

      <Lightbox url={lightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}
