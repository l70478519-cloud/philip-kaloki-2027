# Phase 19 — Supabase Storage + Detail Pages

## Adds
- Public Supabase Storage bucket `campaign-media`
- Secure server-side upload endpoint: `POST /api/admin/upload`
- News detail API: `/api/news/:slug`
- Event detail API: `/api/events/:id`
- Public article pages: `/news/:slug`
- Public event detail pages: `/events/:id`
- Better date presentation and detail navigation
- Existing Phase 17/18 CMS and Render integration preserved

## One-time Supabase migration
Run `supabase/phase19_storage.sql` in Supabase SQL Editor.

## Install
```bash
cd /workspaces/philip-kaloki-2027
unzip -o philip-kaloki-website-phase19-storage-details.zip
npm install
npm run check
```

## Local
Terminal 1:
```bash
npm run api
```

Terminal 2:
```bash
npm run dev
```

## Production
Commit and push to GitHub. Render can deploy the latest commit automatically.
