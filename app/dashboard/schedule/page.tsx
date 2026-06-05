"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Download, FileUp, Clock } from "lucide-react";

export default function SchedulePage() {
  const [status, setStatus] = useState("");
  // モックのスケジュールデータ
  const [schedulePlan] = useState([
    { day: "月曜日", topic: "第1回 ソフトウェア工学概論", duration: "1.5時間" },
    { day: "水曜日", topic: "第2回 要件定義とモデリング", duration: "2時間" },
    { day: "金曜日", topic: "小テスト準備・復習", duration: "1時間" },
  ]);

  const handleGoogleCalendarAuth = async () => {
    setStatus("Googleにリダイレクトしています...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar.readonly",
        redirectTo: `${window.location.origin}/dashboard/schedule`
      },
    });

    if (error) {
      setStatus(`エラー: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      
      {/* 連携モジュール */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg dark:bg-black/40 p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Calendar className="text-blue-500" />
          授業スケジュールのインポート
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          学習プランを生成するために、あなたの授業や試験のスケジュールを取り込みます。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition bg-white/50 dark:bg-gray-800/50">
            <h2 className="text-lg font-semibold mb-2">Google カレンダー</h2>
            <p className="text-sm text-gray-500 mb-4">アカウントと連携して自動取得します。</p>
            <button
              onClick={handleGoogleCalendarAuth}
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Googleで連携する
            </button>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white/50 dark:bg-gray-800/50 opacity-60">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><FileUp className="w-5 h-5"/> 手動アップロード</h2>
            <p className="text-sm text-gray-500 mb-4">.ics / CSV ファイルを手動でアップロードします。</p>
            <button disabled className="w-full bg-gray-200 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
              準備中
            </button>
          </div>
        </div>
        {status && <p className="mt-4 text-sm font-medium text-blue-600">{status}</p>}
      </div>

      {/* AI生成スケジュール表示 */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg dark:bg-black/40 p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
          今週の学習プラン (AI生成)
        </h2>
        
        <div className="space-y-4">
          {schedulePlan.map((plan, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 text-center font-bold text-indigo-600 dark:text-indigo-400">
                  {plan.day}
                </div>
                <div className="text-gray-800 dark:text-gray-200 font-medium">
                  {plan.topic}
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                {plan.duration}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
