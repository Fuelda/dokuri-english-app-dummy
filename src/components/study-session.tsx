"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sentence, StudyMode, AnswerResult } from "@/types";
import { sentences } from "@/data/sentences";
import { AudioPlayer } from "@/components/audio-player";
import { AnswerButtons } from "@/components/answer-buttons";

interface StudySessionProps {
  mode: StudyMode;
  userId: string;
}

export function StudySession({ mode, userId }: StudySessionProps) {
  const [currentSentence, setCurrentSentence] = useState<Sentence | null>(null);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [availableQuestions, setAvailableQuestions] = useState<Sentence[]>([]);

  // 初回ロード時に利用可能な問題を取得
  useEffect(() => {
    const initializeSession = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        let questions: Sentence[] = [];

        if (mode === "new" || mode === "mixed") {
          const unusedSentences = await getUnusedSentences(supabase);
          questions = [...questions, ...unusedSentences];
        }
        if (mode === "review" || mode === "mixed") {
          const reviewSentences = await getReviewSentences(supabase);
          questions = [...questions, ...reviewSentences];
        }

        // ランダムに並び替え
        const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        setAvailableQuestions(shuffledQuestions);
        setTotalQuestions(shuffledQuestions.length);

        // 最初の問題をセット
        if (shuffledQuestions.length > 0) {
          setCurrentSentence(shuffledQuestions[0]);
          setCurrentQuestionIndex(1);
        }
      } catch (error) {
        console.error("Error initializing session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, [mode]);

  const loadNextSentence = async () => {
    setLoading(true);
    try {
      if (currentQuestionIndex >= availableQuestions.length) {
        setCurrentSentence(null);
      } else {
        setCurrentSentence(availableQuestions[currentQuestionIndex]);
        setCurrentQuestionIndex((prev) => prev + 1);
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

  const calculateNextReview = (result: AnswerResult): Date => {
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
      case 4: // 完璧
        nextReview.setDate(nextReview.getDate() + 30);
        break;
    }
    return nextReview;
  };

  const handleAnswer = async (result: AnswerResult) => {
    if (!currentSentence || answering) return;

    setAnswering(true);
    try {
      const supabase = createClient();

      // 既存の学習記録を確認
      const { data: existingRecord } = await supabase
        .from("study_records")
        .select()
        .eq("user_id", userId)
        .eq("sentence_id", currentSentence.id)
        .single();

      const nextReview = calculateNextReview(result);
      const studyCount = (existingRecord?.study_count || 0) + 1;

      // 完璧判定
      const mastered = result === 4;

      if (existingRecord) {
        // 既存の記録がある場合は更新
        const { error: updateError } = await supabase
          .from("study_records")
          .update({
            result,
            next_review: nextReview.toISOString(),
            mastered,
            study_count: studyCount,
          })
          .eq("user_id", userId)
          .eq("sentence_id", currentSentence.id);

        if (updateError) {
          console.error("Error updating record:", updateError);
        }
      } else {
        // 新規の場合は挿入
        const { error: insertError } = await supabase
          .from("study_records")
          .insert({
            user_id: userId,
            sentence_id: currentSentence.id,
            result,
            next_review: nextReview.toISOString(),
            mastered,
            study_count: 1,
          });

        if (insertError) {
          console.error("Error inserting record:", insertError);
        }
      }

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
          <div className="text-center mb-2 text-sm text-gray-600">
            {`${currentQuestionIndex} / ${totalQuestions}問`}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{
                width: `${
                  totalQuestions > 0
                    ? (currentQuestionIndex / totalQuestions) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>

        <AudioPlayer text={currentSentence?.content || ""} />
      </div>

      <AnswerButtons onAnswer={handleAnswer} disabled={answering} />
    </div>
  );
}
