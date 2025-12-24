import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔒 Recommended model for PDF notes & flashcards
export const geminiModel = genAI.getGenerativeModel({
  model: "models/gemini-flash-latest",
});
