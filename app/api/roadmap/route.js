import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Roadmap from "@/models/Roadmap";

export async function GET() {
  await connectDB();
  const roadmap = await Roadmap.find().sort({ order: 1 });
  return NextResponse.json(roadmap);
}
