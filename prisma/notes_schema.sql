-- notes テーブルの作成
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  upload_id uuid references uploads(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- RLS (Row-Level Security)
alter table notes enable row level security;
create policy "users can see own notes"
  on notes for select using (auth.uid() = user_id);
create policy "users can insert own notes"
  on notes for insert with check (auth.uid() = user_id);
create policy "users can update own notes"
  on notes for update using (auth.uid() = user_id);
create policy "users can delete own notes"
  on notes for delete using (auth.uid() = user_id);
