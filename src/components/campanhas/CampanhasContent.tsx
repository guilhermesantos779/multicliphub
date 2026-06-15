'use client'
import { useState, useEffect, useRef } from 'react'
import {
  Zap, Trophy, BarChart3, Lock, CheckCircle2, Users,
  type LucideIcon,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────
type TabId = 'streamer' | 'clipper'
type BenefitType = 'streamer' | 'clipper' | 'both'

interface Benefit {
  icon: LucideIcon
  title: string
  desc: string
  type: BenefitType
  color: string
}

// ─── Data ────────────────────────────────────────────────────
const BENEFITS: Benefit[] = [
  {
    icon: BarChart3,
    title: 'Alcance real, sem bot',
    desc: 'Views verificados via API oficial das plataformas. Você paga só por alcance orgânico genuíno.',
    type: 'streamer',
    color: '#9146FF',
  },
  {
    icon: Zap,
    title: '3× mais alcance, mesmo esforço',
    desc: 'Um clipe publicado no TikTok, Instagram e YouTube conta views das três. O Magic Upload já faz isso.',
    type: 'clipper',
    color: '#00E5A0',
  },
  {
    icon: Trophy,
    title: 'Ranking dentro da campanha',
    desc: 'Clipadores com mais views na campanha ganham bônus em dinheiro além do CPM padrão.',
    type: 'both',
    color: '#FFD700',
  },
  {
    icon: Users,
    title: 'Crescimento composto',
    desc: 'Quanto mais clipadores entram, mais o conteúdo se espalha. O algoritmo favorece volume.',
    type: 'streamer',
    color: '#9146FF',
  },
  {
    icon: Lock,
    title: 'Pro e King ganham mais',
    desc: 'Assinantes Pro e King têm acesso antecipado às campanhas com maior orçamento e CPM maior.',
    type: 'clipper',
    color: '#00E5A0',
  },
  {
    icon: CheckCircle2,
    title: 'Pagamento garantido',
    desc: 'O budget fica reservado no início. Quando os views chegam, o pagamento sai automaticamente.',
    type: 'both',
    color: '#FFD700',
  },
]

const STREAMER_STEPS = [
  {
    n: '1',
    title: 'Crie sua campanha',
    desc: 'Defina orçamento, CPM, período e regras. Você escolhe quais plataformas contam.',
  },
  {
    n: '2',
    title: 'Defina as regras',
    desc: 'Mínimo de segundos do clipe, hashtags exigidas e se precisa de aprovação prévia.',
  },
  {
    n: '3',
    title: 'Monitore em tempo real',
    desc: 'Dashboard com clipes publicados, views por plataforma e projeção de gasto.',
  },
  {
    n: '4',
    title: 'Pague pelo resultado',
    desc: 'Budget excedente é devolvido ao encerrar. Você só paga pelo que foi entregue.',
  },
]

const CLIPPER_STEPS = [
  {
    n: '1',
    title: 'Escolha uma campanha',
    desc: 'Veja campanhas ativas, o CPM oferecido, o streamer e quanto do budget ainda está disponível.',
  },
  {
    n: '2',
    title: 'Clipe e publique',
    desc: 'Use o Magic Upload normalmente. Selecione a campanha e seus clipes entram automaticamente.',
  },
  {
    n: '3',
    title: 'Views são rastreados',
    desc: 'TikTok + Instagram + YouTube somados. Acompanhe seus ganhos acumulados em tempo real.',
  },
  {
    n: '4',
    title: 'Receba via Stripe',
    desc: 'Ao atingir o mínimo de saque (R$50), o pagamento é processado para sua conta bancária.',
  },
]

// ─── Sub-components ───────────────────────────────────────────

function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1
      bg-mint/10 border border-mint/20 rounded-full
      text-[11px] font-bold text-mint tracking-widest uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-mint
        animate-pulse" />
      Em breve
    </span>
  )
}

function FlowDiagram() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-0">

      {/* Streamer side */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-purple
            shadow-[0_0_8px_#9146FF]" />
          <span className="text-[11px] font-bold tracking-widest
            uppercase text-purple">
            Streamer
          </span>
        </div>
        {[
          { icon: '🎮', title: 'Cria a campanha', desc: 'Define orçamento, regras e período.', tag: 'Define o budget', tagColor: 'text-purple bg-purple/10' },
          { icon: '📊', title: 'Monitora em tempo real', desc: 'Views e clipes por plataforma.', tag: 'Dashboard', tagColor: 'text-purple bg-purple/10' },
          { icon: '💸', title: 'Paga pelo resultado', desc: 'Só paga por views verificados.', tag: 'CPM garantido', tagColor: 'text-gold bg-gold/10' },
        ].map((card, i) => (
          <FlowCard key={i} {...card} />
        ))}
      </div>

      {/* Center connector */}
      <div className="hidden md:flex flex-col items-center
        justify-center px-6 pt-16">
        <div className="w-px h-16 bg-gradient-to-b from-transparent
          via-purple to-mint" />
        <div className="w-12 h-12 rounded-full
          bg-gradient-to-br from-mint-bright to-purple
          flex items-center justify-center text-xl
          shadow-[0_0_24px_rgba(0,229,160,0.3)] my-2
          flex-shrink-0">
          ⚡
        </div>
        <div className="text-[10px] text-white/40 font-bold
          tracking-widest text-center mt-1">
          MAGIC<br/>UPLOAD
        </div>
        <div className="w-px h-16 bg-gradient-to-b from-mint
          via-purple to-transparent" />
      </div>

      {/* Clipper side */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-mint
            shadow-[0_0_8px_#00E5A0]" />
          <span className="text-[11px] font-bold tracking-widest
            uppercase text-mint">
            Clipador
          </span>
        </div>
        {[
          { icon: '🎬', title: 'Entra na campanha', desc: 'Escolhe streamers que curte.', tag: 'Escolhe', tagColor: 'text-mint bg-mint/10' },
          { icon: '🚀', title: 'Publica com 1 upload', desc: 'TikTok + Instagram + YouTube juntos.', tag: 'Magic Upload', tagColor: 'text-mint bg-mint/10' },
          { icon: '💰', title: 'Ganha por view', desc: 'Views das 3 plataformas somados.', tag: 'Pago via Stripe', tagColor: 'text-gold bg-gold/10' },
        ].map((card, i) => (
          <FlowCard key={i} {...card} />
        ))}
      </div>
    </div>
  )
}

function FlowCard({
  icon, title, desc, tag, tagColor
}: {
  icon: string; title: string; desc: string
  tag: string; tagColor: string
}) {
  return (
    <div className="group p-4 rounded-xl
      bg-white/[0.03] border border-white/[0.07]
      hover:border-white/[0.12] hover:-translate-y-0.5
      transition-all duration-200 cursor-default
      hover:shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm font-bold text-white mb-1">{title}</div>
      <div className="text-xs text-white/40 leading-relaxed mb-2">
        {desc}
      </div>
      <span className={`inline-flex text-[10px] font-bold px-2 py-0.5
        rounded-full ${tagColor}`}>
        {tag}
      </span>
    </div>
  )
}

function BenefitCard({ icon: Icon, title, desc, type, color }: Benefit) {
  const bgMap: Record<BenefitType, string> = {
    streamer: 'bg-purple/[0.07]',
    clipper:  'bg-mint/[0.07]',
    both:     'bg-gold/[0.07]',
  }
  const borderMap: Record<BenefitType, string> = {
    streamer: 'border-purple/20',
    clipper:  'border-mint/15',
    both:     'border-gold/20',
  }
  return (
    <div className={`p-5 rounded-xl border ${bgMap[type]} ${borderMap[type]}
      hover:-translate-y-1 transition-transform duration-200`}>
      <div className="w-10 h-10 rounded-xl flex items-center
        justify-center mb-4"
        style={{ background: `${color}18` }}>
        <Icon size={20} color={color} />
      </div>
      <div className="text-sm font-bold text-white mb-1.5">{title}</div>
      <div className="text-xs text-white/40 leading-relaxed">{desc}</div>
    </div>
  )
}

function StepItem({
  n, title, desc, color
}: {
  n: string; title: string; desc: string; color: string
}) {
  return (
    <div className="flex gap-4 p-4 rounded-xl
      bg-white/[0.03] border border-white/[0.06]">
      <div className="w-8 h-8 rounded-lg flex items-center
        justify-center text-sm font-black flex-shrink-0"
        style={{ background: `${color}18`, color }}>
        {n}
      </div>
      <div>
        <div className="text-sm font-bold text-white mb-1">{title}</div>
        <div className="text-xs text-white/40 leading-relaxed">{desc}</div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────
export function CampanhasContent() {
  const [activeTab, setActiveTab] = useState<TabId>('clipper')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progressRef.current) {
        progressRef.current.style.width = '78%'
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-16">

      {/* ── HERO ── */}
      <section className="text-center pt-4">
        <ComingSoonBadge />

        <h1 className="mt-6 text-3xl md:text-4xl font-black
          tracking-tight leading-[1.1]">
          Sua ferramenta.
          <span className="block bg-gradient-to-r from-mint-bright
            to-mint-dark bg-clip-text text-transparent">
            Sua campanha.
          </span>
          Seu dinheiro.
        </h1>

        <p className="mt-4 text-white/50 text-base max-w-lg
          mx-auto leading-relaxed">
          Streamers lançam campanhas. Clipadores pegam os melhores
          momentos, publicam com o Magic Upload e{' '}
          <span className="text-white font-semibold">
            ganham por cada view gerado.
          </span>
        </p>

        {/* Progress bar */}
        <div className="mt-8 max-w-sm mx-auto">
          <div className="flex justify-between text-xs font-semibold
            text-white/30 mb-2">
            <span>Desenvolvimento</span>
            <span className="text-mint">78% concluído</span>
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full rounded-full transition-all
                duration-[1500ms] ease-out"
              style={{
                width: '0%',
                background:
                  'linear-gradient(90deg, #9146FF, #00E5A0)',
              }}
            />
          </div>
        </div>

        {/* Waitlist */}
        {submitted ? (
          <div className="mt-6 inline-flex items-center gap-2
            px-4 py-2 bg-mint/10 border border-mint/20
            rounded-xl text-sm font-semibold text-mint">
            <CheckCircle2 size={16} />
            Você está na lista! Avisaremos em breve.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex gap-2 max-w-sm mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              required
              className="flex-1 bg-white/[0.05] border
                border-white/[0.08] rounded-xl px-4 py-2.5
                text-sm text-white placeholder:text-white/30
                outline-none focus:border-mint/40 transition"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-sm
                font-bold text-black whitespace-nowrap
                transition hover:opacity-90 active:scale-95"
              style={{
                background:
                  'linear-gradient(135deg, #3CFFB8, #00B584)',
              }}
            >
              Entrar na lista
            </button>
          </form>
        )}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section>
        <p className="text-[11px] font-bold tracking-[4px]
          uppercase text-mint mb-2">
          Mecânica
        </p>
        <h2 className="text-2xl font-black tracking-tight mb-8">
          Como as campanhas vão funcionar
        </h2>
        <FlowDiagram />
      </section>

      {/* ── BENEFITS ── */}
      <section>
        <p className="text-[11px] font-bold tracking-[4px]
          uppercase text-mint mb-2">
          Vantagens
        </p>
        <h2 className="text-2xl font-black tracking-tight mb-6">
          Por que é diferente
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2
          md:grid-cols-3 gap-4">
          {BENEFITS.map((b, i) => (
            <BenefitCard key={i} {...b} />
          ))}
        </div>
      </section>

      {/* ── TABS ── */}
      <section>
        <p className="text-[11px] font-bold tracking-[4px]
          uppercase text-mint mb-2">
          Detalhes
        </p>
        <h2 className="text-2xl font-black tracking-tight mb-6">
          Como funciona na prática
        </h2>

        {/* Tab buttons */}
        <div className="flex gap-1 p-1 bg-white/[0.04]
          rounded-xl w-fit mb-6">
          {(['clipper', 'streamer'] as TabId[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm
                font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab === 'clipper'
                ? 'Para clipadores'
                : 'Para streamers'}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(activeTab === 'clipper'
            ? CLIPPER_STEPS
            : STREAMER_STEPS
          ).map((step, i) => (
            <StepItem
              key={i}
              {...step}
              color={
                activeTab === 'clipper' ? '#00E5A0' : '#9146FF'
              }
            />
          ))}
        </div>
      </section>

      {/* ── PRIZE PANEL ── */}
      <section>
        <div className="relative rounded-2xl overflow-hidden
          border border-gold/20 p-8 text-center"
          style={{
            background: `
              radial-gradient(ellipse 60% 80% at 50% 0%,
                rgba(255,215,0,0.06), transparent 65%),
              linear-gradient(135deg,
                rgba(145,70,255,0.08),
                rgba(0,229,160,0.05))
            `,
          }}>
          <Trophy
            size={44}
            color="#FFD700"
            className="mx-auto mb-4"
          />
          <h3 className="text-2xl font-black mb-2"
            style={{
              background: 'linear-gradient(90deg,#FFD700,#FFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
            Prêmios em dinheiro todo mês
          </h3>
          <p className="text-white/40 text-sm max-w-md
            mx-auto mb-8 leading-relaxed">
            Além do CPM por view, os clipadores com melhor
            desempenho em cada campanha levam bônus em dinheiro.
          </p>

          <div className="flex justify-center gap-10
            flex-wrap mb-6">
            {[
              { value: 'R$500', label: '1º lugar', color: '#FFD700' },
              { value: 'R$250', label: '2º lugar', color: '#C0C0C0' },
              { value: 'R$100', label: '3º lugar', color: '#CD7F32' },
            ].map((prize, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black"
                  style={{ color: prize.color }}>
                  {prize.value}
                </div>
                <div className="text-xs text-white/40 font-semibold mt-1">
                  {prize.label}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/25">
            Valores estimados. Prêmios reais definidos com base
            no volume de campanhas ativas.
          </p>
        </div>
      </section>

    </div>
  )
}
