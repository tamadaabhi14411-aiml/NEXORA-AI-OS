import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export const MODEL = "deepseek/deepseek-chat-v3-0324:free";

const ai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

console.log("✅ OpenRouter Loaded");
console.log("Using Model:", MODEL);

export default ai;