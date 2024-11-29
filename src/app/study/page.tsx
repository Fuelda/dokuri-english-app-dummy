import { StudySession } from "@/components/study-session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function StudyPage({
  searchParams,
}: {
  searchParams: { mode?: string };
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // モードのバリデーション
  const mode = searchParams.mode;
  if (!mode || !["new", "review", "mixed"].includes(mode)) {
    redirect("/");
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <StudySession
          mode={mode as "new" | "review" | "mixed"}
          userId={session.user.id}
        />
      </div>
    </main>
  );
}
