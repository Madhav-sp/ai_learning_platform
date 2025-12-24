import { NextResponse } from "next/server";
import Notebook from "@/models/Notebook";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  await connectDB();

  const data = await req.json();

  const notebook = await Notebook.create(data);

  return NextResponse.json({ success: true, notebook });
}
