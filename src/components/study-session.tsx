"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sentence, StudyMode, AnswerResult } from "@/types";
import { sentences } from "@/data/sentences";
import { AudioPlayer } from "./audio-player";
import { AnswerButtons } from "./answer-buttons";

interface StudySessionProps {
  mode: StudyMode;
  userId: string;
}

export function StudySession({ mode, userId }: StudySessionProps) {
  const [currentSentence, setCurrentSentence] = useState<Sentence | null>(null);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadNextSentence();
  }, []);

  const loadNextSentence = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // モードに応じて問題を取得
      let nextSentence: Sentence | null = null;
      if (mode === "new" || mode === "mixed") {
        // 新規問題からランダムに選択
        const unusedSentences = await getUnusedSentences(supabase);
        if (unusedSentences.length > 0) {
          nextSentence =
            unusedSentences[Math.floor(Math.random() * unusedSentences.length)];
        }
      }

      if (!nextSentence && (mode === "review" || mode === "mixed")) {
        // 復習が必要な問題を取得
        const reviewSentences = await getReviewSentences(supabase);
        if (reviewSentences.length > 0) {
          nextSentence =
            reviewSentences[Math.floor(Math.random() * reviewSentences.length)];
        }
      }

      if (!nextSentence) {
        // 利用可能な問題がない場合
        setCurrentSentence(null);
        setProgress(100);
      } else {
        setCurrentSentence(nextSentence);
        setProgress((prev) => Math.min(prev + 10, 100));
      }
    } catch (error) {
      console.error("Error loading next sentence:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUnusedSentences = async (
    supabase: ReturnType<typeof createClient>
  ) => {
    // 既に回答済みの問題のIDを取得
    const { data: records } = await supabase
      .from("study_records")
      .select("sentence_id")
      .eq("user_id", userId);

    const usedIds = new Set(records?.map((r) => r.sentence_id) || []);

    // 未使用の問題を返す
    return sentences.filter((s) => !usedIds.has(s.id));
  };

  const getReviewSentences = async (
    supabase: ReturnType<typeof createClient>
  ) => {
    const { data: records } = await supabase
      .from("study_records")
      .select("sentence_id")
      .eq("user_id", userId)
      .eq("mastered", false)
      .lt("next_review", new Date().toISOString());

    if (!records?.length) return [];

    const reviewIds = new Set(records.map((r) => r.sentence_id));
    return sentences.filter((s) => reviewIds.has(s.id));
  };

  const handleAnswer = async (result: AnswerResult) => {
    if (!currentSentence || answering) return;

    setAnswering(true);
    try {
      const supabase = createClient();

      // 次の復習日を計算
      const nextReview = new Date();
      switch (result) {
        case 1: // もう一度
          nextReview.setHours(nextReview.getHours() + 1);
          break;
        case 2: // 微妙
          nextReview.setDate(nextReview.getDate() + 3);
          break;
        case 3: // 聞き取れた
          nextReview.setDate(nextReview.getDate() + 7);
          break;
      }

      // 学習記録を保存
      await supabase.from("study_records").upsert({
        user_id: userId,
        sentence_id: currentSentence.id,
        result,
        next_review: nextReview.toISOString(),
        mastered: result === 3,
      });

      // 次の問題を読み込む
      await loadNextSentence();
    } catch (error) {
      console.error("Error saving answer:", error);
    } finally {
      setAnswering(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!currentSentence) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">学習完了！</h2>
        <p className="text-gray-600 mb-8">
          現在利用可能な問題をすべて学習しました。
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ダッシュボードに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <AudioPlayer text={currentSentence.content} />
      </div>

      <AnswerButtons onAnswer={handleAnswer} disabled={answering} />
    </div>
  );
}
