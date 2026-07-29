'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { useToast } from '@/components/shared/Toast'
import { formatDate } from '@/lib/utils'

interface NewsItem {
  id: string
  titulo: string
  descricao: string
  tipo: string | null
  publicado_em: string
}

const TIPO_OPTIONS = [
  { value: '', label: 'Sem tipo' },
  { value: 'feature', label: 'Novidade' },
  { value: 'evento', label: 'Evento' },
  { value: 'aviso', label: 'Aviso' },
  { value: 'manutencao', label: 'Manutenção' },
]

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const EMPTY_FORM = { titulo: '', descricao: '', tipo: '', publicado_em: toDatetimeLocal(new Date().toISOString()) }

export default function AdminNovidadesPage() {
  const { profile } = useUser()
  const { toast } = useToast()
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)

  const fetchItems = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('site_news')
      .select('id, titulo, descricao, tipo, publicado_em')
      .order('publicado_em', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const startCreate = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
    setShowForm(true)
  }

  const startEdit = (item: NewsItem) => {
    setEditingId(item.id)
    setForm({
      titulo: item.titulo,
      descricao: item.descricao,
      tipo: item.tipo ?? '',
      publicado_em: toDatetimeLocal(item.publicado_em),
    })
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
  }

  const save = async () => {
    if (!form.titulo.trim() || !form.descricao.trim()) {
      toast('Título e descrição são obrigatórios', 'error')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const payload = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      tipo: form.tipo || null,
      publicado_em: new Date(form.publicado_em).toISOString(),
    }

    const { error } = editingId
      ? await supabase.from('site_news').update(payload).eq('id', editingId)
      : await supabase.from('site_news').insert({ ...payload, criado_por: profile!.id })

    if (error) {
      toast(editingId ? 'Erro ao atualizar novidade' : 'Erro ao criar novidade', 'error')
    } else {
      toast(editingId ? 'Novidade atualizada' : 'Novidade criada', 'success')
      cancelForm()
      fetchItems()
    }
    setSaving(false)
  }

  const deleteItem = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('site_news').delete().eq('id', id)
    if (error) { toast('Erro ao remover', 'error') }
    else { setItems(prev => prev.filter(i => i.id !== id)); toast('Novidade removida', 'success') }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-white">Novidades</h1>
          <p className="mt-0.5 text-[13px] text-[#888888]">{items.length} itens publicados na home (/inicio)</p>
        </div>
        <button
          onClick={() => (showForm ? cancelForm() : startCreate())}
          className="rounded-lg bg-[#9146FF] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#7c35e0]"
        >
          {showForm ? 'Cancelar' : '+ Nova novidade'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-5 space-y-4">
          <h2 className="text-[13px] font-semibold text-white">{editingId ? 'Editar novidade' : 'Nova novidade'}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] text-[#555555]">Título</label>
              <input
                value={form.titulo}
                onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                placeholder="Nova funcionalidade no ar!"
                className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none focus:border-[#9146FF]/50"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] text-[#555555]">Descrição</label>
              <textarea
                value={form.descricao}
                onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                rows={3}
                placeholder="Conte o que mudou..."
                className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none focus:border-[#9146FF]/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#555555]">Tipo</label>
              <select
                value={form.tipo}
                onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none focus:border-[#9146FF]/50"
              >
                {TIPO_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#555555]">Publicar em</label>
              <input
                type="datetime-local"
                value={form.publicado_em}
                onChange={e => setForm(f => ({ ...f, publicado_em: e.target.value }))}
                className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none focus:border-[#9146FF]/50"
              />
            </div>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-[#9146FF] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#7c35e0] disabled:opacity-50"
          >
            {saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Criar novidade'}
          </button>
        </div>
      )}

      <div className="rounded-xl border border-white/[0.06] bg-[#111111] overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_120px_140px] border-b border-white/[0.06] px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#444444]">
          <span>Título</span>
          <span>Tipo</span>
          <span>Publicado em</span>
          <span>Ações</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 animate-pulse bg-white/[0.02] px-4" />)
            : items.length === 0
            ? <div className="px-4 py-8 text-center text-[13px] text-[#444444]">Nenhuma novidade criada</div>
            : items.map(item => (
                <div key={item.id} className="grid grid-cols-[1fr_100px_120px_140px] items-center gap-3 px-4 py-3">
                  <span className="truncate text-[12px] font-semibold text-white">{item.titulo}</span>
                  <span className="text-[12px] text-[#888888]">{TIPO_OPTIONS.find(t => t.value === item.tipo)?.label ?? '—'}</span>
                  <span className="text-[11px] text-[#888888]">{formatDate(item.publicado_em)}</span>
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(item)} className="text-[11px] text-[#00E5A0] hover:underline">Editar</button>
                    <button onClick={() => deleteItem(item.id)} className="text-[11px] text-[#ef4444] hover:underline">Remover</button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
