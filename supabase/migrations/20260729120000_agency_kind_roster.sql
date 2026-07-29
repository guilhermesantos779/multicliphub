-- Agency "kind" (clipadores vs marca_streamer): roster of linked clippers, invite
-- links, aggregated team metrics, and closed-campaign visibility.
--
-- This is a second, independent axis from agency_profiles.type ('agencia' |
-- 'influencer', which is about org-vs-individual identity and has no real usage
-- yet). `kind` is about business model: does this agency have a fixed team
-- (clipadores) or does it just create campaigns for the open market
-- (marca_streamer)?

-- ============================================================================
-- agency_profiles.kind
-- ============================================================================
alter table public.agency_profiles
  add column kind text not null default 'marca_streamer'
  check (kind in ('clipadores', 'marca_streamer'));

-- ============================================================================
-- agency_clipper_members
-- ============================================================================
-- Roster of individual clippers linked to a 'clipadores'-kind agency. This is
-- NOT the same as agency_team_members (owner/admin of the agency ACCOUNT).
-- A clipper keeps their own independent account; this is only an
-- aggregation/visibility link, opt-in on both sides (invite + accept).
create table public.agency_clipper_members (
  id uuid primary key default gen_random_uuid(),
  agency_profile_id uuid not null references public.agency_profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pendente' check (status in ('pendente', 'ativo', 'removido')),
  invited_at timestamptz not null default now(),
  joined_at timestamptz,
  removed_at timestamptz,
  unique (agency_profile_id, user_id)
);

-- A clipper can only be 'ativo' in one agency-clipadores at a time.
create unique index agency_clipper_members_one_active_per_user
  on public.agency_clipper_members (user_id)
  where status = 'ativo';

create index agency_clipper_members_agency_profile_id_idx
  on public.agency_clipper_members(agency_profile_id);

alter table public.agency_clipper_members enable row level security;

-- Helper: is uid an active clipper member of this agency's roster?
create or replace function public.is_agency_clipper_member(uid uuid, target_agency_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.agency_clipper_members
    where agency_profile_id = target_agency_id
      and user_id = uid
      and status = 'ativo'
  );
$$;

create policy "agency_clipper_members_select"
  on public.agency_clipper_members for select
  using (user_id = auth.uid() or public.is_agency_staff(auth.uid(), agency_profile_id));

-- Insert is limited to creating your OWN row (redemption flow). The invite
-- code itself is validated server-side via resolve_agency_invite_code() before
-- this insert runs; this policy only enforces "you can't create a membership
-- row for someone else".
create policy "agency_clipper_members_insert_own"
  on public.agency_clipper_members for insert
  with check (user_id = auth.uid());

-- Agency staff can update any field (approve, remove, etc). A clipper acting
-- on their own row may only ever move themselves to 'removido' (self
-- unlink) — they can't approve themselves or reactivate a removed link.
create policy "agency_clipper_members_update"
  on public.agency_clipper_members for update
  using (user_id = auth.uid() or public.is_agency_staff(auth.uid(), agency_profile_id))
  with check (
    public.is_agency_staff(auth.uid(), agency_profile_id)
    or (user_id = auth.uid() and status = 'removido')
  );

-- ============================================================================
-- agency_invite_links
-- ============================================================================
create table public.agency_invite_links (
  id uuid primary key default gen_random_uuid(),
  agency_profile_id uuid not null references public.agency_profiles(id) on delete cascade,
  code text not null unique,
  created_by uuid not null references auth.users(id),
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index agency_invite_links_agency_profile_id_idx
  on public.agency_invite_links(agency_profile_id);

alter table public.agency_invite_links enable row level security;

-- Only agency staff can list/manage their own invite links. Clippers never
-- SELECT this table directly — they resolve a code via the SECURITY DEFINER
-- function below, which returns only the target agency_profile_id (or null).
create policy "agency_invite_links_select_staff"
  on public.agency_invite_links for select
  using (public.is_agency_staff(auth.uid(), agency_profile_id));

create policy "agency_invite_links_insert_staff"
  on public.agency_invite_links for insert
  with check (public.is_agency_staff(auth.uid(), agency_profile_id));

create policy "agency_invite_links_update_staff"
  on public.agency_invite_links for update
  using (public.is_agency_staff(auth.uid(), agency_profile_id));

-- Helper: resolve an invite code to its agency_profile_id, or null if the
-- code doesn't exist / is inactive / has expired. security definer so an
-- authenticated (non-staff) clipper can call it without a SELECT grant on
-- agency_invite_links itself.
create or replace function public.resolve_agency_invite_code(p_code text)
returns uuid
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select agency_profile_id
  from public.agency_invite_links
  where code = p_code
    and is_active = true
    and (expires_at is null or expires_at > now())
  limit 1;
$$;

-- Redeems an invite code for the calling user, atomically: resolves the
-- code, enforces "one active agency-clipadores at a time", and inserts (or
-- reactivates a previously-removed) membership row. Runs as security
-- definer specifically so this one, narrowly-scoped and fully-validated
-- write path can bypass the regular agency_clipper_members RLS policies —
-- which otherwise only let a clipper move THEMSELVES to 'removido' (self
-- unlink), never back to 'pendente'/'ativo' on their own. p_auto_approve
-- lets the caller pick which of the two reviewed invite-approval variants
-- to use without touching this function.
create or replace function public.redeem_agency_invite(p_code text, p_auto_approve boolean default false)
returns public.agency_clipper_members
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_agency_profile_id uuid;
  v_active_elsewhere uuid;
  v_row public.agency_clipper_members;
begin
  v_agency_profile_id := public.resolve_agency_invite_code(p_code);
  if v_agency_profile_id is null then
    raise exception 'invalid_or_expired_code';
  end if;

  select agency_profile_id into v_active_elsewhere
  from public.agency_clipper_members
  where user_id = auth.uid() and status = 'ativo' and agency_profile_id <> v_agency_profile_id;

  if v_active_elsewhere is not null then
    raise exception 'already_active_elsewhere';
  end if;

  insert into public.agency_clipper_members (agency_profile_id, user_id, status, joined_at, removed_at)
  values (
    v_agency_profile_id,
    auth.uid(),
    case when p_auto_approve then 'ativo' else 'pendente' end,
    case when p_auto_approve then now() else null end,
    null
  )
  on conflict (agency_profile_id, user_id) do update
    set status = excluded.status,
        joined_at = excluded.joined_at,
        removed_at = null,
        invited_at = now()
  returning * into v_row;

  return v_row;
end;
$$;

-- ============================================================================
-- campaigns.visibility
-- ============================================================================
alter table public.campaigns
  add column visibility text not null default 'aberta'
  check (visibility in ('aberta', 'fechada_agencia'));

-- ============================================================================
-- RLS hardening: closed campaigns must not be visible/joinable by outsiders,
-- not even via a direct API call. Both policies below are REPLACED (not
-- just added to) so the rules stay in one place per table.
-- ============================================================================
drop policy if exists "campaigns_select_active_or_staff" on public.campaigns;

create policy "campaigns_select_active_or_staff"
  on public.campaigns for select
  using (
    (status = 'active' and visibility = 'aberta')
    or (status = 'active' and visibility = 'fechada_agencia' and public.is_agency_clipper_member(auth.uid(), agency_profile_id))
    or public.is_campaign_agency_staff(auth.uid(), id)
  );

drop policy if exists "campaign_participants_insert_own" on public.campaign_participants;

create policy "campaign_participants_insert_own"
  on public.campaign_participants for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.campaigns c
      where c.id = campaign_participants.campaign_id
        and c.status = 'active'
        and (c.visibility = 'aberta' or public.is_agency_clipper_member(auth.uid(), c.agency_profile_id))
    )
  );

-- ============================================================================
-- agency_clipper_metrics view
-- ============================================================================
-- security_invoker: unlike campaign_leaderboard (intentionally public,
-- non-sensitive), this view exposes earnings, so it must respect the
-- underlying RLS of the querying user (agency staff, via
-- is_campaign_agency_staff on campaigns / is_agency_staff-gated visibility).
-- Scoped to campaigns created by the SAME agency only (not the member's
-- global activity across other agencies/campaigns).
create view public.agency_clipper_metrics
  with (security_invoker = true)
as
select
  acm.agency_profile_id,
  acm.user_id,
  coalesce(sum(cp.views_count) filter (where cp.review_status = 'active'), 0)::bigint as total_views,
  coalesce(sum(payouts.amount) filter (where payouts.status = 'completed'), 0) as total_earnings
from public.agency_clipper_members acm
left join public.campaigns c
  on c.agency_profile_id = acm.agency_profile_id
left join public.campaign_posts cp
  on cp.campaign_id = c.id and cp.user_id = acm.user_id
left join public.campaign_payouts payouts
  on payouts.campaign_id = c.id and payouts.user_id = acm.user_id
where acm.status = 'ativo'
group by acm.agency_profile_id, acm.user_id;

-- ============================================================================
-- agency_membership_public view
-- ============================================================================
-- Intentionally NOT security_invoker (same rationale as campaign_leaderboard):
-- the spec asks for the "member of Agency X" badge on the clipper's PUBLIC
-- profile, visible to any visitor — not just the clipper or agency staff.
-- Exposes only the agency's display name/verified flag, nothing sensitive
-- (no invited_at/joined_at history, no earnings).
create view public.agency_membership_public as
select
  acm.user_id,
  ap.id as agency_profile_id,
  ap.display_name as agency_name,
  ap.verified as agency_verified
from public.agency_clipper_members acm
join public.agency_profiles ap on ap.id = acm.agency_profile_id
where acm.status = 'ativo';
