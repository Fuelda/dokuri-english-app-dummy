-- Enable required extensions
create extension if not exists "uuid-ossp";

-- profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLSポリシー
alter table profiles enable row level security;

create policy "プロファイルは本人のみが参照可能"
  on profiles for select
  using (auth.uid() = id);

create policy "プロファイルは本人のみが更新可能"
  on profiles for update
  using (auth.uid() = id);

-- トリガー：プロファイルの更新日時を自動更新
create function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on profiles
  for each row
  execute procedure handle_updated_at();

-- トリガー：新規ユーザー作成時にプロファイルを自動作成
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- study_records table
create table study_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  sentence_id text not null,
  result smallint not null check (result between 1 and 3),
  next_review timestamp with time zone not null,
  mastered boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- インデックス
create index study_records_user_id_idx on study_records(user_id);
create index study_records_next_review_idx on study_records(next_review);

-- RLSポリシー
alter table study_records enable row level security;

create policy "学習記録は本人のみが参照可能"
  on study_records for select
  using (auth.uid() = user_id);

create policy "学習記録は本人のみが作成可能"
  on study_records for insert
  with check (auth.uid() = user_id);

create policy "学習記録は本人のみが更新可能"
  on study_records for update
  using (auth.uid() = user_id);

create policy "学習記録は本人のみが削除可能"
  on study_records for delete
  using (auth.uid() = user_id);

-- トリガー：学習記録の更新日時を自動更新
create trigger on_study_records_updated
  before update on study_records
  for each row
  execute procedure handle_updated_at();
