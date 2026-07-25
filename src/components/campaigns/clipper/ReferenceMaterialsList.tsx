import type { ReferenceMaterial } from '@/types/campaigns-clipper.types'

interface ReferenceMaterialsListProps {
  materials: ReferenceMaterial[]
}

export function ReferenceMaterialsList({ materials }: ReferenceMaterialsListProps) {
  if (materials.length === 0) {
    return <p className="text-[13px] text-[#444444]">Nenhum material de referência disponível.</p>
  }

  return (
    <div className="space-y-2">
      {materials.map(material => (
        <div
          key={material.id}
          className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#0a0a0a] px-3.5 py-2.5"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-sm">
              {material.type === 'image' ? '🖼️' : '🔗'}
            </span>
            <span className="truncate text-[13px] text-white">{material.label}</span>
          </div>
          <a
            href={material.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg border border-white/[0.08] px-3 py-1.5 text-[12px] font-medium text-[#00E5A0] transition-colors hover:bg-[#00E5A0]/10"
          >
            {material.type === 'image' ? 'Baixar' : 'Abrir'}
          </a>
        </div>
      ))}
    </div>
  )
}
