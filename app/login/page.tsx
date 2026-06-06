"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard/upload`,
        // カレンダー連携用にスコープを追加（必要に応じて）
        scopes: "https://www.googleapis.com/auth/calendar.readonly",
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Study Scheduler
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            AI学習アシスタントを始めましょう
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-bold py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition disabled:opacity-50"
        >
          {loading ? (
            "リダイレクト中..."
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.72 18.23 13.47 18.63 12 18.63C9.15 18.63 6.74 16.71 5.86 14.12H2.18V16.96C3.99 20.53 7.7 23 12 23Z" fill="#34A853"/>
                <path d="M5.86 14.12C5.63 13.46 5.5 12.75 5.5 12C5.5 11.25 5.63 10.54 5.86 9.88V7.04H2.18C1.43 8.51 1 10.2 1 12C1 13.8 1.43 15.49 2.18 16.96L5.86 14.12Z" fill="#FBBC05"/>
                <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.35 3.87C17.45 2.1 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.04L5.86 9.88C6.74 7.29 9.15 5.38 12 5.38Z" fill="#EA4335"/>
              </svg>
              Google でログイン
            </>
          )}
        </button>

        {errorMsg && (
          <p className="mt-4 text-center text-sm text-red-500">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
