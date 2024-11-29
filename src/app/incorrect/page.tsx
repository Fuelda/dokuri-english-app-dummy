import { IncorrectList } from "@/components/incorrect-list";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function IncorrectListPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => window.history.back()}
            className="text-gray-700"
          >
            ← 戻る
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">復習が必要な問題</h1>
            <p className="text-gray-600 mt-2">
              まだ完全に聞き取れていない問題の一覧です
            </p>
          </div>

          <IncorrectList userId={session.user.id} />
        </div>
      </main>
    </div>
  );
}
