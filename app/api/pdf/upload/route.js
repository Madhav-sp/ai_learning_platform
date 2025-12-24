import { NextResponse } from "next/server";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const runtime = "nodejs";

// ✅ Correct worker path (STRING, not default import)
const workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.mjs",
  import.meta.url
).toString();

export async function POST(req) {
  try {
    // 1️⃣ Read form data
    const formData = await req.formData();
    const file = formData.get("pdf");

    if (!file) {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }

    // 2️⃣ Convert file → Uint8Array (RAM only)
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // 3️⃣ Explicit worker setup (FIX)
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

    // 4️⃣ Load PDF
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
    });

    const pdf = await loadingTask.promise;

    let extractedText = "";

    // 5️⃣ Extract text
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str)
        .filter(Boolean)
        .join(" ");

      extractedText += pageText + "\n\n";
    }

    return NextResponse.json({
      success: true,
      pages: pdf.numPages,
      text: extractedText,
    });
  } catch (err) {
    console.error("PDF ERROR:", err);
    return NextResponse.json(
      {
        error: "PDF processing failed",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
