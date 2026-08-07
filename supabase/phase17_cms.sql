create extension if not exists pgcrypto;

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(), full_name text, email text, phone text, subject text,
  message text, ward text, status text not null default 'new', created_at timestamptz not null default now()
);
create table if not exists public.volunteer_submissions (
  id uuid primary key default gen_random_uuid(), full_name text, email text, phone text, ward text,
  sub_county text, interest text, message text, status text not null default 'new', created_at timestamptz not null default now()
);
create table if not exists public.citizen_ideas (
  id uuid primary key default gen_random_uuid(), full_name text, email text, phone text, ward text,
  category text, idea text, status text not null default 'new', created_at timestamptz not null default now()
);
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(), email text not null unique, full_name text,
  status text not null default 'new', created_at timestamptz not null default now()
);
create table if not exists public.campaign_content (
  id bigint generated always as identity primary key, content_key text not null unique,
  content_value text, updated_at timestamptz not null default now()
);
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(), title text not null, slug text unique, summary text, body text,
  image_url text, category text, published boolean not null default false, published_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(), title text not null, description text, venue text, ward text,
  event_date timestamptz, image_url text, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(), title text, description text, asset_type text,
  file_url text, thumbnail_url text, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(), action text not null, entity_type text,
  entity_id text, details jsonb, created_at timestamptz not null default now()
);

alter table public.events add column if not exists updated_at timestamptz not null default now();
alter table public.media_assets add column if not exists updated_at timestamptz not null default now();
alter table public.newsletter_subscribers add column if not exists status text not null default 'new';

create index if not exists idx_contact_status on public.contact_submissions(status);
create index if not exists idx_volunteer_status on public.volunteer_submissions(status);
create index if not exists idx_ideas_status on public.citizen_ideas(status);
create index if not exists idx_news_published on public.news_posts(published);
create index if not exists idx_events_date on public.events(event_date);

alter table public.contact_submissions enable row level security;
alter table public.volunteer_submissions enable row level security;
alter table public.citizen_ideas enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.campaign_content enable row level security;
alter table public.news_posts enable row level security;
alter table public.events enable row level security;
alter table public.media_assets enable row level security;
alter table public.audit_logs enable row level security;
-- No anon policies are needed: the Express server uses the private Supabase secret key.
