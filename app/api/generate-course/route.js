import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    await connectDB();
    const {
      userId,
      title,
      description,
      difficulty,
      includeVideos,
      chaptersCount,
      category,
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    const prompt = `
You are an expert course creator AI.

Generate a COMPLETE course in VALID JSON ONLY.
NO markdown. NO explanations.

Course Title: ${title}
Description: ${description}
Difficulty: ${difficulty}
Category: ${category}
Number of Chapters: ${chaptersCount}

FORMAT:
{
  "chapters": [
    {
      "chapterTitle": "string",
      "duration": "string",
      "topics": [
        {
          "title": "string",
          "content": "200-300 words",
          "videoUrls": ${
            includeVideos ? '["youtube search 1", "youtube search 2"]' : "[]"
          },
          "flashcards": [
            { "question": "string", "answer": "string" },
            { "question": "string", "answer": "string" }
          ],
          "quiz": [
            {
              "question": "string",
              "options": ["A", "B", "C", "D"],
              "answer": "A"
            }
          ]
        }
      ]
    }
  ]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let aiData;
    try {
      aiData = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw: cleaned.slice(0, 500) },
        { status: 500 }
      );
    }

    if (!Array.isArray(aiData.chapters)) {
      return NextResponse.json(
        { error: "Invalid course structure" },
        { status: 500 }
      );
    }

    const course = await Course.create({
      userId,
      title,
      description,
      difficulty,
      includeVideos,
      category,
      chapters: aiData.chapters,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true, courseId: course._id },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate course", details: err.message },
      { status: 500 }
    );
  }
}
