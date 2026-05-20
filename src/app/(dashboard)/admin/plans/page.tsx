'use client'

export default function AdminPlansPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6">
      <div className="text-center space-y-2">
        <div className="text-4xl">💳</div>
        <h1 className="text-[20px] font-bold text-white">Gestão de Planos</h1>
        <p className="text-[13px] text-[#888888] max-w-sm">
          Os planos e preços são gerenciados diretamente no painel do Stripe. Clique abaixo para acessá-lo.
        </p>
      </div>
      <a
        href="https://dashboard.stripe.com/products"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl bg-[#635BFF] px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        Abrir Stripe Dashboard →
      </a>
    </div>
  )
}
