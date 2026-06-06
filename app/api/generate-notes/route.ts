import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";
import { generateNotes } from "@/lib/ai";
import PDFParser from "pdf2json";

// PDFのバッファからテキストを抽出するヘルパー関数
function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // pdf2jsonの初期化 (needRawText = 1 を指定してテキストのみ抽出)
    const pdfParser = new PDFParser(null, true);
    
    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(errData.parserError);
    });
    
    pdfParser.on("pdfParser_dataReady", () => {
      // 抽出した生テキストを取得
      const rawText = pdfParser.getRawTextContent();
      resolve(rawText);
    });
    
    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const { uploadId, filePath, userId, courseId } = await req.json();

    if (!uploadId || !filePath || !userId || !courseId) {
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

    // 2. pdf2json でテキスト抽出
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let extractedText = "";
    try {
      extractedText = await extractTextFromPDF(buffer);
    } catch (parseErr: any) {
      console.error("PDF Parsing Error:", parseErr);
      return NextResponse.json({ error: `Failed to parse PDF file: ${parseErr.message || String(parseErr)}` }, { status: 500 });
    }

    if (!extractedText || extractedText.trim() === "") {
      return NextResponse.json({ error: "No text could be extracted from the PDF" }, { status: 400 });
    }

    // 3. AI でノートを生成
    const generatedNotes = await generateNotes(extractedText);

    // 4. DB (notes テーブル) に保存
    const { error: insertError } = await supabase.from("notes").insert({
      user_id: userId,
      upload_id: uploadId,
      course_id: courseId,
      content: generatedNotes,
    });

    if (insertError) {
      return NextResponse.json({ error: `Failed to save notes: ${insertError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, notes: generatedNotes });
  } catch (error: any) {
    console.error("Generate Notes Error:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
