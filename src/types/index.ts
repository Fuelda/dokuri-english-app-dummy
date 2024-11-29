// 文章データの型定義
export interface Sentence {
  id: string;
  content: string;
}

// 学習モードの型定義
export type StudyMode = "new" | "review" | "mixed";

// 回答結果の型定義（1: もう一度, 2: 微妙, 3: 聞き取れた）
export type AnswerResult = 1 | 2 | 3;

// 学習記録の型定義
export interface StudyRecord {
  id: string;
  userId: string;
  sentenceId: string;
  result: AnswerResult;
  nextReview: Date;
  mastered: boolean;
  createdAt: Date;
}

// ユーザー情報の型定義
export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

// 学習セッションの型定義
export interface StudySession {
  mode: StudyMode;
  currentSentence?: Sentence;
  completed: boolean;
}
