import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const { courseId, chapterIndex } = await req.json();

    await connectDB();

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    course.chapters[chapterIndex].completed = true;
    await course.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
