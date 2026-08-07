# Phase 17 — Supabase Admin CMS

This package upgrades the working Phase 16 project. It preserves the public website and Render setup while replacing the small admin screen with a Supabase-backed CMS.

## 1. Run the database migration
Open Supabase > SQL Editor and run `supabase/phase17_cms.sql` once.

## 2. Install over the existing repository
The ZIP is intentionally rooted at the project files. From `/workspaces/philip-kaloki-2027`:

```bash
unzip -o philip-kaloki-website-phase17-admin-cms.zip
npm install
npm run check
```

Do not copy from an extracted subfolder; this archive extracts directly into the repository root.

## 3. Local development
Terminal 1:
```bash
npm run api
```
Terminal 2:
```bash
npm run dev
```
Open port 5173 and visit `/admin`.

## 4. Render
Build command: `npm ci --include=dev && npm run build`
Start command: `npm run api`
Use Node 22 and keep `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ADMIN_KEY`, and `NODE_ENV=production` in Render Environment.

## CMS modules
- Dashboard counters
- Submission inbox + Reviewed/Closed status
- Official website content
- News create/edit/delete
- Events create/edit/delete
- Media create/edit/delete
- Audit log
