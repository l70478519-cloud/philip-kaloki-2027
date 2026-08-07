-- Phase 34 — social/live publishing metadata + interaction reporting

alter table public.news_posts
  add column if not exists social_url text,
  add column if not exists live_url text,
  add column if not exists is_live boolean not null default false;

alter table public.events
  add column if not exists social_url text,
  add column if not exists live_url text,
  add column if not exists is_live boolean not null default false;

alter table public.media_assets
  add column if not exists social_url text,
  add column if not exists live_url text,
  add column if not exists is_live boolean not null default false;

create table if not exists public.visitor_interactions (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  label text,
  path text,
  session_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists visitor_interactions_created_idx
  on public.visitor_interactions(created_at desc);

create index if not exists visitor_interactions_type_idx
  on public.visitor_interactions(event_type, created_at desc);
