# Phase 20 — Slideshow + Direct Admin Image Management

## What this phase adds
- Auto-rotating homepage campaign slideshow (5-second rotation).
- Previous/next controls and slideshow dots.
- Admin-managed slideshow images 1, 2 and 3.
- Admin-managed About/cover image.
- Direct Supabase Storage file upload from the admin panel.
- Direct upload for News cover images.
- Direct upload for Event cover images.
- Direct upload for Media files and thumbnails.
- Publish/unpublish checkbox controls.
- Phase 18/19 TypeScript and MediaPage repairs baked into this ZIP.

## One-time Supabase step
Run these migrations in Supabase SQL Editor if you have not already:
1. `supabase/phase19_storage.sql`
2. `supabase/phase20_images.sql`

## Install
```bash
cd /workspaces/philip-kaloki-2027
unzip -o philip-kaloki-website-phase20-slideshow-admin-images.zip
npm install
npm run check
```

## Local test
Terminal 1:
```bash
npm run api
```

Terminal 2:
```bash
npm run dev
```

Open `/admin`, then use:
- Homepage images
- News
- Events
- Media

## Production
After `npm run check` passes:
```bash
git add .
git commit -m "Phase 20 slideshow and admin image uploads"
git push origin main
```
Render can then deploy the latest commit.
