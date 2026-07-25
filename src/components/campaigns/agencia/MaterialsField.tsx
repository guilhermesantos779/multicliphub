import type { ReferenceMaterial, ReferenceMaterialType } from '@/types/campaigns.types'

interface MaterialsFieldProps {
  materials: ReferenceMaterial[]
  onChange: (materials: ReferenceMaterial[]) => void
}

function createEmptyMaterial(): ReferenceMaterial {
  return { id: crypto.randomUUID(), type: 'link', label: '', url: '' }
}

export function MaterialsField({ materials, onChange }: MaterialsFieldProps) {
  const updateMaterial = (id: string, patch: Partial<ReferenceMaterial>) => {
    onChange(materials.map(m => (m.id === id ? { ...m, ...patch } : m)))
  }

  const removeMaterial = (id: string) => {
    onChange(materials.filter(m => m.id !== id))
  }

  const addMaterial = () => {
    onChange([...materials, createEmptyMaterial()])
  }

  return (
    <div className="space-y-3">
      {materials.map(material => (
        <div key={material.id} className="rounded-xl border border-white/[0.08] bg-[#111111] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-1 rounded-lg bg-black/40 p-1">
              {(['link', 'image'] as ReferenceMaterialType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateMaterial(material.id, { type })}
                  className={`rounded-md px-3 py-1 text-[12px] font-medium transition-colors ${
                    material.type === type ? 'bg-[#00E5A0] text-[#0B0F19]' : 'text-[#666666] hover:text-white'
                  }`}
                >
                  {type === 'link' ? 'Link' : 'Imagem'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => removeMaterial(material.id)}
              className="text-[11px] text-[#666666] hover:text-[#ef4444]"
            >
              Remover
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <input
              value={material.label}
              onChange={e => updateMaterial(material.id, { label: e.target.value })}
              placeholder="Rótulo (ex: VOD da live)"
              className="w-full rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2 text-[13px] text-white placeholder-[#444444] outline-none transition-colors focus:border-[#00E5A0]/50"
            />
            <input
              value={material.url}
              onChange={e => updateMaterial(material.id, { url: e.target.value })}
              placeholder={material.type === 'link' ? 'https://...' : 'URL da imagem'}
              className="w-full rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2 text-[13px] text-white placeholder-[#444444] outline-none transition-colors focus:border-[#00E5A0]/50"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addMaterial}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.12] py-3 text-[13px] font-medium text-[#888888] transition-colors hover:border-[#00E5A0]/40 hover:text-[#00E5A0]"
      >
        <span className="text-base leading-none">+</span> Adicionar material
      </button>
    </div>
  )
}
