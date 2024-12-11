"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { AudioPlayer } from "./audio-player";

type UserSentence = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export function UserSentencesList({ userId }: { userId: string }) {
  const [sentences, setSentences] = useState<UserSentence[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchSentences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchSentences = async () => {
    const { data, error } = await supabase
      .from("user_sentences")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user sentences:", error);
      return;
    }

    setSentences(data || []);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_sentences")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // 一覧を更新
      setSentences(sentences.filter((sentence) => sentence.id !== id));
    } catch (error) {
      console.error("Error deleting sentence:", error);
    }
  };

  if (sentences.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">登録された英文はありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sentences.map((sentence) => (
        <div
          key={sentence.id}
          className="border rounded-lg p-4 bg-white shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <AudioPlayer text={sentence.content} />
              <div className="mt-4 text-sm text-gray-500">
                登録日: {new Date(sentence.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="ml-4">
              <button
                onClick={() => handleDelete(sentence.id)}
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
        </div>
      ))}
    </div>
  );
}
