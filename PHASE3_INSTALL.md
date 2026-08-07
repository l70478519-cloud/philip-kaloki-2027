# Phase 3 installation

From `/workspaces/philip-kaloki-2027`:

```bash
unzip philip-kaloki-website-phase3.zip
cp -r philip-kaloki-website-phase3/. .
rm -rf philip-kaloki-website-phase3 philip-kaloki-website-phase3.zip
rm -rf node_modules dist
npm install
npm run build
npm run dev
```
