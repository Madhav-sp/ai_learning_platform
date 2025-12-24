import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Goal from "@/models/Goal";

export async function GET(req) {
  await connectDB();
  const userId = req.headers.get("x-user-id");

  const goals = await Goal.find({ userId });
  return NextResponse.json(goals);
}

export async function POST(req) {
  await connectDB();
  const { text, userId } = await req.json();

  const goal = await Goal.create({ text, userId });
  return NextResponse.json(goal);
}

export async function PATCH(req) {
  await connectDB();
  const { id } = await req.json();

  const goal = await Goal.findById(id);
  goal.completed = !goal.completed;
  await goal.save();

  return NextResponse.json(goal);
}
