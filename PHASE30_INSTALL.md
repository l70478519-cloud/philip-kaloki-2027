# Phase 30 — Live Website Chat & Clickable Admin Dashboard

## What changes
- Admin dashboard summary cards are clickable and take you to the matching management area.
- Floating green chat button opens an in-site campaign chat instead of immediately leaving the website.
- Visitor enters name, phone and optional email before starting a conversation.
- Visitor details and all messages are saved in Supabase.
- Admin gets a new **Messages** section.
- Admin can open a conversation, view visitor details, reply, mark read, close and reopen conversations.
- Visitor chat polls for new replies every five seconds while open.
- Phone and email inside the admin conversation are clickable.
- The normal WhatsApp link can still be kept in Contact/Footer for users who prefer WhatsApp.

## Important
This is an internal website chat. To send and receive messages inside the actual WhatsApp app from the admin dashboard, a later integration with Meta WhatsApp Business Cloud API is required.

## Supabase
Run `supabase/phase30_live_chat.sql` once before testing chat.

## Install
```bash
cd /workspaces/philip-kaloki-2027
unzip -o philip-kaloki-website-phase30-live-chat-clickable-dashboard.zip
rm -rf node_modules
npm install --include=dev
npm run check
```
