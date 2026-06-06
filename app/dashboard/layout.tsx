import Link from "next/link";
import { Book, BookOpen, Calendar, Settings, UploadCloud } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 flex flex-col">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Study Scheduler
          </h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/dashboard/courses" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <Book className="w-5 h-5" />
            授業（コース）管理
          </Link>
          <Link href="/dashboard/upload" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <UploadCloud className="w-5 h-5" />
            資料アップロード
          </Link>
          <Link href="/dashboard/notes" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <BookOpen className="w-5 h-5" />
            学習ノート
          </Link>
          <Link href="/dashboard/schedule" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <Calendar className="w-5 h-5" />
            スケジュール連携
          </Link>
          <Link href="/dashboard/quiz" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <BookOpen className="w-5 h-5" />
            確認テスト (Quiz)
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <Settings className="w-5 h-5" />
            設定
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
