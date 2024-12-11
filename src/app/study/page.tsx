import { StudySession } from "@/components/study-session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ mode?: string }>;
}

export default async function StudyPage({ searchParams }: PageProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const params = await searchParams;
  const mode = params.mode;
  if (!mode || !["new", "review", "mixed"].includes(mode)) {
    redirect("/");
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <StudySession
          mode={mode as "new" | "review" | "mixed"}
          userId={user.id}
        />
      </div>
    </main>
  );
}
