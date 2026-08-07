# Phase 34 — Publishing, Social Reach, Reports & Production Readiness

## Publishing
- News, Events and Media can store an official social-media post URL.
- News, Events and Media can store a live/external coverage URL.
- Items can be marked **LIVE NOW**.
- Public cards/detail pages show Live / Watch / Official Social Post links.
- Admin save operations show a clear completed-success notice after Supabase responds.

## Public visibility
- Persistent official-social-media dock while scrolling.
- Green website Chat launcher is forced visible/clickable above normal page content.
- Social and live-link clicks are captured as anonymous interaction events.
- Page views are recorded using a browser session ID; no IP address is stored by this feature.

## Submissions
- Search across name, phone, ward, subject and message.
- Filter by submission type and status.
- Select visible records.
- Bulk delete with one confirmation.
- Export the filtered records to CSV.
- Existing Reply / Reviewed / Close workflow remains.

## Reports
- New Admin → Reports section.
- Engagement totals.
- Top wards.
- Volunteer-interest analysis.
- Website-interaction summary.
- Contact directory containing details users supplied to the campaign.
- CSV contact export.
- Recent citizen suggestions / development proposals.

## Production-readiness work included
- Better explicit success/error feedback after publishing.
- More functional publishing QA fields for social/live coverage.
- Improved mobile layouts for Admin tools.
- Interaction tracking foundation for analytics.

## Still separate after Phase 34
Custom domain and campaign email DNS, external backups, final security penetration review,
automated uptime monitoring, and true Meta WhatsApp Business Cloud API messaging should be
handled as deployment/operations work rather than mixed into the CMS code.

## Supabase
Run `supabase/phase34_publishing_reports.sql` once.

## Install
```bash
cd /workspaces/philip-kaloki-2027
unzip -o philip-kaloki-website-phase34-publishing-reports-production.zip
rm -rf node_modules
npm install --include=dev
npm run check
```
