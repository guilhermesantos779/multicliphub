import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade — MultiClip Hub',
  description: 'Como o MultiClip Hub coleta, usa e protege seus dados.',
}

const PRIVACY_EMAIL = 'privacidademulticliphub@gmail.com'

export default function PrivacidadePage() {
  const lastUpdated = '13 de junho de 2026'

  return (
    <main className="min-h-screen bg-[#0B0F19]">
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <Link href="/landing" className="mb-6 inline-block text-sm text-white/40 transition-colors hover:text-white">
            ← Voltar ao site
          </Link>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#00E5A0]">
            MultiClip Hub
          </p>
          <h1 className="mb-4 text-3xl font-black text-white md:text-4xl">
            Política de Privacidade
          </h1>
          <p className="text-sm text-white/40">Última atualização: {lastUpdated}</p>
        </div>

        {/* Content — explicit child styling (no typography plugin in this project) */}
        <div className="[&_a]:text-[#00E5A0] [&_a:hover]:underline [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:text-[#00E5A0] [&_li]:text-[14px] [&_li]:leading-relaxed [&_li]:text-white/60 [&_p]:text-[14px] [&_p]:leading-relaxed [&_p]:text-white/60 [&_strong]:text-white/80 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          <Section title="1. Quem somos">
            <p>
              O MultiClip Hub (<strong>multicliphub.com.br</strong>) é uma plataforma SaaS que
              permite a criadores de conteúdo distribuir vídeos curtos simultaneamente para TikTok,
              Instagram e YouTube. Responsável pelo tratamento de dados:
            </p>
            <p>
              <strong>MultiClip Hub</strong>
              <br />
              E-mail de privacidade: <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>
              <br />
              Suporte: <a href="/suporte">multicliphub.com.br/suporte</a>
            </p>
          </Section>

          <Section title="2. Dados que coletamos">
            <p>Coletamos os seguintes tipos de dados:</p>
            <ul>
              <li>
                <strong>Dados de cadastro:</strong> nome, endereço de e-mail, nome de usuário
                (nickname) escolhido na plataforma.
              </li>
              <li>
                <strong>Dados de perfil das plataformas conectadas:</strong> nome de usuário, foto de
                perfil e identificador único do TikTok, Instagram e/ou YouTube, obtidos via OAuth com
                consentimento explícito do usuário.
              </li>
              <li>
                <strong>Tokens de acesso OAuth:</strong> armazenados de forma criptografada
                (AES-256-GCM) no banco de dados. Nunca são armazenados em texto puro.
              </li>
              <li>
                <strong>Dados de publicação:</strong> títulos, descrições e metadados dos vídeos
                publicados via plataforma, incluindo estatísticas de visualizações quando disponíveis
                via API.
              </li>
              <li>
                <strong>Dados técnicos:</strong> endereço IP, tipo de navegador, sistema operacional,
                páginas acessadas e timestamps de acesso, coletados automaticamente para fins de
                segurança e melhoria do serviço.
              </li>
              <li>
                <strong>Dados de pagamento:</strong> processados exclusivamente pelo Stripe. O
                MultiClip Hub não armazena dados de cartão de crédito.
              </li>
            </ul>
          </Section>

          <Section title="3. Como usamos os dados">
            <ul>
              <li>Autenticar o usuário e manter a sessão ativa na plataforma.</li>
              <li>
                Publicar conteúdo nas plataformas conectadas, exclusivamente mediante ação explícita
                do usuário (nunca de forma automática sem solicitação).
              </li>
              <li>Exibir estatísticas de visualizações e ranking no perfil do usuário.</li>
              <li>Processar pagamentos de assinatura via Stripe.</li>
              <li>
                Enviar comunicações transacionais (confirmação de publicação, notificações de
                conquistas, suporte).
              </li>
              <li>Melhorar a plataforma com base em dados agregados e anônimos de uso.</li>
            </ul>
            <p>
              <strong>
                Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins
                publicitários.
              </strong>
            </p>
          </Section>

          <Section title="4. Plataformas de terceiros (OAuth)">
            <p>
              Quando você conecta o TikTok, Instagram ou YouTube ao MultiClip Hub, você autoriza
              explicitamente que a plataforma acesse determinados dados da sua conta nessas redes. Os
              dados acessados são limitados aos escopos autorizados:
            </p>
            <ul>
              <li>
                <strong>TikTok:</strong> informações básicas do perfil (<code>user.info.basic</code>)
                e publicação de vídeos (<code>video.upload</code>).
              </li>
              <li>
                <strong>Instagram:</strong> informações básicas do perfil
                (<code>instagram_business_basic</code>) e publicação de Reels
                (<code>instagram_business_content_publish</code>).
              </li>
              <li>
                <strong>YouTube:</strong> publicação de vídeos (<code>youtube.upload</code>) e leitura
                básica do canal (<code>youtube.readonly</code>).
              </li>
            </ul>
            <p>
              O uso e a transferência de informações recebidas das APIs do Google por este aplicativo
              seguem a{' '}
              <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
                Política de Dados do Usuário dos Serviços de API do Google
              </a>
              , incluindo os requisitos de Uso Limitado. Ao conectar sua conta do YouTube, você também
              está sujeito aos{' '}
              <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">
                Termos de Serviço do YouTube
              </a>{' '}
              e à{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Política de Privacidade do Google
              </a>
              . Você pode revogar o acesso a qualquer momento em{' '}
              <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
                myaccount.google.com/permissions
              </a>
              .
            </p>
            <p>
              Os tokens de acesso são armazenados de forma criptografada e podem ser revogados a
              qualquer momento nas configurações da plataforma ou diretamente nas configurações de cada
              rede social.
            </p>
          </Section>

          <Section title="5. Retenção e exclusão de dados" id="exclusao-de-dados">
            <p>
              Mantemos seus dados enquanto sua conta estiver ativa. Você pode solicitar a exclusão dos
              seus dados a qualquer momento:
            </p>
            <ul>
              <li>
                <strong>Via plataforma:</strong> acesse Configurações → Conta → Excluir conta.
              </li>
              <li>
                <strong>Via e-mail:</strong>{' '}
                <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>
              </li>
              <li>
                <strong>Via formulário:</strong> <a href="/suporte">multicliphub.com.br/suporte</a>
              </li>
            </ul>
            <p>
              Após a solicitação, excluímos todos os dados pessoais em até <strong>30 dias</strong>,
              exceto dados que devemos manter por obrigação legal (ex.: registros fiscais de
              pagamentos).
            </p>
          </Section>

          <Section title="6. Seus direitos (LGPD)">
            <p>
              De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
            </p>
            <ul>
              <li>Confirmar a existência de tratamento dos seus dados.</li>
              <li>Acessar seus dados pessoais.</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação dos dados.</li>
              <li>Solicitar a portabilidade dos dados.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
            </ul>
            <p>
              Para exercer qualquer direito, entre em contato pelo e-mail{' '}
              <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>.
            </p>
          </Section>

          <Section title="7. Segurança">
            <p>Adotamos as seguintes medidas de segurança:</p>
            <ul>
              <li>Criptografia em trânsito: HTTPS/TLS em todas as comunicações.</li>
              <li>Criptografia em repouso: tokens OAuth criptografados com AES-256-GCM.</li>
              <li>
                Row Level Security (RLS) no banco de dados: cada usuário acessa apenas seus próprios
                dados.
              </li>
              <li>Autenticação segura via Supabase Auth com tokens JWT.</li>
            </ul>
          </Section>

          <Section title="8. Cookies">
            <p>
              Utilizamos cookies estritamente necessários para manter a sessão autenticada. Não
              utilizamos cookies de rastreamento ou publicidade.
            </p>
          </Section>

          <Section title="9. Alterações nesta política">
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos usuários ativos por e-mail
              sobre alterações significativas. A data da última atualização está sempre indicada no
              topo desta página.
            </p>
          </Section>

          <Section title="10. Contato">
            <p>
              Dúvidas sobre privacidade:{' '}
              <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>
              <br />
              Suporte geral: <a href="/suporte">multicliphub.com.br/suporte</a>
            </p>
          </Section>
        </div>

        {/* Footer nav */}
        <div className="mt-12 flex gap-4 border-t border-white/10 pt-6 text-sm text-white/40">
          <Link href="/termos" className="transition-colors hover:text-white">
            Termos de Uso
          </Link>
          <Link href="/landing" className="transition-colors hover:text-white">
            Início
          </Link>
        </div>
      </div>
    </main>
  )
}

function Section({
  title,
  id,
  children,
}: {
  title: string
  id?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <h2 className="mb-3 border-b border-white/10 pb-2 text-lg font-bold text-white">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
