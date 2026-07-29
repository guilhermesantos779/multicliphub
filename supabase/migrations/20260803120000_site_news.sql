-- "Novidades do site" feed shown on the /inicio home page, managed by admins
-- from /admin/novidades. Reuses the existing is_admin() SECURITY DEFINER
-- helper (already backing the coupons/admin RLS pattern) instead of adding a
-- new admin-check mechanism.

create table public.site_news (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text not null,
  tipo text,
  publicado_em timestamptz not null default now(),
  criado_por uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index site_news_publicado_em_idx on public.site_news (publicado_em desc);

alter table public.site_news enable row level security;

-- Anyone logged in sees items whose publicado_em has already passed — lets an
-- admin schedule a news item ahead of time by backdating/postdating publicado_em.
create policy site_news_select_published
  on public.site_news for select
  to authenticated
  using (publicado_em <= now());

create policy site_news_admin_all
  on public.site_news for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));
