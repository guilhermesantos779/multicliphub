-- Infraestrutura de aceite de Termos de Serviço, versionada por tipo de conta,
-- e o registro de quem aceitou o quê. O texto em `conteudo` abaixo é
-- PROVISÓRIO — rascunho estrutural aguardando revisão de um advogado antes de
-- qualquer uso real com usuários pagantes / campanhas com dinheiro real.
-- Trocar o texto no futuro é só inserir uma nova linha em `terms_versions`
-- com `vigente_a_partir` mais recente — nenhuma mudança de código necessária.

create table public.terms_versions (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('clipador', 'agencia')),
  versao text not null,
  conteudo text not null,
  vigente_a_partir timestamptz not null default now(),
  criado_em timestamptz not null default now()
);

create index terms_versions_tipo_vigencia_idx on public.terms_versions (tipo, vigente_a_partir desc);

create table public.user_terms_acceptance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  terms_version_id uuid not null references public.terms_versions(id) on delete cascade,
  aceito_em timestamptz not null default now(),
  unique (user_id, terms_version_id)
);

alter table public.terms_versions enable row level security;
alter table public.user_terms_acceptance enable row level security;

-- Termos são consulta pública — a página /termos funciona sem login.
create policy terms_versions_select_public
  on public.terms_versions for select
  to anon, authenticated
  using (true);

create policy terms_versions_admin_write
  on public.terms_versions for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

create policy user_terms_acceptance_select_own
  on public.user_terms_acceptance for select
  to authenticated
  using (user_id = auth.uid() or is_admin(auth.uid()));

create policy user_terms_acceptance_insert_own
  on public.user_terms_acceptance for insert
  to authenticated
  with check (user_id = auth.uid());

insert into public.terms_versions (tipo, versao, conteudo) values
(
  'clipador',
  '2026-08-27-placeholder',
  E'⚠️ TEXTO PROVISÓRIO — rascunho estrutural aguardando revisão de advogado. Não usar com usuários reais/pagantes antes da revisão jurídica.\n\n## 1. Aceitação dos termos\nAo criar uma conta e usar o MultiClip Hub como clipador, você concorda com estes Termos de Uso. Se não concordar com algum ponto, não utilize a plataforma.\n\n## 2. Descrição do serviço\nO MultiClip Hub é uma plataforma de distribuição de conteúdo de vídeo curto que permite publicar simultaneamente no TikTok, Instagram e YouTube a partir de um único upload, participar de campanhas de agências, e acompanhar ranking e ganhos.\n\n## 3. Elegibilidade\nVocê deve ter pelo menos 18 anos de idade. Suas contas conectadas (TikTok, Instagram, YouTube) devem cumprir os termos de uso de cada plataforma.\n\n## 4. Uso aceitável\nVocê concorda em publicar apenas conteúdo que criou ou tem direito de distribuir, seguindo as regras de cada campanha da qual participa. É proibido spam, automação abusiva, ou conteúdo que viole leis brasileiras.\n\n## 5. Conteúdo e propriedade intelectual\nVocê mantém todos os direitos sobre o conteúdo que publica. Ao usar a plataforma, você concede ao MultiClip Hub uma licença limitada e revogável para processar e distribuir esse conteúdo.\n\n## 6. Campanhas e pagamentos\nAo participar de uma campanha, você concorda com as regras específicas dela definidas pela agência responsável. Pagamentos de campanhas (CPM ou Leaderboard) são processados conforme a modalidade da campanha, sujeitos à revisão final da agência antes da liberação.\n\n## 7. Limitação de responsabilidade\nO MultiClip Hub não se responsabiliza por remoção de conteúdo pelas plataformas de destino, indisponibilidade de APIs de terceiros, nem por decisões de agências sobre suas próprias campanhas.\n\n## 8. Cancelamento de conta\nVocê pode cancelar sua conta a qualquer momento nas configurações.\n\n## 9. Alterações nos termos\nPodemos atualizar estes termos periodicamente. O acesso continuado após uma nova versão entrar em vigor exige novo aceite explícito.\n\n## 10. Lei aplicável\nEstes termos são regidos pelas leis brasileiras.'
),
(
  'agencia',
  '2026-08-27-placeholder',
  E'⚠️ TEXTO PROVISÓRIO — rascunho estrutural aguardando revisão de advogado. Não usar com usuários reais/pagantes antes da revisão jurídica.\n\n## 1. Aceitação dos termos\nAo criar uma conta de agência e usar o MultiClip Hub para criar e gerenciar campanhas, você concorda com estes Termos de Uso. Se não concordar com algum ponto, não utilize a plataforma.\n\n## 2. Descrição do serviço\nO MultiClip Hub permite que agências (times de clipadores ou marcas/streamers) criem campanhas de distribuição de conteúdo, gerenciem um roster de clipadores, acompanhem ranking e participantes, e processem pagamentos aos clipadores participantes.\n\n## 3. Elegibilidade\nVocê deve ter capacidade legal para representar a agência/empresa cadastrada. Informações de identificação e pagamento devem ser verdadeiras e atualizadas.\n\n## 4. Criação e gestão de campanhas\nA agência é responsável pelo conteúdo, regras e valores de cada campanha que cria. Campanhas com visibilidade "fechada pro time" só ficam disponíveis para membros ativos do roster da própria agência. A agência é responsável por revisar e confirmar os resultados finais antes da liberação de pagamentos.\n\n## 5. Pagamentos e taxas\nCampanhas são cobradas da agência conforme a modalidade (CPM ou Leaderboard) escolhida, acrescidas da taxa de plataforma vigente. Pagamentos aos clipadores participantes são processados via Pix após a confirmação de revisão final pela agência.\n\n## 6. Roster e convites\nA agência (quando do tipo "clipadores") pode convidar clipadores para seu roster via link de convite. A entrada e remoção de membros do roster é uma ação independente da participação em campanhas específicas.\n\n## 7. Limitação de responsabilidade\nO MultiClip Hub não se responsabiliza pela conduta de clipadores participantes, por decisões de conteúdo da agência, ou por indisponibilidade de APIs de terceiros usadas na plataforma.\n\n## 8. Cancelamento de conta\nA agência pode cancelar sua conta a qualquer momento, respeitando campanhas e pagamentos em andamento.\n\n## 9. Alterações nos termos\nPodemos atualizar estes termos periodicamente. O acesso continuado após uma nova versão entrar em vigor exige novo aceite explícito.\n\n## 10. Lei aplicável\nEstes termos são regidos pelas leis brasileiras.'
);
