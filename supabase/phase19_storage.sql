-- Phase 19: Supabase Storage + publishing helpers

insert into storage.buckets (id, name, public)
values ('campaign-media', 'campaign-media', true)
on conflict (id) do update set public = excluded.public;

-- Service-role/secret-key API uploads bypass RLS.
-- Public read policy allows website visitors to load published campaign media.
drop policy if exists "Public read campaign media" on storage.objects;
create policy "Public read campaign media"
on storage.objects for select
using (bucket_id = 'campaign-media');

create index if not exists idx_news_slug on public.news_posts(slug);
create index if not exists idx_news_published_at on public.news_posts(published_at desc);
create index if not exists idx_media_created_at on public.media_assets(created_at desc);
