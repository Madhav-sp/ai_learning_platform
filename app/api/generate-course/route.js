import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "../../../models/Course";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      userId,
      title,
      description,
      difficulty,
      includeVideos,
      chaptersCount,
      category,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    // --- CALL GEMINI ---
    const prompt = `
You are an expert course creator AI. Create a complete course with:
Topic: ${title}
Difficulty: ${difficulty}
Chapters required: ${chaptersCount}

For each chapter:
- Give chapter title
- Duration (like 45 minutes)
- List 3–5 topics

For each topic:
- Write explanation content
- Generate 2 flashcards
- Generate 1 quiz question with options and answer
${includeVideos ? "- Suggest YouTube video titles" : ""}

Return clean JSON.
`;

    // Replace with real Gemini call later
    const fakeAIResponse = {
      chapters: [
        {
          chapterTitle: "Introduction to " + title,
          duration: "1 hour",
          topics: [
            {
              title: "What is " + title + "?",
              content: "Explanation about the technology...",
              videoUrls: [],
              flashcards: [
                {
                  question: "What is " + title + "?",
                  answer: "A JS framework...",
                },
              ],
              quiz: [
                {
                  question: "Why use " + title + "?",
                  options: ["Fast", "Slow", "Old"],
                  answer: "Fast",
                },
              ],
            },
          ],
        },
      ],
    };

    // --- SAVE COURSE IN DB ---
    const newCourse = await Course.create({
      userId,
      title,
      description,
      difficulty,
      includeVideos,
      category,
      chapters: fakeAIResponse.chapters,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course generated successfully",
        courseId: newCourse._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Generate Course Error:", error);
    return NextResponse.json(
      { error: "Failed to generate course" },
      { status: 500 }
    );
  }
}
