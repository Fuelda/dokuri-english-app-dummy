"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function IncorrectListSummary() {
  const router = useRouter();
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncorrectCount = async () => {
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // 要復習の条件：
      // 1. masteredがfalse（完璧でない）
      // 2. 次の復習日が現在より前（復習が必要）
      const { count, error } = await supabase
        .from("study_records")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id)
        .eq("mastered", false)
        .lt("next_review", new Date().toISOString());

      if (error) {
        console.error("Error fetching incorrect count:", error);
        return;
      }

      setIncorrectCount(count || 0);
      setLoading(false);
    };

    fetchIncorrectCount();
  }, []);

  const handleClick = () => {
    router.push("/incorrect");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">要復習の問題</h2>
      <p className="text-gray-600 mb-4">
        現在 {incorrectCount} 問の復習が必要です
      </p>
      <button
        onClick={handleClick}
        className="text-indigo-600 hover:text-indigo-800 font-medium"
      >
        マイ英文リストを見る →
      </button>
    </div>
  );
}
