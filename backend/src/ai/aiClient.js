import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "❌ GEMINI_API_KEY is missing. Please add it to your .env file."
  );
}

export const ai = new GoogleGenAI({
  apiKey,
});

export const AI_MODEL = "gemini-2.5-flash";

console.log("✅ Gemini AI Client Initialized");