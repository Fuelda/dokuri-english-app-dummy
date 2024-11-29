# 英語リスニングアプリ 実装仕様書

## 1. 最小構成のプロジェクト構造
```plaintext
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx        # ダッシュボード
│   ├── login/
│   │   └── page.tsx    # ログイン
│   ├── study/
│   │   └── page.tsx    # 学習画面
│   └── incorrect/
│       └── page.tsx    # 誤答リスト
├── components/
│   ├── AudioPlayer.tsx
│   ├── AnswerButtons.tsx
│   └── StudyModeSelector.tsx
├── hooks/
│   ├── useAuth.ts      # 認証管理
│   └── useStudy.ts     # 学習状態管理
├── data/
│   └── sentences.ts    # 問題文データ
└── types/
    └── index.ts
```

## 2. コアとなる型定義
```typescript
// types/index.ts
export interface Sentence {
  id: string;
  content: string;
}

export type StudyMode = 'new' | 'review' | 'mixed';

export type AnswerResult = 1 | 2 | 3;  // 1: もう一度, 2: 微妙, 3: 聞き取れた
```

## 3. データ構造
```typescript
// data/sentences.ts
export const sentences: Sentence[] = [
  {
    id: "1",
    content: "The weather is nice today."
  },
  // ...他の文章
];
```

## 4. Supabaseのテーブル定義
```sql
-- study_records table
create table study_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  sentence_id text,
  result smallint,
  next_review timestamp,
  mastered boolean default false,
  created_at timestamp default now()
);

-- RLSポリシー
alter table study_records enable row level security;
create policy "Users can only access their own records"
  on study_records for all
  using (auth.uid() = user_id);
```

## 5. 必須環境変数
```plaintext
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_CLOUD_TTS_API_KEY=
```

## 6. 主要な画面と機能

### ダッシュボード (/)
- 学習開始ボタン
- モード選択（新規/復習/混合）
- 誤答リストへのリンク

### 学習画面 (/study)
- 音声再生
- 3段階回答ボタン
- 次の問題への遷移

### 誤答リスト (/incorrect)
- 問題一覧表示
- 音声再生
- 問題の管理（削除/復習停止）

## 7. 開発優先順位

1. 認証機能
2. 基本的な問題出題フロー
3. 音声再生機能
4. 回答記録機能
5. 誤答リスト管理

これが開発開始に必要な最小限の情報となります。詳細な実装方法や細かいUIの調整は、開発進行に応じて適宜決定していただければと思います。