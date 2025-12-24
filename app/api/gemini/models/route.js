import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const models = await genAI.listModels();

    // Return only useful info
    const filtered = models.models.map((m) => ({
      name: m.name,
      displayName: m.displayName,
      description: m.description,
      supportedMethods: m.supportedGenerationMethods,
    }));

    return NextResponse.json({
      success: true,
      models: filtered,
    });
  } catch (err) {
    console.error("MODEL LIST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to list models", details: err.message },
      { status: 500 }
    );
  }
}
