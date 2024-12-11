import { IncorrectList } from "@/components/incorrect-list";
import { UserSentencesList } from "@/components/user-sentences-list";
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
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-8">
        <section>
          <h1 className="text-2xl font-bold">復習が必要な問題</h1>
          <p className="text-gray-600 mt-2">
            まだ完全に聞き取れていない問題の一覧です
          </p>
          <div className="mt-4">
            <IncorrectList userId={session.user.id} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">登録した英文</h2>
          <p className="text-gray-600 mt-2">あなたが登録した英文の一覧です</p>
          <div className="mt-4">
            <UserSentencesList userId={session.user.id} />
          </div>
        </section>
      </div>
    </main>
  );
}
