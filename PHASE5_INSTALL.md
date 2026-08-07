# Phase 5 Installation

Phase 5 integrates the supplied Prof. Philip Kaloki campaign photographs into the existing professional design.

```bash
cd /workspaces/philip-kaloki-2027
unzip philip-kaloki-website-phase5.zip
cp -r philip-kaloki-website-phase5/. .
rm -rf philip-kaloki-website-phase5
rm philip-kaloki-website-phase5.zip
rm -rf node_modules dist
rm -f package-lock.json
npm install
npm run build
npm run dev
```

Open port 5173 and hard-refresh the browser.
