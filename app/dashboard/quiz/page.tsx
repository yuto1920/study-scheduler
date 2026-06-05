"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BookOpen, CheckCircle, XCircle } from "lucide-react";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // ダミーデータまたはDBからの取得シミュレーション
  useEffect(() => {
    // 実際には supabase から未回答のクイズを取得します
    const fetchQuizzes = async () => {
      // モックデータ（本来はAIが生成したものをDBからフェッチする）
      setQuestions([
        {
          question: "Reactフックのルールとして正しいものはどれですか？",
          options: [
            "クラスコンポーネント内でのみ呼び出す",
            "関数のトップレベルでのみ呼び出す",
            "ループの中でのみ呼び出す",
            "条件分岐の中でのみ呼び出す"
          ],
          answer: "関数のトップレベルでのみ呼び出す"
        },
        {
          question: "Next.js 13以降で導入されたルーティングシステムは何ですか？",
          options: ["Pages Router", "App Router", "Vue Router", "React Router"],
          answer: "App Router"
        }
      ]);
    };
    fetchQuizzes();
  }, []);

  const currentQ = questions[currentIdx];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIdx(currentIdx + 1);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        問題をロード中、またはAIが作成中です...
      </div>
    );
  }

  if (currentIdx >= questions.length) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10 text-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl dark:bg-black/40">
        <h1 className="text-3xl font-bold mb-4">テスト終了！</h1>
        <p className="text-xl mb-6">
          正解数: {score} / {questions.length}
        </p>
        <button
          onClick={() => {
            setCurrentIdx(0);
            setScore(0);
            setIsAnswered(false);
            setSelectedOption(null);
          }}
          className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition"
        >
          もう一度やり直す
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl dark:bg-black/40">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <BookOpen className="text-indigo-500" />
          確認テスト
        </h1>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          問題 {currentIdx + 1} / {questions.length}
        </span>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
          {currentQ.question}
        </h2>
      </div>

      <div className="space-y-3">
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === currentQ.answer;

          let btnClass = "border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20";
          
          if (isAnswered) {
            if (isCorrect) {
              btnClass = "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400";
            } else if (isSelected && !isCorrect) {
              btnClass = "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
            } else {
              btnClass = "border-gray-200 dark:border-gray-700 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center justify-between ${btnClass}`}
            >
              <span>{option}</span>
              {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            className="bg-gray-800 dark:bg-gray-200 text-white dark:text-black font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition"
          >
            {currentIdx === questions.length - 1 ? "結果を見る" : "次の問題へ"}
          </button>
        </div>
      )}
    </div>
  );
}
