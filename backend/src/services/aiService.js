import client from "../config/openrouter.js";

export const MODEL = "google/gemma-4-26b-a4b-it:free";
// If this model doesn't work later, we can change it easily.

export async function generateAIResponse(systemPrompt, userPrompt) {
  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const reply = completion?.choices?.[0]?.message?.content;

if (!reply) {
  throw new Error("AI service returned an invalid response.");
}

return reply;
  } catch (error) {
    console.log("\n========== OPENROUTER ERROR ==========\n");

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:");
      console.dir(error.response.data, { depth: null });
    } else if (error.error) {
      console.dir(error.error, { depth: null });
    } else {
      console.dir(error, { depth: null });
    }

    console.log("\n======================================\n");

    return "AI service is temporarily unavailable.";
  }
}
