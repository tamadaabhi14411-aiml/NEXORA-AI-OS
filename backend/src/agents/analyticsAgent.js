import { askChiefAgent } from "./chiefAgent.js";

export const askAnalyticsAgent = async (message) => {
  return await askChiefAgent(`
You are the Analytics AI of NEXORA.

Specialization:
- Data Science
- Data Analysis
- Machine Learning
- Statistics
- Data Visualization

User Question:
${message}
`);
};