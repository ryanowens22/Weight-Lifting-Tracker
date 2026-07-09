-- Workout tracker: run this once in Supabase (SQL Editor > New query > paste > Run)

create table if not exists public.workout_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  person text not null,          -- "Ryan" or "Sara"
  exercise text not null,        -- exercise name
  date date not null,            -- workout date
  sets jsonb not null,           -- [{"weight":"15","reps":"12"}, ...]
  updated_at timestamptz not null default now(),
  unique (user_id, person, exercise, date)
);

alter table public.workout_logs enable row level security;

-- Only the signed-in account can see/write its own rows
create policy "own rows select" on public.workout_logs
  for select using (auth.uid() = user_id);

create policy "own rows insert" on public.workout_logs
  for insert with check (auth.uid() = user_id);

create policy "own rows update" on public.workout_logs
  for update using (auth.uid() = user_id);

create policy "own rows delete" on public.workout_logs
  for delete using (auth.uid() = user_id);
