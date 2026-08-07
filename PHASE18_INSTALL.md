# Phase 18 — Live Publishing Integration

This overlay connects the public News, Events and Media pages directly to the Supabase-backed CMS.

## What changes
- `/news` loads published records from `news_posts`.
- `/events` loads published records from `events`.
- `/media` loads published records from `media_assets`.
- Empty states are graceful when no records exist.
- Existing Phase 17 admin CMS, Supabase integration and Render setup remain intact.

## Install
From the repository root:

```bash
unzip -o philip-kaloki-website-phase18-live-publishing.zip
npm install
npm run check
```

Then run API and Vite in separate terminals.

## Production
Commit and push to GitHub, then Render can auto-deploy the latest commit.
