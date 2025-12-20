// app/api/course/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    await connectDB();

    // fetch full chapters ONLY to compute totals
    const courses = await Course.find({ userId })
      .select("_id title difficulty createdAt chapters")
      .sort({ createdAt: -1 })
      .lean();

    const enrichedCourses = courses.map((course) => {
      const totalTopics = Array.isArray(course.chapters)
        ? course.chapters.reduce(
            (sum, ch) =>
              sum + (Array.isArray(ch?.topics) ? ch.topics.length : 0),
            0
          )
        : 0;

      // remove chapters before sending (light payload)
      const { chapters, ...rest } = course;

      return {
        ...rest,
        totalTopics,
      };
    });

    return NextResponse.json(enrichedCourses, { status: 200 });
  } catch (error) {
    console.error("GET /api/course error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
