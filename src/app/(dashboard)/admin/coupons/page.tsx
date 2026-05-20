'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/shared/Toast'
import { formatDate } from '@/lib/utils'

interface Coupon {
  id: string
  code: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  is_active: boolean
  created_at: string
}

const EMPTY: Omit<Coupon, 'id' | 'used_count' | 'created_at'> = {
  code: '',
  discount_type: 'percent',
  discount_value: 10,
  max_uses: null,
  expires_at: null,
  is_active: true,
}

export default function AdminCouponsPage() {
  const { toast } = useToast()
  const [coupons, setCoupons]     = useState<Coupon[]>([])
  const [loading, setLoading]     = useState(true)
  const [creating, setCreating]   = useState(false)
  const [form, setForm]           = useState({ ...EMPTY })
  const [saving, setSaving]       = useState(false)

  const fetchCoupons = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
    setCoupons((data as Coupon[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchCoupons() }, [fetchCoupons])

  const createCoupon = async () => {
    if (!form.code.trim()) { toast('Código obrigatório', 'error'); return }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('coupons').insert({
      code:           form.code.toUpperCase().trim(),
      discount_type:  form.discount_type,
      discount_value: form.discount_value,
      max_uses:       form.max_uses,
      expires_at:     form.expires_at || null,
      is_active:      form.is_active,
    })
    if (error) {
      toast(error.code === '23505' ? 'Código já existe' : 'Erro ao criar cupom', 'error')
    } else {
      toast('Cupom criado', 'success')
      setForm({ ...EMPTY })
      setCreating(false)
      fetchCoupons()
    }
    setSaving(false)
  }

  const toggleActive = async (id: string, current: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('coupons')
      .update({ is_active: !current })
      .eq('id', id)
    if (error) { toast('Erro ao atualizar', 'error') }
    else { setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c)) }
  }

  const deleteCoupon = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('coupons').delete().eq('id', id)
    if (error) { toast('Erro ao remover', 'error') }
    else { setCoupons(prev => prev.filter(c => c.id !== id)); toast('Cupom removido', 'success') }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-white">Cupons</h1>
          <p className="mt-0.5 text-[13px] text-[#888888]">{coupons.length} cupons cadastrados</p>
        </div>
        <button
          onClick={() => setCreating(v => !v)}
          className="rounded-lg bg-[#9146FF] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#7c35e0]"
        >
          {creating ? 'Cancelar' : '+ Novo cupom'}
        </button>
      </div>

      {/* Form */}
      {creating && (
        <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-5 space-y-4">
          <h2 className="text-[13px] font-semibold text-white">Novo Cupom</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-[10px] text-[#555555]">Código</label>
              <input
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                placeholder="BLACK50"
                className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-[12px] uppercase text-white outline-none focus:border-[#9146FF]/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#555555]">Tipo</label>
              <select
                value={form.discount_type}
                onChange={e => setForm(f => ({ ...f, discount_type: e.target.value as 'percent' | 'fixed' }))}
                className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none"
              >
                <option value="percent">Porcentagem (%)</option>
                <option value="fixed">Valor fixo (R$)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#555555]">
                Valor {form.discount_type === 'percent' ? '(%)' : '(centavos)'}
              </label>
              <input
                type="number"
                value={form.discount_value}
                onChange={e => setForm(f => ({ ...f, discount_value: Number(e.target.value) }))}
                min={1}
                className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none focus:border-[#9146FF]/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#555555]">Máx. usos (vazio = ilimitado)</label>
              <input
                type="number"
                value={form.max_uses ?? ''}
                onChange={e => setForm(f => ({ ...f, max_uses: e.target.value ? Number(e.target.value) : null }))}
                placeholder="∞"
                className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none focus:border-[#9146FF]/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#555555]">Expira em</label>
              <input
                type="date"
                value={form.expires_at ?? ''}
                onChange={e => setForm(f => ({ ...f, expires_at: e.target.value || null }))}
                className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none focus:border-[#9146FF]/50"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2">
                <div
                  onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  className={`relative h-5 w-9 rounded-full transition-colors ${form.is_active ? 'bg-[#9146FF]' : 'bg-[#333]'}`}
                >
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${form.is_active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-[11px] text-[#888888]">Ativo</span>
              </label>
            </div>
          </div>
          <button
            onClick={createCoupon}
            disabled={saving}
            className="rounded-lg bg-[#9146FF] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#7c35e0] disabled:opacity-50"
          >
            {saving ? 'Criando...' : 'Criar cupom'}
          </button>
        </div>
      )}

      {/* List */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111111] overflow-hidden">
        <div className="grid grid-cols-[1fr_90px_80px_80px_70px_60px] border-b border-white/[0.06] px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#444444]">
          <span>Código</span>
          <span>Desconto</span>
          <span>Usos</span>
          <span>Expira</span>
          <span>Status</span>
          <span>Ação</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse bg-white/[0.02] px-4" />
              ))
            : coupons.length === 0
            ? <div className="px-4 py-8 text-center text-[13px] text-[#444444]">Nenhum cupom criado</div>
            : coupons.map(c => (
                <div key={c.id} className="grid grid-cols-[1fr_90px_80px_80px_70px_60px] items-center gap-3 px-4 py-3">
                  <span className="font-mono text-[12px] font-semibold text-white">{c.code}</span>
                  <span className="text-[12px] text-[#888888]">
                    {c.discount_type === 'percent' ? `${c.discount_value}%` : `R$${(c.discount_value / 100).toFixed(2)}`}
                  </span>
                  <span className="text-[12px] text-[#888888]">
                    {c.used_count}{c.max_uses ? `/${c.max_uses}` : ''}
                  </span>
                  <span className="text-[11px] text-[#888888]">
                    {c.expires_at ? formatDate(c.expires_at) : '—'}
                  </span>
                  <button
                    onClick={() => toggleActive(c.id, c.is_active)}
                    className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                      c.is_active
                        ? 'bg-[#00E5A0]/10 text-[#00E5A0]'
                        : 'bg-white/[0.04] text-[#555555]'
                    }`}
                  >
                    {c.is_active ? 'Ativo' : 'Inativo'}
                  </button>
                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="text-[11px] text-[#ef4444] hover:underline"
                  >
                    Remover
                  </button>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
