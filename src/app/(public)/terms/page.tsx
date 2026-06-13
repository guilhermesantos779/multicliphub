import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

export const metadata = {
  title: 'Termos de Uso — MultiClip Hub',
}

const SECTIONS = [
  {
    title: '1. Descrição do Serviço',
    content:
      'O MultiClip Hub é uma plataforma SaaS que permite a distribuição simultânea de conteúdo de vídeo para TikTok, Instagram Reels e YouTube Shorts por meio de integrações autorizadas com as APIs oficiais. Toda automação opera exclusivamente dentro dos limites e permissões concedidos pelo próprio usuário via autenticação OAuth.',
  },
  {
    title: '2. Elegibilidade e Conta',
    content:
      'O uso é permitido apenas para maiores de 13 anos. Você é responsável por manter a confidencialidade de suas credenciais. É proibida a criação de múltiplas contas para contornar limitações. O MultiClip Hub reserva-se o direito de suspender contas que violem estes Termos.',
  },
  {
    title: '3. Uso Aceitável e Automação',
    content:
      'É proibido usar o MultiClip Hub para: publicar conteúdo que infrinja direitos autorais; distribuir conteúdo ilegal, difamatório ou que incite violência; realizar spam ou comportamentos que violem os Termos das plataformas integradas; tentar contornar limites de API ou mecanismos de segurança.',
  },
  {
    title: '4. Direitos Autorais e Responsabilidade',
    content:
      'O usuário declara possuir todos os direitos necessários sobre o conteúdo publicado via MultiClip Hub. O MultiClip Hub atua exclusivamente como intermediário técnico e não reivindica propriedade sobre nenhum conteúdo. O usuário é o único responsável por disputas ou penalidades decorrentes do conteúdo publicado.',
  },
  {
    title: '5. Planos, Pagamentos e Cancelamento',
    content:
      'O MultiClip Hub oferece planos pagos com 7 dias de teste gratuito. Cobranças são realizadas no início de cada ciclo. O cancelamento pode ser feito a qualquer momento nas Configurações. O acesso permanece ativo até o fim do período pago. Reembolsos são analisados caso a caso em até 7 dias após a cobrança.',
  },
  {
    title: '6. Integrações com Plataformas Terceiras',
    content:
      'O MultiClip Hub integra-se com TikTok, Instagram (Meta) e YouTube (Google) exclusivamente por meio de APIs oficiais. O usuário pode revogar o acesso a qualquer momento diretamente nas configurações de privacidade de cada plataforma. O MultiClip Hub não é afiliado, patrocinado ou endossado pelo TikTok, Meta ou Google.',
  },
  {
    title: '7. Limitação de Responsabilidade',
    content:
      'O MultiClip Hub é fornecido "como está", sem garantias de disponibilidade ininterrupta. Em nenhuma hipótese será responsável por perdas indiretas ou lucros cessantes. A responsabilidade máxima fica limitada ao valor pago pelo plano no mês em que ocorreu o dano.',
  },
  {
    title: '8. Contato',
    content:
      'Para dúvidas sobre estes Termos: multicliphubempresa@multicliphub.com.br · Tempo de resposta: até 5 dias úteis.',
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo height={32} variant="mint" />
          <Link
            href="/"
            className="text-[13px] text-[#888888] transition-colors hover:text-white"
          >
            ← Voltar ao início
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-10">
          <h1 className="text-[28px] font-bold text-white">Termos de Uso</h1>
          <p className="mt-2 text-[13px] text-[#888888]">Última atualização: maio de 2025</p>
        </div>

        <div className="space-y-8">
          {SECTIONS.map(section => (
            <div key={section.title}>
              <h2 className="mb-2 text-[15px] font-semibold text-white">{section.title}</h2>
              <p className="text-[13px] leading-relaxed text-[#888888]">{section.content}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-4 py-6 text-center text-[12px] text-[#444444]">
        © 2025 MultiClip Hub ·{' '}
        <Link href="/privacy" className="hover:text-[#888888] transition-colors">
          Política de Privacidade
        </Link>
      </footer>
    </div>
  )
}
