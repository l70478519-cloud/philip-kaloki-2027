# Phase 34.1 Hotfix

Fixes:
- React runtime error #310 when refreshing Admin.
- Moves the Admin realtime hook above the authentication early return.
- Restores the public Campaign Chat launcher to the Layout.
- Adds a persistent official social-media dock on public pages.
- Forces chat/social controls to remain visible and clickable.
- Updates the Admin phase indicator to Phase 34.1.

No Supabase migration is required for this hotfix.

Install:
cd /workspaces/philip-kaloki-2027
unzip -o philip-kaloki-website-phase34-1-runtime-viewer-hotfix.zip
rm -rf node_modules
npm install --include=dev
npm run check
