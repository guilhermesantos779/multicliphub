import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

export const metadata = {
  title: 'Política de Privacidade — MultiClip Hub',
}

const SECTIONS = [
  {
    title: '1. Dados Coletados',
    content:
      'Coletamos: nome e e-mail (cadastro), senha em hash bcrypt, tokens OAuth das plataformas (armazenados com AES-256), métricas de uso (posts, views, frequência de acesso) e logs de acesso (IP, sessão — retidos por 6 meses).',
  },
  {
    title: '2. Uso dos Dados',
    content:
      'Usamos seus dados exclusivamente para: autenticar sua sessão, publicar conteúdo nas plataformas conectadas em seu nome, exibir métricas no dashboard, enviar notificações transacionais e processar pagamentos. Nunca vendemos ou compartilhamos dados com anunciantes.',
  },
  {
    title: '3. YouTube API Services',
    content:
      'O MultiClip Hub utiliza os YouTube API Services. Ao conectar sua conta, você também está sujeito aos Termos de Serviço do YouTube (youtube.com/t/terms) e à Política de Privacidade do Google (google.com/policies/privacy). Você pode revogar o acesso em: myaccount.google.com/permissions. Scopes solicitados: youtube.upload e youtube (gerenciamento básico para publicação).',
  },
  {
    title: '4. Instagram (Meta) e TikTok',
    content:
      'Os dados de login fornecidos pela Meta e TikTok são usados exclusivamente para autenticação e publicação de conteúdo. Não compartilhamos informações de conta com terceiros além das próprias plataformas para fins de publicação autorizada. Scopes Meta: instagram_basic, instagram_content_publish. Scopes TikTok: user.info.basic, video.upload, video.publish.',
  },
  {
    title: '5. Seus Direitos (LGPD)',
    content:
      'Você tem direito a: acessar seus dados, corrigi-los, solicitar exclusão ("direito ao esquecimento"), portabilidade e revogar consentimento. Para exercer esses direitos: privacidademulticliphub@gmail.com · Prazo de resposta: até 15 dias úteis.',
  },
  {
    title: '6. Retenção de Dados',
    content:
      'Dados de conta ativa: mantidos enquanto a conta existir. Logs de publicação: 12 meses. Tokens OAuth: até revogação. Dados de pagamento: 5 anos (obrigação fiscal). Após exclusão da conta: todos os dados pessoais são removidos em até 30 dias.',
  },
  {
    title: '7. Contato',
    content:
      'E-mail de privacidade: privacidademulticliphub@gmail.com · Suporte: suportemulticliphub@gmail.com',
  },
]

export default function PrivacyPage() {
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
          <h1 className="text-[28px] font-bold text-white">Política de Privacidade</h1>
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
        <Link href="/terms" className="hover:text-[#888888] transition-colors">
          Termos de Uso
        </Link>
      </footer>
    </div>
  )
}
