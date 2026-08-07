-- Phase 25: News galleries and homepage slide descriptions

alter table if exists public.homepage_slides
  add column if not exists description text;

create table if not exists public.news_images (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references public.news_posts(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists news_images_news_id_idx
  on public.news_images(news_id);

create index if not exists news_images_sort_idx
  on public.news_images(news_id, sort_order);
