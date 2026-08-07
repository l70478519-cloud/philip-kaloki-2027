# Phase 23 — Media workflow repair

- Fixes upload URL handling so new photos render correctly.
- Adds confirmation before homepage/event/media bulk publishing.
- Media bulk uploads are staged with previews before publish.
- Simplifies Media: bulk photos first; single video/document/manual upload is optional.
- Adds compact Media slideshow and compact gallery grid.
- Public APIs filter malformed image URLs.
- Adds protected DELETE /api/admin/media/broken for invalid photo records.

No new Supabase migration required.
