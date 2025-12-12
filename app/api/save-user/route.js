import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { clerkId, name, email } = await req.json();
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({ clerkId, name, email });
      console.log("User saved:", email);
    } else {
      console.log("User already exists:", email);
    }

    return NextResponse.json({ message: "User stored successfully", user });
  } catch (err) {
    console.error("User Save Error:", err);
    return NextResponse.json(
      { error: "Failed to store user" },
      { status: 500 }
    );
  }
}
