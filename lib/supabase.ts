import { createClient } from "@supabase/supabase-js";

// 環境変数が設定されていない場合はダミーを入れてビルドが通るようにする（本番稼働には設定必須）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// サーバーサイド（API Route等）専用クライアント
// service_role キーを使ってRLSをバイパスする処理用
export const supabaseService = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is not defined.");
  }
  return createClient(supabaseUrl, serviceKey || "placeholder-service-key");
};
