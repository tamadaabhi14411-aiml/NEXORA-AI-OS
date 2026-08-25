/**
 * SDG Connect Collaborator Matching Algorithm
 * Calculates skill overlap + SDG interest alignment + availability weight
 */

export function calculateMatchScore(user, project) {
  if (!user || !project) {
    return {
      percentage: 50,
      skillMatches: [],
      totalRequiredSkills: 0,
      sdgMatches: [],
      totalProjectSdgs: 0,
      skillScore: 50,
      sdgScore: 50
    };
  }

  const projectSkills = project.requiredSkills || [];
  const userSkills = user.skills || [];

  // Skill overlap matching (case-insensitive)
  const skillMatches = userSkills.filter(userSkill =>
    projectSkills.some(projSkill => projSkill.toLowerCase().trim() === userSkill.toLowerCase().trim())
  );

  const skillScore = projectSkills.length > 0
    ? (skillMatches.length / projectSkills.length) * 100
    : 60;

  // SDG overlap matching
  const projectSdgs = project.sdgs || [];
  const userSdgs = user.sdgInterests || [];

  const sdgMatches = userSdgs.filter(sdgId => projectSdgs.includes(sdgId));

  const sdgScore = projectSdgs.length > 0
    ? (sdgMatches.length / projectSdgs.length) * 100
    : 60;

  // Weighted score: 60% skills + 40% SDG interest
  let rawScore = (skillScore * 0.60) + (sdgScore * 0.40);

  // Bonus points for experience & high availability
  let bonus = 0;
  if (user.experienceLevel === "Senior" || user.experienceLevel === "Expert") bonus += 4;
  if (user.availability && (user.availability.includes("15") || user.availability.includes("20"))) bonus += 4;

  let finalPercentage = Math.round(rawScore + bonus);

  // Adjust display percentage range cleanly (28% to 98%)
  if (skillMatches.length >= 3 && sdgMatches.length >= 2) {
    finalPercentage = Math.max(92, Math.min(98, finalPercentage));
  } else if (skillMatches.length === 0 && sdgMatches.length === 0) {
    finalPercentage = Math.max(25, Math.min(38, finalPercentage));
  } else {
    finalPercentage = Math.max(45, Math.min(91, finalPercentage));
  }

  return {
    percentage: finalPercentage,
    skillMatches,
    totalRequiredSkills: projectSkills.length,
    sdgMatches,
    totalProjectSdgs: projectSdgs.length,
    skillScore: Math.round(skillScore),
    sdgScore: Math.round(sdgScore)
  };
}

export function formatSkillList(skills = []) {
  if (!skills.length) return "General Tech";
  if (skills.length <= 3) return skills.join(", ");
  return `${skills.slice(0, 3).join(", ")} +${skills.length - 3} more`;
}
