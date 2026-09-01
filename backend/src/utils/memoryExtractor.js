export function extractMemory(message) {
  const memory = {};
  const text = message.trim();

  // ============================================
  // Career Goal
  // ============================================

  const careerMatch = text.match(
    /(?:i want to become|i want to be|my goal is to become|my career goal is)\s+(.+)/i
  );

  if (careerMatch) {
    memory.career = {
      goal: careerMatch[1].trim(),
    };
  }

  // ============================================
  // Skills
  // ============================================

  const skillsMatch = text.match(
    /(?:i know|i have skills in|my skills are)\s+(.+?)(?=(?:\.?\s+my project is|\.?\s+i built|\.?\s+i created|$))/i
  );

  if (skillsMatch) {
    const skillsText = skillsMatch[1]
      .replace(/[.!?]+$/, "")
      .trim();

    const skills = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skills.length > 0) {
      memory.skills = skills;
    }
  }

  // ============================================
  // Project
  // ============================================

  const projectMatch = text.match(
    /(?:my project is|my project was|i built|i created)\s+(.+)/i
  );

  if (projectMatch) {
    const project = projectMatch[1]
      .replace(/[.!?]+$/, "")
      .trim();

    if (project) {
      memory.projects = [project];
    }
  }

  return memory;
}