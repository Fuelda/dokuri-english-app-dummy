import { AddSentenceForm } from "../../../components/add-sentence-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AddSentencePage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">英文を追加</h1>
          <p className="text-gray-600 mt-2">学習したい英文を追加してください</p>
        </div>

        <AddSentenceForm />
      </div>
    </main>
  );
}
