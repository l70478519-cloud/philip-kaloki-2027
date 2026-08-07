# Phase 6 Installation

From `/workspaces/philip-kaloki-2027`:

```bash
unzip philip-kaloki-website-phase6.zip
cp -r philip-kaloki-website-phase6/. .
rm -rf philip-kaloki-website-phase6
rm philip-kaloki-website-phase6.zip
rm -rf node_modules dist
rm -f package-lock.json
npm install
npm run build
npm run dev
```

If `npm run build` succeeds, open port 5173 and hard refresh the browser.
