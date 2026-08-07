# Phase 32 — Two-Way Messaging & Reliable Public Chat

## Fixes
- Public green Chat button always opens an on-site chat panel.
- Visitor enters name/phone/email, starts a conversation, types messages, and sees Admin replies.
- Admin → Messages is the dedicated two-way conversation inbox.
- Admin can open a visitor thread and type/send replies.
- Admin can close/reopen conversations.
- Submissions now get a visible **Reply** button.
- Clicking Reply creates or reuses an open chat thread and takes Admin to Messages.
- Contact form submissions continue to be mirrored into chat threads.
- Direct WhatsApp remains available as a fallback, but the website chat works independently.

## Supabase
Phase 30 `supabase/phase30_live_chat.sql` must already have been run.
No new migration is required.

## Install
```bash
cd /workspaces/philip-kaloki-2027
unzip -o philip-kaloki-website-phase32-two-way-messaging-chat.zip
rm -rf node_modules
npm install --include=dev
npm run check
```
