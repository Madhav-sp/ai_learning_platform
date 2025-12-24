import Notebook from "@/models/Notebook";
import {connectDB} from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const notebooks = await Notebook.find().sort({ createdAt: -1 });
  return NextResponse.json(notebooks);
}
