import { geminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { question, notes } = await req.json();

  const prompt = `
You are a tutor.
Answer the question ONLY using the notes below.

NOTES:
${notes}

QUESTION:
${question}
`;

  const result = await geminiModel.generateContent(prompt);
  const answer = result.response.text();

  return NextResponse.json({ answer });
}
