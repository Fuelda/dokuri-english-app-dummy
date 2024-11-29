-- 開発環境用のテストユーザー
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) values (
  '00000000-0000-0000-0000-000000000000',
  'd44bfb2b-347b-4336-9d67-a4a7c0a9ce85',
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"username": "testuser"}'::jsonb,
  now(),
  now()
) on conflict (id) do nothing;

-- テストユーザーの学習記録サンプル
insert into study_records (
  user_id,
  sentence_id,
  result,
  next_review,
  mastered
) values
  ('d44bfb2b-347b-4336-9d67-a4a7c0a9ce85', '1', 3, now() + interval '7 days', false),
  ('d44bfb2b-347b-4336-9d67-a4a7c0a9ce85', '2', 2, now() + interval '3 days', false),
  ('d44bfb2b-347b-4336-9d67-a4a7c0a9ce85', '3', 1, now(), false);
