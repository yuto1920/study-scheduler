import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";
import { generateNotes } from "@/lib/ai";
import pdfParse from "pdf-parse";

export async function POST(req: Request) {
  try {
    const { uploadId, filePath, userId } = await req.json();

    if (!uploadId || !filePath || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Supabase Storage から PDF ファイルをダウンロード
    const supabase = supabaseService();
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("lecture-materials")
      .download(filePath);

    if (downloadError || !fileData) {
      return NextResponse.json({ error: `Failed to download file: ${downloadError?.message}` }, { status: 500 });
    }

    // 2. pdf-parse でテキスト抽出
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim() === "") {
      return NextResponse.json({ error: "No text could be extracted from the PDF" }, { status: 400 });
    }

    // 3. AI でノートを生成
    const generatedNotes = await generateNotes(extractedText);

    // 4. DB (notes テーブル) に保存
    const { error: insertError } = await supabase.from("notes").insert({
      user_id: userId,
      upload_id: uploadId,
      content: generatedNotes,
    });

    if (insertError) {
      return NextResponse.json({ error: `Failed to save notes: ${insertError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, notes: generatedNotes });
  } catch (error: any) {
    console.error("Generate Notes Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
