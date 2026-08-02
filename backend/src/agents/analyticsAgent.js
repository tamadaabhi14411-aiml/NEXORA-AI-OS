import ai, { MODEL } from "../config/gemini.js";

export async function askAnalyticsAgent(message) {
  try {
    const prompt = `
You are Analytics AI of NEXORA AI OS.

Expertise:
- Data Analytics
- Data Science
- SQL
- Python
- Pandas
- NumPy
- Power BI
- Tableau
- Statistics
- Machine Learning

Always explain with examples.

User Question:
${message}
`;

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    return result.text;

  } catch (error) {
    console.error("Analytics AI Error:", error);
    return `Analytics AI Error: ${error.message}`;
  }
}