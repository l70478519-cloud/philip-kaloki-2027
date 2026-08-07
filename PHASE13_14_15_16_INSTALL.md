# Combined Phases 13–16

Adds media downloads, SEO files, privacy/terms/accessibility pages, anti-spam controls, rate limiting, security headers, production Render config, 404 handling and a preflight QA command.

## Install / verify

```bash
npm install
npm run check
```

## Development

Terminal 1:
```bash
ADMIN_KEY='use-a-private-development-key' npm run api
```

Terminal 2:
```bash
npm run dev
```

## Important
JSON files are still development storage. Connect Supabase before relying on production form persistence.
