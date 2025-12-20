import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserProgress from "@/models/UserProgress";
import Course from "@/models/Course";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  await connectDB();

  const { userId } = getAuth(req);
  console.log("AUTH USER:", userId);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId, chapterIndex, topicIndex } = await req.json();

  let progress = await UserProgress.findOne({ userId, courseId });

  if (!progress) {
    progress = await UserProgress.create({
      userId,
      courseId,
      completedTopics: [],
    });
  }

  const exists = progress.completedTopics.some(
    (t) => t.chapterIndex === chapterIndex && t.topicIndex === topicIndex
  );

  if (!exists) {
    progress.completedTopics.push({ chapterIndex, topicIndex });
  }

  progress.lastViewed = { chapterIndex, topicIndex };

  const course = await Course.findById(courseId).lean();
  if (course) {
    const totalTopics = course.chapters.reduce(
      (sum, ch) => sum + ch.topics.length,
      0
    );

    progress.progressPercent = totalTopics
      ? Math.round((progress.completedTopics.length / totalTopics) * 100)
      : 0;
  }

  await progress.save();

  return NextResponse.json({
    success: true,
    progressPercent: progress.progressPercent,
  });
}
