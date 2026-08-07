-- Phase 30: Website live chat

create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  visitor_name text not null,
  visitor_phone text not null,
  visitor_email text,
  status text not null default 'open' check (status in ('open','closed')),
  unread_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender text not null check (sender in ('visitor','admin')),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_threads_updated_idx
  on public.chat_threads(updated_at desc);

create index if not exists chat_messages_thread_idx
  on public.chat_messages(thread_id, created_at);

-- Service-role access is used by the Node API. No public direct table access is required.
