-- Phase 21: dynamic slideshow, unlimited event galleries and social handles

create table if not exists public.homepage_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists homepage_slides_order_idx on public.homepage_slides(sort_order, created_at);

create table if not exists public.event_images (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists event_images_event_order_idx on public.event_images(event_id, sort_order, created_at);

insert into public.campaign_content(content_key,content_value) values
 ('twitter',''),('tiktok',''),('candidateCardImage','/assets/philip-kaloki-candidate-card.webp')
on conflict(content_key) do nothing;
