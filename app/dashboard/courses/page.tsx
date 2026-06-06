"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Book, Plus, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

type Course = {
  id: string;
  title: string;
  created_at: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });
      if (data) setCourses(data);
    }
    setLoading(false);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data, error } = await supabase
        .from("courses")
        .insert({ user_id: userData.user.id, title: newTitle.trim() })
        .select()
        .single();
      
      if (data && !error) {
        setCourses([data, ...courses]);
        setNewTitle("");
      }
    }
    setCreating(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Book className="text-indigo-500" />
          授業（Course）管理
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">新しい授業を追加</h2>
        <form onSubmit={handleCreateCourse} className="flex gap-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="例: 微分積分学 第1部"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition"
            disabled={creating}
          />
          <button
            type="submit"
            disabled={!newTitle.trim() || creating}
            className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            追加
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">読み込み中...</div>
      ) : courses.length === 0 ? (
        <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
          まだ授業が登録されていません。上のフォームから追加してください。
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-500 transition group cursor-pointer">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <BookOpen className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition" />
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  作成日: {new Date(course.created_at).toLocaleDateString()}
                </p>
                <div className="flex items-center text-indigo-500 font-medium text-sm">
                  詳細を見る <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
