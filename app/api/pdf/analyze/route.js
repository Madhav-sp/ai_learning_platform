import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || text.length < 200) {
      return NextResponse.json(
        { error: "Text too short to analyze" },
        { status: 400 }
      );
    }

    const prompt = `
You are an AI tutor.

From the following content:
1. Create short notes with headings
2. Explain concepts in very simple words
3. Create 2-4 flashcards (question & answer)
4. Give a concise summary

Return ONLY valid JSON in this format:
{
  "summary": "",
  "notes": "",
  "easyExplanation": "",
  "flashcards": [
    { "question": "", "answer": "" }
  ]
}

CONTENT:
${text}
`;

    const result = await geminiModel.generateContent(prompt);
    let responseText = result.response.text();

    // Clean markdown if Gemini adds it
    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (err) {
    console.error("GEMINI ERROR:", err);
    return NextResponse.json(
      { error: "Gemini analysis failed", details: err.message },
      { status: 500 }
    );
  }
}
