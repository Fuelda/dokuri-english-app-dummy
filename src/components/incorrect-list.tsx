"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AudioPlayer } from "./audio-player";
import { sentences } from "@/data/sentences";
import { Sentence, StudyRecord } from "@/types";

interface IncorrectListProps {
  userId: string;
}

interface IncorrectItem extends StudyRecord {
  sentence: Sentence;
}

export function IncorrectList({ userId }: IncorrectListProps) {
  const [items, setItems] = useState<IncorrectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncorrectItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadIncorrectItems = async () => {
    try {
      const supabase = createClient();

      // 通常の問題の取得
      const { data: standardRecords, error: standardError } = await supabase
        .from("study_records")
        .select("*")
        .eq("user_id", userId)
        .or("mastered.eq.false,study_count.gte.2")
        .order("next_review", { ascending: true });

      if (standardError) throw standardError;

      // TODO: ユーザー作成の問題の取得
      // // ユーザー作成の問題の取得
      // const { data: userSentences, error: userError } = await supabase
      //   .from("user_sentences")
      //   .select("*")
      //   .eq("user_id", userId)
      //   .eq("is_active", true);

      // if (userError) throw userError;

      // 通常の問題とユーザー作成の問題を結合
      const allSentences = [
        ...sentences,
        // ...(userSentences || []).map((us) => ({
        //   id: us.id,
        //   content: us.content,
        // })),
      ];

      // 文章データと結合
      const itemsWithSentences = (standardRecords || [])
        .map((record) => {
          const sentence = allSentences.find(
            (s) => s.id === record.sentence_id
          );
          if (!sentence) return null;
          return {
            ...record,
            sentence,
          };
        })
        .filter((item): item is IncorrectItem => item !== null);

      setItems(itemsWithSentences);
    } catch (error) {
      console.error("Error loading incorrect items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("study_records")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // 一覧を更新
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handlePauseReview = async (id: string) => {
    try {
      const supabase = createClient();
      // 次の復習日を1ヶ月後に設定
      const nextReview = new Date();
      nextReview.setMonth(nextReview.getMonth() + 1);

      const { error } = await supabase
        .from("study_records")
        .update({ next_review: nextReview.toISOString() })
        .eq("id", id);

      if (error) throw error;

      // 一覧を更新
      await loadIncorrectItems();
    } catch (error) {
      console.error("Error pausing review:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">現在、復習が必要な問題はありません。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <AudioPlayer text={item.sentence.content} />
              <div className="mt-2 text-sm text-gray-600">
                学習回数: {item.study_count}回
              </div>
            </div>
            <div className="ml-4 flex space-x-2">
              <button
                onClick={() => handlePauseReview(item.id)}
                className="text-gray-400 hover:text-gray-600"
                title="復習を一時停止"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-gray-400 hover:text-red-600"
                title="削除"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            次の復習日:{" "}
            {new Date(item.next_review).toLocaleString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
