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
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setFetchError("User not logged in");
        return;
      }

      const { data, error } = await supabase
        .from("quizzes")
        .select("quiz, course_id")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        setFetchError(`Supabase Error: ${error.message}`);
        console.error("fetchQuizzes error:", error);
        return;
      }

      if (data && data.length > 0) {
        if (Array.isArray(data[0].quiz) && data[0].quiz.length > 0) {
          // 選択肢の順序をランダム化する
          const shuffledQuiz = data[0].quiz.map((q: Question) => ({
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5)
          }));
          setQuestions(shuffledQuiz);
        } else {
          setFetchError(`Quiz data is empty or invalid: ${JSON.stringify(data[0].quiz)}`);
        }
      } else {
        setFetchError("テストが一つも生成されていません。授業詳細画面から「確認テストを作成」を実行してください。");
      }
    };
    fetchQuizzes();
  }, []);

  const currentQ = questions[currentIdx];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const newAnswers = [...userAnswers];
    newAnswers[currentIdx] = option;
    setUserAnswers(newAnswers);

    if (option === currentQ.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIdx(currentIdx + 1);
  };

  if (fetchError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 flex-col p-8 text-center gap-4">
        <XCircle className="w-12 h-12" />
        <p className="font-semibold text-lg">{fetchError}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        問題をロード中、またはAIが作成中です...
      </div>
    );
  }

  if (currentIdx >= questions.length) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-10 text-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl dark:bg-black/40">
        <h1 className="text-3xl font-bold mb-4">テスト終了！</h1>
        <p className="text-2xl font-semibold mb-8 text-indigo-600 dark:text-indigo-400">
          正解数: {score} / {questions.length}
        </p>

        <div className="text-left space-y-6 mb-10 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">結果の振り返り</h2>
          {questions.map((q, idx) => {
            const isCorrect = userAnswers[idx] === q.answer;
            return (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <p className="font-semibold mb-3 flex items-start gap-2">
                  <span className="shrink-0 mt-1">
                    {isCorrect ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                  </span>
                  <span>Q{idx + 1}. {q.question}</span>
                </p>
                <div className="ml-7 space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    あなたの回答: <span className={`font-medium ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{userAnswers[idx] || "未回答"}</span>
                  </p>
                  {!isCorrect && (
                    <p className="text-gray-600 dark:text-gray-400">
                      正解: <span className="font-medium text-green-600 dark:text-green-400">{q.answer}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            // 問題の順番や選択肢をシャッフルし直す
            const shuffledQuiz = questions.map((q: Question) => ({
              ...q,
              options: [...q.options].sort(() => Math.random() - 0.5)
            }));
            setQuestions(shuffledQuiz);
            setCurrentIdx(0);
            setScore(0);
            setIsAnswered(false);
            setSelectedOption(null);
            setUserAnswers([]);
          }}
          className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-indigo-700 transition shadow-lg"
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
              btnClass = "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold";
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
              {isAnswered && isCorrect && <CheckCircle className="w-6 h-6 text-green-500" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            className="bg-gray-800 dark:bg-gray-200 text-white dark:text-black font-semibold py-3 px-8 rounded-xl hover:opacity-90 transition shadow-lg"
          >
            {currentIdx === questions.length - 1 ? "結果を見る" : "次の問題へ"}
          </button>
        </div>
      )}
    </div>
  );
}
