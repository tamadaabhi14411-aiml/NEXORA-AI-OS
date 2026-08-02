export function extractMemory(message) {
    const memory = {};
  
    const lower = message.toLowerCase();
  
    // Career Goal
    if (lower.includes("become")) {
      memory.career = {
        goal: message,
      };
    }
  
    // Skills
    if (lower.includes("i know")) {
      const skills = message
        .replace(/i know/i, "")
        .split(",")
        .map((s) => s.trim());
  
      memory.skills = skills;
    }
  
    // Projects
    if (lower.includes("my project")) {
      memory.projects = [message];
    }
  
    return memory;
  }