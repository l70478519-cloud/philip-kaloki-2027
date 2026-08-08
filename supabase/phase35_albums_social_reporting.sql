-- Phase 35: scalable albums + external social/live publishing metadata
alter table if exists public.media_assets add column if not exists album_name text;
alter table if exists public.news_posts add column if not exists social_url text;
alter table if exists public.news_posts add column if not exists live_url text;
alter table if exists public.events add column if not exists social_url text;
alter table if exists public.events add column if not exists live_url text;
create index if not exists media_assets_album_name_idx on public.media_assets(album_name);
