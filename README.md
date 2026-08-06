# Prof. Philip Kaloki Professional Campaign Website

A from-scratch React + TypeScript campaign website concept based on the public information structure of the current Philip Kaloki website.

## Run in GitHub Codespaces or locally

```bash
npm install
npm run dev
```

Open port **5173**.

## Production build

```bash
npm run build
npm run preview
```

## Render deployment

1. Push this folder to GitHub.
2. Create a new **Static Site** on Render.
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`

A `render.yaml` is included.

## Important before public launch

- Confirm all biography, project, target and manifesto statements.
- Replace placeholder email addresses and social links.
- Verify campaign office address and phone number.
- Connect forms to a secure backend with spam protection and consent records.
- Add an approved privacy policy, terms and campaign finance disclosures.
- Replace demonstration event and media content.
- Confirm image ownership and permission.

## Structure

- `src/pages` — route pages
- `src/components` — shared navigation, footer and page components
- `src/styles.css` — complete responsive design system
- `public/images` — candidate image assets
