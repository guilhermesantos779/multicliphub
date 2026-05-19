import { Topbar } from '@/components/dashboard/Topbar'

export default function PerfilPage() {
  return (
    <div>
      <Topbar title="Perfil" />
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-3 text-4xl">👤</div>
          <div className="mb-1 text-[15px] font-medium text-white">Perfil</div>
          <div className="text-[13px] text-[#444444]">Em breve — Etapa 5</div>
        </div>
      </div>
    </div>
  )
}
