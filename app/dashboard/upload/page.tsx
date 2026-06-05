"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setErrorMessage("");
    
    // 1. Storageにアップロード
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { data, error } = await supabase.storage
      .from("lecture-materials")
      .upload(filePath, file, {
        upsert: false,
        cacheControl: "3600",
        contentType: file.type,
      });

    if (error) {
      setStatus("error");
      setErrorMessage(`アップロードエラー: ${error.message}`);
      return;
    }

    // 2. DBに参照を保存
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    const { data: uploadData, error: dbErr } = await supabase.from("uploads").insert({
      user_id: userId,
      file_path: data?.path,
      file_name: file.name,
    }).select().single();

    if (dbErr || !uploadData) {
      setStatus("error");
      setErrorMessage(`データベース保存エラー: ${dbErr?.message}`);
      return;
    }

    // 3. APIを呼び出してノート生成
    setStatus("generating_notes");
    try {
      const res = await fetch("/api/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadId: uploadData.id,
          filePath: data.path,
          userId: userId,
        }),
      });

      if (!res.ok) {
        throw new Error("ノート生成APIエラー");
      }

      setStatus("success");
      setFile(null);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(`ノート生成に失敗しました: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl dark:bg-black/40">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <UploadCloud className="text-indigo-500" />
        授業資料のアップロード
      </h1>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition">
        <input
          type="file"
          id="file-upload"
          accept=".pdf,.ppt,.pptx,.txt"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <FileText className="w-12 h-12 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-300 font-medium">
            {file ? file.name : "クリックしてファイルを選択 (PDF, PPTX, TXT)"}
          </span>
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || status === "uploading" || status === "generating_notes"}
        className="mt-6 w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "uploading" ? "ファイルをアップロード中..." : 
         status === "generating_notes" ? "AIがノートを生成中（数分かかる場合があります）..." : 
         "アップロードしてAIノート生成"}
      </button>

      {status === "success" && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>生成が完了しました！サイドバーの「学習ノート」から確認してください。</span>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
