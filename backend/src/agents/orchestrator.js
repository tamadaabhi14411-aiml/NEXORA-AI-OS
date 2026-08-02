import { askMentorAgent } from "./mentorAgent.js";
import { askRecruiterAgent } from "./recruiterAgent.js";
import { askStartupAgent } from "./startupAgent.js";

export async function routeToAgent(message) {
  const query = message.toLowerCase();

  console.log("🤖 Routing:", query);

  // -----------------------------
  // Mentor AI
  // -----------------------------
  if (
    query.includes("learn") ||
    query.includes("study") ||
    query.includes("python") ||
    query.includes("machine learning") ||
    query.includes("data science") ||
    query.includes("roadmap") ||
    query.includes("interview")
  ) {
    console.log("✅ Routed to Mentor AI");
    return await askMentorAgent(message);
  }

  // -----------------------------
  // Recruiter AI
  // -----------------------------
  if (
    query.includes("resume") ||
    query.includes("cv") ||
    query.includes("ats") ||
    query.includes("job") ||
    query.includes("linkedin")
  ) {
    console.log("✅ Routed to Recruiter AI");
    return await askRecruiterAgent(message);
  }

  // -----------------------------
  // Startup AI
  // -----------------------------
  if (
    query.includes("startup") ||
    query.includes("business") ||
    query.includes("mvp") ||
    query.includes("pitch") ||
    query.includes("funding")
  ) {
    console.log("✅ Routed to Startup AI");
    return await askStartupAgent(message);
  }

  console.log("✅ Routed to Chief AI");
  return null;
}