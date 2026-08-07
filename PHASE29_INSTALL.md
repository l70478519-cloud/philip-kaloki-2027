# Phase 29 — Registrations, Functional Links & Clean Public Labels

## Fixes
- Volunteer registration form uses the live `/api/submissions/volunteer` endpoint.
- Volunteer form reports the real API/Supabase error instead of saying the API server is not running.
- Contact, citizen idea and newsletter submissions share the hardened public submission endpoint.
- Public forms validate required fields before inserting into Supabase.
- Homepage Images remain grouped in an Admin folder/album.
- Public homepage slideshow no longer displays raw camera filenames such as `IMG-20260807-WA0103`.
- Common raw camera names (`IMG`, `DSC`, `DCIM`, `PXL`, long numeric filenames) are replaced with `Campaign photograph`.
- Social and WhatsApp links are normalized to real destinations.
- Candidate logo links to Home.

## Supabase
No new migration is required if Phase 17 submission tables are already installed.

## Install
```bash
cd /workspaces/philip-kaloki-2027
unzip -o philip-kaloki-website-phase29-registrations-links-clean-labels.zip
rm -rf node_modules
npm install --include=dev
npm run check
```
