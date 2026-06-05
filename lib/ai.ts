import OpenAI from "openai";

export const frontier = new OpenAI({
  apiKey: process.env.FRONTIER_API_KEY,
  baseURL: "https://api.frontier.ai/v1",
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
  const response = await frontier.chat.completions.create({
    model: "frontier-gpt-4o-lite",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });
  return response.choices[0]?.message?.content?.trim() ?? "";
}

/**
 * 与えられた教材テキストから 5-10 個の多肢選択問題を生成
 */
export async function generateQuiz(lectureText: string): Promise<any[]> {
  const prompt = `
Create 5-10 multiple-choice questions (A-D) from the following lecture text.
For each question also provide the correct answer and three plausible distractors.
Return a JSON array:
[{ "question": "...", "options": ["A", "B", "C", "D"], "answer": "B" }, …]
---
Lecture text:
${lectureText}
`;
  const response = await frontier.chat.completions.create({
    model: "frontier-gpt-4o-lite",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });
  const json = response.choices[0]?.message?.content?.trim();
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
${lectureText.substring(0, 15000)} // トークン制限対策のため一部カット
`;

  const response = await frontier.chat.completions.create({
    model: "frontier-gpt-4o-lite",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2, // ハルシネーションを防ぐため低め
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}
