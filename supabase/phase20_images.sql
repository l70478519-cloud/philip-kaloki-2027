-- Phase 20: default slideshow / cover image settings.
-- Safe to run more than once.

insert into public.campaign_content (content_key, content_value)
values
  ('heroImage1', '/assets/philip-kaloki-portrait-hero.webp'),
  ('heroImage2', '/assets/philip-kaloki-field.webp'),
  ('heroImage3', '/assets/philip-kaloki-media-wide.webp'),
  ('aboutImage', '/assets/philip-kaloki-office.webp')
on conflict (content_key) do nothing;
