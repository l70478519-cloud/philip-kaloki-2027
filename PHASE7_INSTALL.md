# Phase 7 Installation

Phase 7 continues directly from Phase 6. It includes the permanent PostCSS newline fix and adds the leadership profile, participation pathways, and Your Voice citizen-ideas section.

```bash
cd /workspaces/philip-kaloki-2027
unzip philip-kaloki-website-phase7.zip
cp -r philip-kaloki-website-phase7/. .
rm -rf philip-kaloki-website-phase7 philip-kaloki-website-phase7.zip
rm -rf node_modules dist
rm -f package-lock.json
npm install
npm run build
npm run dev
```

Open port 5173.
