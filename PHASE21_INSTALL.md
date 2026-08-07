# Phase 21 — Approved Mock-up Merge

This package is merged into the actual Phase 20 repository supplied by the user.

## Adds
- Database-driven automatic homepage slideshow with unlimited slides.
- Admin add/remove/show/hide/reorder slideshow images.
- Unlimited event mini-galleries with multi-image upload and reorder.
- Event lightbox gallery on the public event page.
- Candidate portrait + “Vying for Governor — Makueni County 2027” reminder on News and Event detail pages.
- Dedicated Social Media admin page for Facebook, X, Instagram, TikTok and YouTube.
- Social icons beside “Leadership that listens. Development that reaches every household.”
- Candidate identity/cover image management from Admin.
- Better detail-page SEO/Open Graph metadata and social sharing panel.

## One-time Supabase migration
Run `supabase/phase21_gallery_social.sql` in Supabase SQL Editor.

## Install
```bash
cd /workspaces/philip-kaloki-2027
unzip -o philip-kaloki-website-phase21-final.zip
npm install
npm run check
```

## Local test
Terminal 1: `npm run api`
Terminal 2: `npm run dev`

Test `/`, `/admin`, `/news`, `/events`, `/media`.
