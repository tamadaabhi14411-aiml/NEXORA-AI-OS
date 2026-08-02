import { askMentorAgent } from "./mentorAgent.js";
import { askRecruiterAgent } from "./recruiterAgent.js";
import { askStartupAgent } from "./startupAgent.js";
import { askEngineeringAgent } from "./engineeringAgent.js";

export async function routeToAgent(message) {
  const query = message.toLowerCase();

  if (
    query.includes("data science") ||
    query.includes("machine learning") ||
    query.includes("python") ||
    query.includes("career") ||
    query.includes("interview")
  ) {
    console.log("🤖 Routed to Mentor AI");
    return await askMentorAgent(message);
  }

  if (
    query.includes("resume") ||
    query.includes("cv") ||
    query.includes("job") ||
    query.includes("ats")
  ) {
    console.log("🤖 Routed to Recruiter AI");
    return await askRecruiterAgent(message);
  }

  if (
    query.includes("startup") ||
    query.includes("business") ||
    query.includes("founder") ||
    query.includes("company")
  ) {
    console.log("🤖 Routed to Startup AI");
    return await askStartupAgent(message);
  }

  if (
    query.includes("react") ||
    query.includes("node") ||
    query.includes("express") ||
    query.includes("mongodb") ||
    query.includes("api") ||
    query.includes("frontend") ||
    query.includes("backend") ||
    query.includes("bug") ||
    query.includes("error") ||
    query.includes("debug") ||
    query.includes("git")
  ) {
    console.log("🤖 Routed to Engineering AI");
    return await askEngineeringAgent(message);
  }

  return null;
}