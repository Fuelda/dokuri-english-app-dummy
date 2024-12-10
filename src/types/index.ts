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
  userId: string;
  sentenceId: string;
  result: AnswerResult;
  nextReview: Date;
  mastered: boolean;
  studyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ユーザー情報の型定義
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

// 学習セッションの型定義
export interface StudySession {
  mode: StudyMode;
  currentSentence?: Sentence;
  completed: boolean;
}
