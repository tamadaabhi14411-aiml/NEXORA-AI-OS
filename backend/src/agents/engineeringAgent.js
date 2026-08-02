import { askChiefAgent } from "./chiefAgent.js";

export const askEngineeringAgent = async (message) => {
  return await askChiefAgent(`
You are the Engineering AI of NEXORA.

Specialization:
- JavaScript
- React
- Node.js
- Express
- MongoDB
- Python
- AI Development

User Question:
${message}
`);
};