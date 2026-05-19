import { Topbar } from '@/components/dashboard/Topbar'

export default function HistoricoPage() {
  return (
    <div>
      <Topbar title="Histórico" />
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-3 text-4xl">📋</div>
          <div className="mb-1 text-[15px] font-medium text-white">Histórico</div>
          <div className="text-[13px] text-[#444444]">Em breve — Etapa 5</div>
        </div>
      </div>
    </div>
  )
}
