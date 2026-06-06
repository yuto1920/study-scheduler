import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";
import { generateQuiz } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { courseId, userId } = await req.json();

    if (!courseId || !userId) {
      return NextResponse.json({ error: "courseId and userId are required" }, { status: 400 });
    }

    const supabase = supabaseService();

    // 2. このコースに紐づくすべてのノートを取得
    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select("content")
      .eq("course_id", courseId)
      .eq("user_id", userId);

    if (notesError || !notes || notes.length === 0) {
      return NextResponse.json({ error: "ノートが見つかりません。先に資料をアップロードしてください。" }, { status: 404 });
    }

    // 3. 各ノートから要約部分（TL;DR など最初の数百文字程度）を抽出して配列にする
    // Geminiに長大なテキストを送りすぎないための工夫
    const summaries = notes.map((note) => {
      // "## TL;DR" から "## 重要なキーワードと解説" までの部分を抽出する簡易的なロジック
      // または単に先頭1000文字を切り取るだけでも良い
      const content = note.content;
      const tldrMatch = content.match(/## TL;DR[\s\S]*?(?=## 重要なキーワードと解説|## 学習の要点|$)/i);
      
      if (tldrMatch) {
        return tldrMatch[0].trim();
      }
      return content.substring(0, 1000) + "...";
    });

    // 4. クイズを生成
    const quizJson = await generateQuiz(summaries);

    if (!quizJson || quizJson.length === 0) {
      return NextResponse.json({ error: "クイズの生成に失敗しました" }, { status: 500 });
    }

    // 5. DBに保存 (quizzes テーブル)
    const { data: savedQuiz, error: insertError } = await supabase
      .from("quizzes")
      .insert({
        user_id: userId,
        course_id: courseId,
        quiz: quizJson,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: `クイズの保存に失敗: ${insertError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, quizId: savedQuiz.id });
  } catch (error: any) {
    console.error("Generate Quiz Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
