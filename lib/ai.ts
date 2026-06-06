import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.FRONTIER_API_KEY,
});

/**
 * 生成されたスケジュール（週単位）を返す
 * @param lectureTexts すべての授業資料から抽出したテキスト配列
 * @param calendarEvents カレンダーから取得したイベント配列
 */
export async function generateStudyPlan(
  lectureTexts: string[],
  calendarEvents: any[]
): Promise<string> {
  const prompt = `
You are an academic planner. 
Given the following lecture texts (concatenated) and the student's class schedule, 
produce a weekly study plan (hours per day) that covers the material before each exam.
Use a concise bullet list, include suggested break times, and keep total weekly study time <= 15h.
Return ONLY the plan in plain text.
---
Lecture texts:
${lectureTexts.join("\n---\n")}
---
Class schedule (ISO 8601):
${JSON.stringify(calendarEvents, null, 2)}
`;
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      temperature: 0.3,
    },
  });
  return response.text?.trim() ?? "";
}

/**
 * 与えられた複数教材テキスト（要約）から 5-10 個の多肢選択問題を生成
 */
export async function generateQuiz(lectureTexts: string[]): Promise<any[]> {
  const prompt = `
以下の複数の授業資料の要約テキストをもとに、5〜10問の多肢選択問題（4択）を日本語で作成してください。
それぞれの問題には、具体的なテキストによる正解の選択肢と、もっともらしい不正解の選択肢3つを含めてください。
「A」や「B」のような記号ではなく、選択肢そのものの内容（テキスト）を含めてください。
結果は以下のJSON配列形式のみで出力してください（マークダウンのコードブロックは不要です）:
[{ "question": "問題文...", "options": ["選択肢のテキスト1", "選択肢のテキスト2", "選択肢のテキスト3", "選択肢のテキスト4"], "answer": "正解の選択肢のテキスト（optionsの中に含まれるものと完全一致）" }, ...]
---
授業要約データ:
${lectureTexts.join("\n\n---\n\n")}
`;
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  });
  const json = response.text?.trim();
  return JSON.parse(json || "[]");
}

/**
 * 抽出されたPDFテキストから、コーネル式＋トグルリスト向けのマークダウンノートを生成
 */
export async function generateNotes(lectureText: string): Promise<string> {
  const prompt = `
あなたは専門的な学術研究アシスタントです。提供された【文献テキスト】を分析し、ハルシネーションのない正確な構造化ノートをマークダウン形式で作成してください。

# 制約条件（厳守）
1. 根拠の限定: 回答は必ず提供された【文献テキスト】のみに基づき、推測や一般論は含めないでください。
2. 箇条書きの徹底: 文脈の理解を促すため、詳細な説明は箇条書きを活用してください。
3. コーネル式・トグルリスト用構造: 学習者が「キーワードから答えを思い出す」学習ができるよう、以下の出力フォーマットに厳密に従ってください。
4. プレーンテキストの使用: 数式や記号に LaTeX（$K-1$ のような $ 記号による囲み）を使用せず、必ず自然なプレーンテキストで出力してください。

# 出力フォーマット
## TL;DR
（講義や資料の核心的な要約を2〜3文で）

## 重要なキーワードと解説
（重要語句をヘッダーにし、その解説を箇条書きで記載。UI側でトグルリストとして表示されます）
### [キーワード1]
- [解説ポイント1]
- [解説ポイント2]

### [キーワード2]
- [解説ポイント1]

## 学習の要点・サマリー
（全体を通した本質的な理解ポイントや、試験で問われやすい論理構造のまとめ）

# 文献テキスト
${lectureText.substring(0, 3000)} // 無料枠のトークン制限（429エラー）を回避するため、最初の3000文字のみ抽出
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      temperature: 0.2, // ハルシネーションを防ぐため低め
    },
  });

  return response.text?.trim() ?? "";
}
