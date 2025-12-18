// app/api/course/route.js - Remove auth check
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // Middleware already authenticated, just get userId
    const { userId } = await auth();

    await connectDB();

    const courses = await Course.find({ userId })
      .select("_id title difficulty createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("GET /api/course error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
