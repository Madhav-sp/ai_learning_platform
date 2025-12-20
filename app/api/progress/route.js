import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserProgress from "@/models/UserProgress";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req) {
  await connectDB();

  const { userId } = getAuth(req);
  console.log("AUTH USER (GET):", userId);

  if (!userId) {
    return NextResponse.json({});
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({});
  }

  const progress = await UserProgress.findOne({ userId, courseId }).lean();
  return NextResponse.json(progress || {});
}
