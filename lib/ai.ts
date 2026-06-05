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
