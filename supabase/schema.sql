-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
-- It creates one private row of learning progress per signed-in user.
create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

create policy "read own progress" on public.progress
  for select using (auth.uid() = user_id);
create policy "insert own progress" on public.progress
  for insert with check (auth.uid() = user_id);
create policy "update own progress" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own progress" on public.progress
  for delete using (auth.uid() = user_id);

-- Public Speaking Academy progress is stored inside the existing private progress.data JSONB
-- document under the "speaking" key. The existing progress RLS policies above apply:
-- learners can read/write only their own row. No public recording storage is created.
-- For server-side certificate checks, configure Netlify with the matching Supabase URL,
-- anon key and service-role key. NEVER put the service-role key in browser code.
