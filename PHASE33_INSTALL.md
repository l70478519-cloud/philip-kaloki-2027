# Phase 33 — Realtime Chat & Notifications

## New features
- Visitor and Admin messages appear in near real-time without refresh.
- Typing indicators on both sides.
- Online/recent activity indicator.
- Admin unread total and Messages badge.
- New-message sound toggle.
- Browser notifications when permission is granted.
- Realtime Admin message thread updates.
- Conversation history remains stored in Supabase.
- Existing WhatsApp shortcut remains available.

## Supabase
Run `supabase/phase33_realtime_chat.sql` once.

## Architecture
Phase 33 uses a secure Server-Sent Events (SSE) stream from the Render Node API.
Supabase service-role credentials stay on the server and are never exposed to browsers.

## Install
```bash
cd /workspaces/philip-kaloki-2027
unzip -o philip-kaloki-website-phase33-realtime-chat-notifications.zip
rm -rf node_modules
npm install --include=dev
npm run check
```
