# Combined Phases 9–12 Installation

This release combines four phases to save time:

- Phase 9: true multi-page public website
- Phase 10: backend submission API for contact and volunteer forms
- Phase 11: private admin/CMS inbox and content editor
- Phase 12: central official-content configuration

## Install in Codespaces

```bash
cd /workspaces/philip-kaloki-2027
unzip philip-kaloki-website-phase9-12.zip
cp -r philip-kaloki-website-phase9-12/. .
rm -rf philip-kaloki-website-phase9-12 philip-kaloki-website-phase9-12.zip
rm -rf node_modules dist
rm -f package-lock.json
npm install
npm run build
```

## Development

Use two terminals.

Terminal 1:
```bash
ADMIN_KEY='choose-a-private-key' npm run api
```

Terminal 2:
```bash
npm run dev
```

Open port 5173.

Admin page: `/admin`

## Production-style local test

```bash
npm run build
ADMIN_KEY='choose-a-private-key' npm start
```

Open port 8787.

## Important persistence note

Submissions currently save to `data/submissions.json`. This is useful for Codespaces/local testing, but Render's standard filesystem is not a permanent database. Before relying on this for real campaign data, connect the API to Supabase/PostgreSQL. Do not collect sensitive campaign/supporter information on an ephemeral filesystem.

## Official content

The placeholders for phone, WhatsApp, social links and campaign wording are stored in `data/content.json` and can also be changed in `/admin`.
