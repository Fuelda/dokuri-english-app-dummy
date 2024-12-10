// 文章データの型定義
export interface Sentence {
  id: string;
  content: string;
}

// ユーザー作成の文章の型定義
export interface UserSentence {
  id: string;
  userId: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 学習モードの型定義
export type StudyMode = "new" | "review" | "mixed";

// 回答結果の型定義（1: もう一度, 2: 微妩, 3: 聞き取れた）
export type AnswerResult = 1 | 2 | 3;

// 学習記録の型定義
export interface StudyRecord {
  id: string;
  user_id: string;
  sentence_id: string;
  result: AnswerResult;
  next_review: Date;
  mastered: boolean;
  study_count: number;
  created_at: Date;
  updated_at: Date;
}

// ユーザー情報の型定義
export interface User {
  id: string;
  email: string;
  username: string;
  created_at: Date;
  updated_at: Date;
}

// 学習セッションの型定義
export interface StudySession {
  mode: StudyMode;
  currentSentence?: Sentence;
  completed: boolean;
}
