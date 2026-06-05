-- users は Supabase Auth が自動で管理

create table if not exists uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  created_at timestamp with time zone default now()
);

create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan jsonb not null,
  created_at timestamp with time zone default now()
);

create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  quiz jsonb not null,
  created_at timestamp with time zone default now()
);

-- RLS (Row-Level Security) -------------------------------------------------
alter table uploads enable row level security;
create policy "users can see own uploads"
  on uploads for select using (auth.uid() = user_id);
create policy "users can insert own uploads"
  on uploads for insert with check (auth.uid() = user_id);

alter table schedules enable row level security;
create policy "users can see own schedules"
  on schedules for select using (auth.uid() = user_id);
create policy "users can insert own schedules"
  on schedules for insert with check (auth.uid() = user_id);

alter table quizzes enable row level security;
create policy "users can see own quizzes"
  on quizzes for select using (auth.uid() = user_id);
create policy "users can insert own quizzes"
  on quizzes for insert with check (auth.uid() = user_id);
