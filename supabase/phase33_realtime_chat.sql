-- Phase 33: realtime chat support
-- Adds activity timestamps for persistent presence hints.
alter table public.chat_threads
  add column if not exists visitor_active_at timestamptz,
  add column if not exists admin_active_at timestamptz;

create index if not exists chat_threads_unread_idx
  on public.chat_threads(unread_count desc, updated_at desc);

-- Optional: add tables to Supabase Realtime publication if you later switch
-- from server SSE to direct Supabase Realtime subscriptions.
do $$
begin
  begin
    alter publication supabase_realtime add table public.chat_threads;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.chat_messages;
  exception when duplicate_object then null;
  end;
end $$;
