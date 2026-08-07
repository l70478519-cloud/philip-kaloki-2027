# Phase 31 — Admin Messages, Clickable Dashboard & Live Chat

## Fixes
- Adds a real **Messages** button to the Admin sidebar.
- Dashboard cards are real buttons and open the matching Admin section.
- Contact form submissions are mirrored into a chat conversation, so they appear in **Admin → Messages**.
- The visitor's contact-form thread is stored in the browser, allowing them to continue the conversation using the green chat button.
- Floating green button now opens the internal website chat instead of only linking away to WhatsApp.
- Chat stores visitor name, phone, optional email and conversation history in Supabase.
- Admin can reply, mark read, close/reopen conversations.
- Admin conversation header includes clickable phone, email and a direct WhatsApp shortcut.
- Existing real WhatsApp remains available as a fallback link inside the chat panel.
- Admin buttons explicitly use `type="button"` and responsive click/pointer behavior.

## Supabase
Phase 30's `supabase/phase30_live_chat.sql` must already have been run.
No additional SQL migration is required for Phase 31.

## Install
```bash
cd /workspaces/philip-kaloki-2027
unzip -o philip-kaloki-website-phase31-admin-messages-live-chat.zip
rm -rf node_modules
npm install --include=dev
npm run check
```
