"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StudyMode } from "@/types";

export function StudyStartCard() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<StudyMode>("new");

  const handleStartStudy = () => {
    router.push(`/study?mode=${selectedMode}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">学習を始める</h2>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="mode-new"
            name="study-mode"
            value="new"
            checked={selectedMode === "new"}
            onChange={(e) => setSelectedMode(e.target.value as StudyMode)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="mode-new"
            className="text-sm font-medium text-gray-700"
          >
            新規学習
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="mode-review"
            name="study-mode"
            value="review"
            checked={selectedMode === "review"}
            onChange={(e) => setSelectedMode(e.target.value as StudyMode)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="mode-review"
            className="text-sm font-medium text-gray-700"
          >
            復習
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="mode-mixed"
            name="study-mode"
            value="mixed"
            checked={selectedMode === "mixed"}
            onChange={(e) => setSelectedMode(e.target.value as StudyMode)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="mode-mixed"
            className="text-sm font-medium text-gray-700"
          >
            ミックスモード
          </label>
        </div>

        <button
          onClick={handleStartStudy}
          className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          学習を開始
        </button>
      </div>
    </div>
  );
}
