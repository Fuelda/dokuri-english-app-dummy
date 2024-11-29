import { StudyStartCard } from "@/components/study-start-card";
import { IncorrectListSummary } from "@/components/incorrect-list-summary";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">英語リスニング練習</h1>
            <p className="text-gray-600 mt-2">学習を始めましょう</p>
          </div>

          <div className="grid gap-6">
            <StudyStartCard />
            <IncorrectListSummary />
          </div>
        </div>
      </main>
    </div>
  );
}
