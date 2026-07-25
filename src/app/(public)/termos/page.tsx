import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termos de Uso — MultiClip Hub',
  description: 'Termos e condições de uso do MultiClip Hub.',
}

const CONTACT_EMAIL = 'multicliphubempresa@multicliphub.com.br'

export default function TermosPage() {
  const lastUpdated = '13 de junho de 2026'

  return (
    <main className="min-h-screen bg-[#0B0F19]">
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        <div className="mb-12">
          <Link href="/landing" className="mb-6 inline-block text-sm text-white/40 transition-colors hover:text-white">
            ← Voltar ao site
          </Link>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#00E5A0]">
            MultiClip Hub
          </p>
          <h1 className="mb-4 text-3xl font-black text-white md:text-4xl">Termos de Uso</h1>
          <p className="text-sm text-white/40">Última atualização: {lastUpdated}</p>
        </div>

        <div className="[&_a]:text-[#00E5A0] [&_a:hover]:underline [&_li]:text-[14px] [&_li]:leading-relaxed [&_li]:text-white/60 [&_p]:text-[14px] [&_p]:leading-relaxed [&_p]:text-white/60 [&_strong]:text-white/80 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          <Section title="1. Aceitação dos termos">
            <p>
              Ao criar uma conta e usar o MultiClip Hub, você concorda com estes Termos de Uso. Se não
              concordar com algum ponto, não utilize a plataforma.
            </p>
          </Section>

          <Section title="2. Descrição do serviço">
            <p>
              O MultiClip Hub é uma plataforma de distribuição de conteúdo de vídeo curto que permite
              publicar simultaneamente no TikTok, Instagram e YouTube a partir de um único upload. A
              plataforma oferece recursos de ranking, conquistas e perfil público para criadores de
              conteúdo.
            </p>
          </Section>

          <Section title="3. Elegibilidade">
            <ul>
              <li>Você deve ter pelo menos 18 anos de idade.</li>
              <li>
                Sua conta no TikTok, Instagram e/ou YouTube deve cumprir os termos de uso de cada
                plataforma.
              </li>
              <li>
                Para usar a integração com Instagram, sua conta deve ser do tipo Business ou Creator
                (contas pessoais não são suportadas pela API do Meta).
              </li>
            </ul>
          </Section>

          <Section title="4. Uso aceitável">
            <p>Você concorda em usar o MultiClip Hub apenas para:</p>
            <ul>
              <li>Publicar conteúdo que você criou e tem direitos de distribuição.</li>
              <li>Conteúdo que cumpre os termos de uso do TikTok, Instagram e YouTube.</li>
              <li>Conteúdo que não viola leis brasileiras ou internacionais.</li>
            </ul>
            <p>É proibido usar a plataforma para:</p>
            <ul>
              <li>Publicar conteúdo de terceiros sem autorização.</li>
              <li>Spam, automação abusiva ou manipulação de algoritmos.</li>
              <li>Conteúdo ilegal, violento, discriminatório ou que viole direitos autorais.</li>
              <li>Tentar contornar limitações das APIs do TikTok, Instagram ou YouTube.</li>
            </ul>
          </Section>

          <Section title="5. Conteúdo e propriedade intelectual">
            <p>
              Você mantém todos os direitos sobre o conteúdo que publica. Ao usar o MultiClip Hub, você
              nos concede uma licença limitada, não-exclusiva e revogável para processar e distribuir
              seu conteúdo exclusivamente para fins de operação do serviço.
            </p>
          </Section>

          <Section title="6. Planos e pagamentos">
            <ul>
              <li>Os planos são cobrados mensalmente ou anualmente conforme a opção escolhida.</li>
              <li>Pagamentos processados via Stripe. Não armazenamos dados de cartão.</li>
              <li>
                Cancelamentos têm efeito no final do período faturado. Não há reembolso proporcional.
              </li>
              <li>Preços podem ser alterados com aviso prévio de 30 dias por e-mail.</li>
            </ul>
          </Section>

          <Section title="7. Integrações com plataformas de terceiros">
            <p>
              O MultiClip Hub integra com TikTok, Instagram e YouTube via OAuth. Ao conectar uma conta:
            </p>
            <ul>
              <li>
                Você autoriza o MultiClip Hub a publicar conteúdo em seu nome, exclusivamente mediante
                sua solicitação.
              </li>
              <li>
                Você pode revogar esse acesso a qualquer momento nas configurações da plataforma ou
                diretamente nas configurações de privacidade de cada rede social.
              </li>
              <li>
                O MultiClip Hub não é responsável por alterações nas APIs ou termos de uso do TikTok,
                Instagram ou YouTube que possam afetar o funcionamento da plataforma.
              </li>
            </ul>
          </Section>

          <Section title="8. Limitação de responsabilidade">
            <p>O MultiClip Hub não se responsabiliza por:</p>
            <ul>
              <li>
                Remoção de conteúdo pelas plataformas de destino (TikTok, Instagram, YouTube) por
                violação de suas próprias políticas.
              </li>
              <li>Indisponibilidade das APIs de terceiros.</li>
              <li>
                Perda de visualizações, seguidores ou receita decorrente de uso da plataforma.
              </li>
            </ul>
          </Section>

          <Section title="9. Cancelamento e exclusão de conta">
            <p>
              Você pode cancelar sua conta a qualquer momento em Configurações → Conta → Excluir conta.
              Após a exclusão, todos os seus dados pessoais serão removidos em até 30 dias, conforme
              nossa <a href="/privacidade">Política de Privacidade</a>.
            </p>
          </Section>

          <Section title="10. Alterações nos termos">
            <p>
              Podemos atualizar estes termos com aviso prévio de 15 dias por e-mail. O uso continuado
              da plataforma após a data de vigência constitui aceitação dos novos termos.
            </p>
          </Section>

          <Section title="11. Lei aplicável">
            <p>
              Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de Suzano,
              São Paulo, para dirimir quaisquer controvérsias.
            </p>
          </Section>

          <Section title="12. Contato">
            <p>
              Dúvidas: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              <br />
              <a href="/suporte">multicliphub.com.br/suporte</a>
            </p>
          </Section>
        </div>

        <div className="mt-12 flex gap-4 border-t border-white/10 pt-6 text-sm text-white/40">
          <Link href="/privacidade" className="transition-colors hover:text-white">
            Política de Privacidade
          </Link>
          <Link href="/landing" className="transition-colors hover:text-white">
            Início
          </Link>
        </div>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 border-b border-white/10 pb-2 text-lg font-bold text-white">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
