# Phase 25 — Bulk Galleries & Compact Admin Grid

## Changes
- Bulk delete now asks for confirmation only once and deletes selected News, Events or Media in one API call.
- Homepage slideshow bulk upload now has shared caption/title and brief description/context fields.
- Homepage slideshow items are arranged in a compact responsive grid instead of one long vertical list.
- Homepage slideshow items support multi-select and one-confirmation bulk delete.
- News supports multiple gallery photos after the story is first saved.
- Events retain multiple photos and now support a shared gallery caption/context.
- Public News detail pages show a photo mini-gallery/lightbox.
- Public Event detail pages continue to show their photo mini-gallery/lightbox.
- Media bulk upload keeps title + brief description before publish.

## Supabase
Run `supabase/phase25_news_gallery_slide_context.sql` once before testing News galleries.

## Install
```bash
cd /workspaces/philip-kaloki-2027
unzip -o philip-kaloki-website-phase25-bulk-galleries-admin-grid.zip
rm -rf node_modules
npm install --include=dev
npm run check
```
