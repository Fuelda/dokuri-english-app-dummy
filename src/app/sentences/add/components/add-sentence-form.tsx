"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function AddSentenceForm() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Current user:", user);

      if (!user) {
        throw new Error("認証されていません");
      }

      const { data, error: insertError } = await supabase
        .from("user_sentences")
        .insert([
          {
            user_id: user.id,
            content: content.trim(),
            is_active: true,
          },
        ])
        .select();

      console.log("Insert response:", { data, error: insertError });

      if (insertError) throw insertError;

      setContent("");
      setSuccessMessage("英文を追加しました");
    } catch (err) {
      console.error("Error details:", err);
      setError(err instanceof Error ? err.message : "英文の追加に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-md min-h-[100px] focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="例: This is a sample sentence."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? "追加中..." : "追加する"}
        </button>
      </form>
    </div>
  );
}
