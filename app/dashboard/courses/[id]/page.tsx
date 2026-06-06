"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Book, FileText, BrainCircuit, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Note = {
  id: string;
  content: string;
  created_at: string;
  uploads: {
    file_name: string;
  };
};

type Course = {
  id: string;
  title: string;
};

import { use } from "react";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.id;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [quizStatus, setQuizStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCourseAndNotes();
  }, [courseId]);

  const fetchCourseAndNotes = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setLoading(false);
      return;
    }

    // コース情報の取得
    const { data: courseData } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();
    
    if (courseData) setCourse(courseData);

    // このコースに紐づくノートの取得
    const { data: notesData } = await supabase
      .from("notes")
      .select("*, uploads(file_name)")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false });

    if (notesData) setNotes(notesData as any);
    
    setLoading(false);
  };

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    setQuizStatus("idle");
    setErrorMessage("");

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Unauthorized");

      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          courseId: courseId,
          userId: userData.user.id
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "テスト生成に失敗しました");
      }

      setQuizStatus("success");
      // 成功したらテスト画面に飛ばすか、メッセージを出す
      setTimeout(() => {
        router.push("/dashboard/quiz");
      }, 2000);
    } catch (error: any) {
      setQuizStatus("error");
      setErrorMessage(error.message);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  if (loading) return <div className="p-8 text-center">読み込み中...</div>;
  if (!course) return <div className="p-8 text-center text-red-500">授業が見つかりません</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <Link href="/dashboard/courses" className="inline-flex items-center text-indigo-500 hover:text-indigo-600 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4 mr-1" />
        授業一覧に戻る
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Book className="text-indigo-500" />
          {course.title}
        </h1>
        <button
          onClick={handleGenerateQuiz}
          disabled={generatingQuiz || notes.length === 0}
          className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          <BrainCircuit className="w-5 h-5" />
          {generatingQuiz ? "AIがテストを作成中..." : "この授業の確認テストを作成"}
        </button>
      </div>

      {quizStatus === "success" && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>テストの生成が完了しました！テスト画面に移動します...</span>
        </div>
      )}

      {quizStatus === "error" && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">登録されている資料・ノート</h2>
          <Link href="/dashboard/upload" className="text-indigo-500 hover:text-indigo-600 font-medium text-sm border border-indigo-200 dark:border-indigo-800 px-4 py-2 rounded-lg">
            資料を追加する
          </Link>
        </div>

        {notes.length === 0 ? (
          <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
            まだこの授業に資料がありません。「資料を追加する」からアップロードしてください。
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-indigo-400" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{note.uploads?.file_name || "Unknown File"}</h3>
                    <p className="text-xs text-gray-500">{new Date(note.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Link href="/dashboard/notes" className="text-sm font-medium text-gray-500 hover:text-indigo-500 transition">
                  ノートを見る
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
