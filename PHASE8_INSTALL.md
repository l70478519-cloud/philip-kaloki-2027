# Phase 8 — Portrait Alignment & Visual Cleanup

This phase continues directly from Phase 7. The hero portrait is now cropped from the original two-up image so only one correctly centred portrait appears. The original uploaded image is preserved for gallery use.

## Install in GitHub Codespaces

```bash
cd /workspaces/philip-kaloki-2027
unzip philip-kaloki-website-phase8.zip
cp -r philip-kaloki-website-phase8/. .
rm -rf philip-kaloki-website-phase8
rm philip-kaloki-website-phase8.zip
rm -rf node_modules dist
rm -f package-lock.json
npm install
npm run build
npm run dev
```

Open port 5173 and hard-refresh the browser.
