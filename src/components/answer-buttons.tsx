"use client";

import { AnswerResult } from "@/types";

interface AnswerButtonsProps {
  onAnswer: (result: AnswerResult) => void;
  disabled?: boolean;
}

export function AnswerButtons({ onAnswer, disabled }: AnswerButtonsProps) {
  return (
    <div className="grid gap-4">
      <button
        onClick={() => onAnswer(1)}
        disabled={disabled}
        className="w-full py-3 px-4 rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
      >
        もう一度
      </button>

      <button
        onClick={() => onAnswer(2)}
        disabled={disabled}
        className="w-full py-3 px-4 rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 transition-colors"
      >
        微妙
      </button>

      <button
        onClick={() => onAnswer(3)}
        disabled={disabled}
        className="w-full py-3 px-4 rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
      >
        聞き取れた
      </button>
    </div>
  );
}
