'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ImagePlus, Loader2, X } from 'lucide-react'
import { Topbar } from '@/components/dashboard/Topbar'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/shared/Toast'
import { uploadTicketImages, validateImage } from '@/components/support/upload'
import {
  CATEGORY_OPTIONS, CATEGORY_META, MAX_ATTACHMENTS, type TicketCategory,
} from '@/lib/support'

const MAX_SUBJECT = 120
const MAX_DESC = 2000

export default function NewTicketPage() {
  const router = useRouter()
  const { profile } = useUser()
  const { toast } = useToast()

  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState<TicketCategory>('duvida')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const room = MAX_ATTACHMENTS - files.length
    for (const f of Array.from(list).slice(0, room)) {
      const err = validateImage(f)
      if (err) { toast(err, 'error'); continue }
      setFiles((prev) => (prev.length < MAX_ATTACHMENTS ? [...prev, f] : prev))
    }
  }

  const handleSubmit = async () => {
    if (!profile?.id) return
    if (!subject.trim() || !description.trim()) {
      toast('Preencha assunto e descrição', 'error')
      return
    }
    setSubmitting(true)
    const supabase = createClient()

    // 1. Ticket
    const { data: ticket, error: tErr } = await supabase
      .from('tickets')
      .insert({ user_id: profile.id, subject: subject.trim(), category, status: 'aberto', priority: 'normal' })
      .select('id')
      .single()
    if (tErr || !ticket) {
      toast('Erro ao abrir chamado', 'error')
      setSubmitting(false)
      return
    }

    // 2. First message
    const { data: msg } = await supabase
      .from('ticket_messages')
      .insert({ ticket_id: ticket.id, author_id: profile.id, author_role: 'user', body: description.trim() })
      .select('id')
      .single()

    // 3. Attachments linked to the first message
    if (files.length > 0) {
      try {
        const uploaded = await uploadTicketImages(supabase, ticket.id, profile.id, files)
        await supabase.from('ticket_attachments').insert(
          uploaded.map((u) => ({ ...u, ticket_id: ticket.id, message_id: msg?.id ?? null, uploaded_by: profile.id })),
        )
      } catch {
        toast('Chamado criado, mas houve erro em uma imagem', 'warning')
      }
    }

    // 4. Discord seam (Phase 2 no-op stub)
    await supabase.rpc('notify_discord_new_ticket', { p_ticket_id: ticket.id })

    // 5. Redirect
    toast('Chamado enviado!', 'success')
    router.push(`/suporte/${ticket.id}`)
  }

  return (
    <div>
      <Topbar title="Novo chamado" />
      <div className="mx-auto max-w-2xl p-6 space-y-5">
        <Link href="/suporte" className="inline-flex items-center gap-1.5 text-[13px] text-white/50 transition-colors hover:text-white">
          <ArrowLeft size={15} /> Voltar
        </Link>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
          {/* Subject */}
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-white/60">Assunto</label>
            <input
              value={subject}
              maxLength={MAX_SUBJECT}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Resuma seu problema"
              className="w-full rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#9146FF]/50"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-white/60">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                    category === c
                      ? 'border-transparent text-white'
                      : 'border-white/[0.1] text-white/50 hover:text-white'
                  }`}
                  style={category === c ? { background: CATEGORY_META[c].color } : undefined}
                >
                  {CATEGORY_META[c].label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-white/60">Descrição</label>
            <textarea
              value={description}
              maxLength={MAX_DESC}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Descreva com detalhes o que aconteceu."
              className="w-full resize-none rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#9146FF]/50"
            />
            <div className="text-right text-[11px] text-white/30">{description.length}/{MAX_DESC}</div>
          </div>

          {/* Attachments */}
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-white/60">
              Imagens (opcional, até {MAX_ATTACHMENTS})
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {files.map((f, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(f)} alt={f.name} className="h-20 w-20 rounded-lg object-cover" />
                  <button
                    onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#ef4444] text-white"
                    aria-label="Remover"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              {files.length < MAX_ATTACHMENTS && (
                <button
                  onClick={() => fileInput.current?.click()}
                  className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/[0.15] text-white/40 transition-colors hover:border-[#9146FF]/50 hover:text-white"
                >
                  <ImagePlus size={18} />
                  <span className="text-[10px]">Adicionar</span>
                </button>
              )}
            </div>
            <input
              ref={fileInput} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#9146FF] py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#7c3aed] disabled:opacity-50"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            Enviar chamado
          </button>
        </div>
      </div>
    </div>
  )
}
