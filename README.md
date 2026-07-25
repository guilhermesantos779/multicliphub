# MultiClipHub

Plataforma SaaS para clipadores profissionais. Um upload distribui simultaneamente
para TikTok, Instagram Reels e YouTube Shorts, com ranking gamificado e prêmios mensais.

- **Site:** https://www.multicliphub.com.br
- **Stack:** Next.js 16 (App Router) · TypeScript · Supabase (`@supabase/ssr`) · Stripe · Tailwind v4 · Vercel
- **Bot do Discord:** repositório separado (deploy no Railway)

---

## Pré-requisitos

- Node.js 20+
- npm 10+
- Projeto no Supabase (banco + auth + storage)
- Conta no Stripe (pagamentos)

---

## Setup local

```bash
npm install
npm run dev          # http://localhost:3000
```

### Variáveis de ambiente

Crie um `.env.local` na raiz do projeto. `.env*` está no `.gitignore`, então este
arquivo nunca é commitado.

**Obrigatórias:**

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave publishable do Supabase (fallback: `NEXT_PUBLIC_SUPABASE_ANON_KEY`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **apenas server** (rotas/admin) |
| `NEXT_PUBLIC_APP_URL` | URL base do app (ex.: `http://localhost:3000` em dev) |
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret do webhook Stripe |
| `STRIPE_PRICE_CLIPPER_MONTHLY` / `_ANNUAL` | Price IDs do plano Clipper |
| `STRIPE_PRICE_PRO_MONTHLY` / `_ANNUAL` | Price IDs do plano Pro |
| `STRIPE_PRICE_KING_MONTHLY` / `_ANNUAL` | Price IDs do plano King |

**Opcionais (integrações — necessárias após aprovação do OAuth):**

| Variável | Descrição |
|---|---|
| `TIKTOK_CLIENT_KEY` / `TIKTOK_CLIENT_SECRET` | Credenciais do app TikTok |
| `TIKTOK_REDIRECT_URI` | `https://www.multicliphub.com.br/api/oauth/tiktok/callback` |
| `INSTAGRAM_CLIENT_ID` / `INSTAGRAM_CLIENT_SECRET` | App do Meta (o secret também valida o webhook do Instagram) |
| `META_WEBHOOK_VERIFY_TOKEN` | Token de verificação do webhook Meta |
| `BOT_WEBHOOK_URL` / `BOT_WEBHOOK_SECRET` | Notificações para o bot do Discord (no-op se ausentes) |
| `RESEND_API_KEY` | Envio de e-mails transacionais (Resend) |

### Testes

```bash
npm run test:run        # roda uma vez
npm run test            # modo watch
npm run test:coverage   # com cobertura
```

Há também CI em `.github/workflows/ci.yml` (install + lint + testes) em push/PR
para `develop` e `main`.

---

## Estrutura

```
src/
├── app/
│   ├── api/                # Route handlers (stripe, webhooks, oauth, username…)
│   ├── (dashboard)/        # Páginas autenticadas (dashboard, upload, ranking, canais…)
│   ├── (auth)/             # login, register
│   ├── (public)/           # landing, termos, privacidade
│   └── (profile)/          # perfil público (/perfil/[username])
├── components/
│   ├── ui/brand/           # Design system (Typography, Card, Badge, Glass, Skeleton…)
│   ├── ui/                 # Primitivos shadcn/base-ui
│   ├── dashboard/          # Sidebar, Topbar, MetricCard
│   ├── landing/            # Seções da landing (Hero, Features, Pricing…)
│   ├── profile/            # Perfil público + ProfileFrame (molduras por tier)
│   ├── upload/             # Fluxo de upload/publicação
│   └── campanhas/          # Página Campanhas ("Em breve")
├── lib/
│   ├── schemas/            # Validação Zod + parseBody (inputs de API)
│   ├── metrics/source.ts   # Abstração de métricas (ACTIVE_METRIC_SOURCE)
│   ├── stripe/             # Cliente Stripe + PLANS (preços)
│   ├── supabase/           # Clients server/browser (@supabase/ssr)
│   └── design-tokens.ts    # Tokens de design (espelham o @theme do globals.css)
├── hooks/                  # Custom hooks
├── proxy.ts                # Middleware de auth (Next 16 renomeou middleware → proxy)
└── types/                  # Tipos globais (database.types.ts gerado do Supabase)
```

---

## Deploy

- **App (Vercel):** o app usa a branch `develop`. **Produção é promoção MANUAL** no
  dashboard da Vercel — um push para `develop` NÃO sobe produção sozinho.
- **Bot (Railway):** repositório separado.

---

## Decisões técnicas importantes

### Abstração de métricas
`src/lib/metrics/source.ts` expõe `ACTIVE_METRIC_SOURCE`, que alterna entre
`'posts'` (atual) e `'views'` (após o OAuth ir ao ar). Para trocar a fonte de
dados, mude essa constante — não os componentes.

### Tokens OAuth (pendente)
⚠️ A criptografia AES-256-GCM dos tokens **ainda não está implementada** (não
existe `src/lib/crypto.ts`). Os endpoints OAuth (ex.: `/api/oauth/tiktok`)
fazem o fluxo, mas **não persistem tokens** até a criptografia existir — gravar
token em texto puro é justamente o risco apontado na auditoria. Antes de ligar
o OAuth em produção: implementar `encrypt()/decrypt()` e uma `ENCRYPTION_KEY`
(64 hex chars, `openssl rand -hex 32`).

### Planos
`src/lib/stripe/index.ts` (`PLANS`) e `src/config/plans.ts` são a fonte de
verdade de planos/preços. Não hardcode valores de plano fora desses arquivos.

### Webhooks
- Stripe (`/api/webhook/stripe`): valida assinatura (400 em assinatura inválida,
  500 em falha de handler para o Stripe reenviar).
- Meta/Instagram (`/api/webhooks/instagram`): exige `INSTAGRAM_CLIENT_SECRET` e
  assinatura `x-hub-signature-256` válida.

---

## Contatos

- Suporte: suporte@multicliphub.com.br
- Privacidade: privacidade@multicliphub.com.br
