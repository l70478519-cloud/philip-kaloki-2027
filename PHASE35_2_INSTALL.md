# Phase 35.2 — Event Albums, Album Editing & Candidate Identity

## New
- Event photographs are displayed as an album on the public Event detail page.
- Event album opens in the same slideshow/lightbox used by Media albums.
- Candidate identification remains visible inside the album viewer.
- Admin Event photographs are contained in a collapsible event-album panel instead of a long list.
- Older Media albums now have **Edit album title & description**.
- Editing an album updates all photographs belonging to that album.
- Public site has a slim sticky candidate identity strip beneath navigation.
- The identity strip is part of the page flow and is deliberately compact so it does not obscure content.
- Generic “Campaign moments” album fallback is avoided where a real stored title exists.

## Candidate identification
The sticky strip uses neutral identification:
Prof. Philip Kaloki — Candidate for Governor — Makueni County — 2027.

## Supabase
No new SQL migration is required.

## Install
```bash
cd /workspaces/philip-kaloki-2027
unzip -o philip-kaloki-website-phase35.2-event-albums-candidate-identity.zip
npm run check
```
