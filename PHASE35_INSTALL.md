# Phase 35 — Albums, Publishing Links, Reports & Production Readiness

## Included
- Media Centre now scales into searchable albums instead of one huge album.
- Admin Media supports an Album name for organising future photo uploads.
- News and Events support an official social-media URL and a live/video URL.
- Viewer News/Event cards and detail pages expose "Read more on social media" and live/replay links.
- Admin gains Reports & Analysis: interaction totals, top wards, volunteer interests, contact/volunteer record keeping, CSV export, and suggestions.
- Public album area includes a campaign identity/development-agenda reminder while browsing.
- The extra floating social-media dock is disabled; the existing site social links remain.

## Database step — REQUIRED
Run `supabase/phase35_albums_social_reporting.sql` once in Supabase SQL Editor before testing the new Admin fields.

## Install
Copy this zip over the current repository (preserving `.env`/Render environment variables), then:

```bash
npm install
npm run check
git add .
git commit -m "Phase 35 searchable albums reports and social publishing links"
git push origin main
```

## Production-readiness work carried forward
Phase 35 also preserves the Phase 34 production foundation: interaction collection, reporting endpoint, submissions search/delete, live chat, audit records and publishing controls. Before final launch still perform: Render/API stability soak test; Admin/mobile QA; chat QA; backup/restore drill; admin-key rotation and stronger authentication; rate-limit/security review; SEO/Open Graph verification; JS bundle/code-splitting optimization; custom domain/campaign email; uptime/error monitoring; cross-browser testing; and final news/events/media publishing QA.

## Recommended media workflow
Use meaningful album names such as `Kilome Community Forum — August 2026`, `Women Empowerment Programme — Kiima Kiu`, or `Campaign Launch`. This prevents hundreds of photographs from appearing as one unmanageable collection.
