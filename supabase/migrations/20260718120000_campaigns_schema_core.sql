-- Campaigns feature: core schema (agencies, campaigns, participation, moderation, payouts).
-- Agent 1/4 scope: schema + core API only. Frontend, Asaas integration wiring and
-- clipper-facing pages are owned by other agents working in parallel branches.

-- ============================================================================
-- agency_profiles
-- ============================================================================
create table public.agency_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('agencia', 'influencer')),
  display_name text not null,
  logo_url text,
  bio text,
  website_url text,
  social_links jsonb not null default '{}'::jsonb,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index agency_profiles_user_id_idx on public.agency_profiles(user_id);

alter table public.agency_profiles enable row level security;

create policy "agency_profiles_select_public"
  on public.agency_profiles for select
  using (true);

create policy "agency_profiles_insert_own"
  on public.agency_profiles for insert
  with check (auth.uid() = user_id);

create policy "agency_profiles_update_owner"
  on public.agency_profiles for update
  using (auth.uid() = user_id);

-- ============================================================================
-- agency_team_members
-- ============================================================================
create table public.agency_team_members (
  id uuid primary key default gen_random_uuid(),
  agency_profile_id uuid not null references public.agency_profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin')),
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  unique (agency_profile_id, user_id)
);

-- At most one 'admin' per agency (the single moderator described in the product spec).
create unique index agency_team_members_one_admin_per_agency
  on public.agency_team_members (agency_profile_id)
  where role = 'admin';

create index agency_team_members_user_id_idx on public.agency_team_members(user_id);

alter table public.agency_team_members enable row level security;

-- Helper: is uid an owner/admin of this agency (either the profile creator or a team row)?
create or replace function public.is_agency_staff(uid uuid, target_agency_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.agency_profiles ap
    where ap.id = target_agency_id
      and (
        ap.user_id = uid
        or exists (
          select 1 from public.agency_team_members atm
          where atm.agency_profile_id = ap.id
            and atm.user_id = uid
            and atm.role in ('owner', 'admin')
        )
      )
  );
$$;

create policy "agency_team_members_select"
  on public.agency_team_members for select
  using (user_id = auth.uid() or public.is_agency_staff(auth.uid(), agency_profile_id));

create policy "agency_team_members_insert"
  on public.agency_team_members for insert
  with check (public.is_agency_staff(auth.uid(), agency_profile_id));

create policy "agency_team_members_update"
  on public.agency_team_members for update
  using (user_id = auth.uid() or public.is_agency_staff(auth.uid(), agency_profile_id));

create policy "agency_team_members_delete"
  on public.agency_team_members for delete
  using (public.is_agency_staff(auth.uid(), agency_profile_id));

-- ============================================================================
-- campaigns
-- ============================================================================
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  agency_profile_id uuid not null references public.agency_profiles(id) on delete cascade,
  title text not null,
  description text,
  rules text,
  required_hashtag text not null,
  category text not null default 'geral' check (category in (
    'geral', 'musica', 'games', 'entretenimento', 'esportes', 'educacao', 'estilo_de_vida', 'tecnologia'
  )),
  content_type text not null default 'clipping' check (content_type in ('clipping', 'ugc')),
  modality text not null check (modality in ('cpm', 'leaderboard')),
  cpm_rate numeric,
  budget_total numeric,
  budget_spent numeric not null default 0,
  prize_structure jsonb,
  ranking_metric text not null default 'views',
  cover_image_url text,
  badge_label text not null default 'Campanha',
  duration_days integer not null check (duration_days in (7, 20, 30)),
  starts_at timestamptz,
  ends_at timestamptz,
  platform_fee_percentage numeric not null default 10,
  total_charged numeric,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  asaas_charge_id text,
  pix_qr_code text,
  pix_copy_paste text,
  status text not null default 'draft' check (status in (
    'draft', 'aguardando_pagamento', 'active', 'paused', 'completed', 'cancelled'
  )),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint campaigns_modality_required_fields check (
    (modality = 'cpm' and cpm_rate is not null and budget_total is not null)
    or
    (modality = 'leaderboard' and prize_structure is not null)
  )
);

create index campaigns_agency_profile_id_idx on public.campaigns(agency_profile_id);
create index campaigns_status_idx on public.campaigns(status);

-- Helper: is uid an owner/admin of the agency that owns this campaign?
create or replace function public.is_campaign_agency_staff(uid uuid, target_campaign_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select public.is_agency_staff(uid, c.agency_profile_id)
  from public.campaigns c
  where c.id = target_campaign_id;
$$;

alter table public.campaigns enable row level security;

create policy "campaigns_select_active_or_staff"
  on public.campaigns for select
  using (status = 'active' or public.is_campaign_agency_staff(auth.uid(), id));

create policy "campaigns_insert_agency_staff"
  on public.campaigns for insert
  with check (public.is_agency_staff(auth.uid(), agency_profile_id));

create policy "campaigns_update_agency_staff"
  on public.campaigns for update
  using (public.is_campaign_agency_staff(auth.uid(), id));

-- ============================================================================
-- campaign_assets
-- ============================================================================
create table public.campaign_assets (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  type text not null check (type in ('link', 'imagem', 'video', 'documento')),
  label text,
  url text not null,
  created_at timestamptz not null default now()
);

create index campaign_assets_campaign_id_idx on public.campaign_assets(campaign_id);

alter table public.campaign_assets enable row level security;

create policy "campaign_assets_select"
  on public.campaign_assets for select
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_assets.campaign_id
        and (c.status = 'active' or public.is_campaign_agency_staff(auth.uid(), c.id))
    )
  );

create policy "campaign_assets_write"
  on public.campaign_assets for all
  using (public.is_campaign_agency_staff(auth.uid(), campaign_id))
  with check (public.is_campaign_agency_staff(auth.uid(), campaign_id));

-- ============================================================================
-- campaign_participants
-- ============================================================================
create table public.campaign_participants (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  status text not null default 'active',
  unique (campaign_id, user_id)
);

create index campaign_participants_campaign_id_idx on public.campaign_participants(campaign_id);
create index campaign_participants_user_id_idx on public.campaign_participants(user_id);

alter table public.campaign_participants enable row level security;

create policy "campaign_participants_select"
  on public.campaign_participants for select
  using (user_id = auth.uid() or public.is_campaign_agency_staff(auth.uid(), campaign_id));

create policy "campaign_participants_insert_own"
  on public.campaign_participants for insert
  with check (user_id = auth.uid());

create policy "campaign_participants_update"
  on public.campaign_participants for update
  using (user_id = auth.uid() or public.is_campaign_agency_staff(auth.uid(), campaign_id));

-- ============================================================================
-- campaign_posts
-- ============================================================================
create table public.campaign_posts (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in ('tiktok', 'instagram', 'youtube')),
  external_post_id text not null,
  caption_snapshot text,
  views_count bigint not null default 0,
  discovered_via text not null default 'hashtag',
  review_status text not null default 'active' check (review_status in ('active', 'removed')),
  removed_by uuid references auth.users(id),
  removed_at timestamptz,
  removal_reason text,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  unique (campaign_id, platform, external_post_id)
);

create index campaign_posts_campaign_id_idx on public.campaign_posts(campaign_id);
create index campaign_posts_user_id_idx on public.campaign_posts(user_id);

alter table public.campaign_posts enable row level security;

create policy "campaign_posts_select"
  on public.campaign_posts for select
  using (user_id = auth.uid() or public.is_campaign_agency_staff(auth.uid(), campaign_id));

-- No INSERT policy for authenticated users: posts are discovered automatically via
-- hashtag sync (a service-role job), not created by clippers directly (no manual link).
create policy "campaign_posts_update_agency_staff"
  on public.campaign_posts for update
  using (public.is_campaign_agency_staff(auth.uid(), campaign_id));

-- ============================================================================
-- campaign_payouts
-- ============================================================================
create table public.campaign_payouts (
  id uuid primary key default gen_random_uuid(),
  campaign_post_id uuid references public.campaign_posts(id) on delete set null,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null,
  asaas_transfer_id text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

create index campaign_payouts_campaign_id_idx on public.campaign_payouts(campaign_id);
create index campaign_payouts_user_id_idx on public.campaign_payouts(user_id);

alter table public.campaign_payouts enable row level security;

create policy "campaign_payouts_select"
  on public.campaign_payouts for select
  using (user_id = auth.uid() or public.is_campaign_agency_staff(auth.uid(), campaign_id));

-- No write policies for authenticated users: payouts are created/settled by the
-- Asaas split-payment job (service role), owned by another agent's scope.

-- ============================================================================
-- campaign_leaderboard view
-- ============================================================================
-- Intentionally NOT security_invoker: this view exposes only aggregated, non-sensitive
-- ranking data (no caption/url/external_post_id) and hard-codes its own visibility rule
-- (campaign must be active/paused/completed) so it can be read by the public and by all
-- campaign participants, while the underlying campaign_posts rows stay locked down to
-- "own row or agency staff" via campaign_posts_select above.
create view public.campaign_leaderboard as
select
  cp.campaign_id,
  cp.user_id,
  count(*)::int as total_posts,
  sum(cp.views_count)::bigint as total_views,
  rank() over (partition by cp.campaign_id order by sum(cp.views_count) desc) as position
from public.campaign_posts cp
join public.campaigns c on c.id = cp.campaign_id
where cp.review_status = 'active'
  and c.status in ('active', 'paused', 'completed')
group by cp.campaign_id, cp.user_id;

-- ============================================================================
-- profiles: payout fields
-- ============================================================================
alter table public.profiles
  add column asaas_wallet_id text,
  add column pix_key text,
  add column cpf text,
  add column payout_status text not null default 'not_configured';
