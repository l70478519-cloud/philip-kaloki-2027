# Phase 4 installation

From `/workspaces/philip-kaloki-2027`:

```bash
unzip philip-kaloki-website-phase4.zip
cp -r philip-kaloki-website-phase4/. .
rm -rf philip-kaloki-website-phase4 philip-kaloki-website-phase4.zip node_modules dist
rm -f package-lock.json
npm install
npm run build
npm run dev
```

Open port 5173. Only start the development server after the production build succeeds.
