"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BookOpen, ChevronDown, ChevronRight, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Note = {
  id: string;
  upload_id: string;
  content: string;
  created_at: string;
  uploads: {
    file_name: string;
  };
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      // Supabase で関連テーブル (uploads) と結合して取得
      const { data, error } = await supabase
        .from("notes")
        .select("*, uploads(file_name)")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotes(data as any);
      }
      setLoading(false);
    };

    fetchNotes();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">ノートを読み込み中...</div>;
  }

  if (notes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        まだ学習ノートがありません。授業資料をアップロードしてください。
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <BookOpen className="text-indigo-500" />
        学習ノート
      </h1>

      <div className="space-y-8">
        {notes.map((note) => (
          <div key={note.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <FileText className="w-5 h-5" />
              {note.uploads?.file_name || "Unknown File"}
              <span className="text-xs font-normal text-gray-400 ml-auto">
                {new Date(note.created_at).toLocaleDateString()}
              </span>
            </h2>

            {/* Markdown をそのままレンダリング。将来的にカスタムコンポーネントでh3をトグル化する等の拡張が可能 */}
            <div className="prose prose-indigo dark:prose-invert max-w-none">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
