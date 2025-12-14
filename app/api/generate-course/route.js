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

    /* =========================
       AI PROMPT
    ========================= */
 const prompt = `
You are an expert computer science instructor and curriculum designer.

Your task is to generate a HIGH-QUALITY, LEARNING-ORIENTED programming course
similar to GeeksforGeeks, W3Schools, or university lecture notes.

STRICT RULES (VERY IMPORTANT):
1. Each chapter MUST contain 4 to 6 topics.
2. Each topic MUST be detailed and beginner-friendly.
3. Each topic MUST have multiple sections.
4. Content must be EXPLANATORY, not short notes.
5. Avoid one-line explanations.
6. Teach concepts step-by-step.

Course Details:
Title: ${title}
Description: ${description}
Difficulty: ${difficulty}
Category: ${category}
Number of Chapters: ${chaptersCount}

JSON FORMAT (NO MARKDOWN, NO EXTRA TEXT):

{
  "chapters": [
    {
      "chapterTitle": "string",
      "duration": "string",
      "topics": [
        {
          "title": "string",

          "content": [
            { "type": "heading", "text": "Introduction" },
            { "type": "text", "text": "Explain the concept in 4–6 sentences." },

            { "type": "heading", "text": "Why This Concept Is Important" },
            { "type": "list", "items": ["point 1", "point 2", "point 3"] },

            { "type": "heading", "text": "Syntax and Explanation" },
            { "type": "text", "text": "Explain syntax in detail." },

            { "type": "heading", "text": "Example" },
            {
              "type": "code",
              "language": "python",
              "code": "Provide a clear example code."
            },

            { "type": "heading", "text": "Output" },
            {
              "type": "output",
              "text": "Show expected output."
            },

            { "type": "heading", "text": "Key Takeaways" },
            {
              "type": "list",
              "items": ["summary point 1", "summary point 2"]
            }
          ],

          "flashcards": [
            { "question": "Concept-based question", "answer": "Clear answer" },
            { "question": "Why question", "answer": "Explanation answer" }
          ],

          "quiz": [
            {
              "question": "Conceptual MCQ question",
              "options": ["A", "B", "C", "D"],
              "correctAnswer": "A"
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
      temperature: 0.5,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let aiData;
    try {
      aiData = JSON.parse(cleaned);
    } catch (error) {
      return NextResponse.json(
        {
          error: "AI returned invalid JSON",
          raw: cleaned.slice(0, 600),
        },
        { status: 500 }
      );
    }

    if (!Array.isArray(aiData.chapters)) {
      return NextResponse.json(
        { error: "Invalid course structure" },
        { status: 500 }
      );
    }

    /* =========================
       SAVE COURSE
    ========================= */
    const course = await Course.create({
      userId,
      title,
      description,
      difficulty,
      includeVideos,
      category,
      chapters: aiData.chapters,
    });

    return NextResponse.json(
      { success: true, courseId: course._id },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error: "Failed to generate course",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
