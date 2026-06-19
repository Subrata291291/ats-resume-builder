import type { ResumeData } from "../types/resume";

export type ScoreResult = {
  score: number; // 0-100
  breakdown: Record<string, number>;
  suggestions: string[];
};

export function scoreResume(data: ResumeData): ScoreResult {
  const breakdown: Record<string, number> = {};
  let score = 0;

  // Personal info (max 30)
  const personal = data.personalInfo || {};
  const personalChecks: Array<{ key: string; value: string | undefined; points: number; msg: string }> = [
    { key: "fullName", value: personal.fullName, points: 6, msg: "Add your full name" },
    { key: "title", value: personal.title, points: 6, msg: "Add a job title (e.g. Senior Software Engineer)" },
    { key: "email", value: personal.email, points: 6, msg: "Add a contact email" },
    { key: "phone", value: personal.phone, points: 6, msg: "Add a phone number" },
    { key: "summary", value: personal.summary, points: 6, msg: "Add a short professional summary" },
  ];

  personalChecks.forEach((c) => {
    if (c.value && c.value.trim().length > 0) {
      breakdown[c.key] = c.points;
      score += c.points;
    } else {
      breakdown[c.key] = 0;
    }
  });

  // Experience (max 20)
  const expCount = Array.isArray(data.experience) ? data.experience.length : 0;
  const expPoints = Math.min(20, expCount * 6); // up to ~3-4 entries for full points
  breakdown.experience = expPoints;
  score += expPoints;

  // Education (max 10)
  const eduCount = Array.isArray(data.education) ? data.education.length : 0;
  const eduPoints = eduCount > 0 ? 10 : 0;
  breakdown.education = eduPoints;
  score += eduPoints;

  // Skills (max 15)
  const skillsCount = Array.isArray(data.skills) ? data.skills.length : 0;
  const skillsPoints = Math.min(15, Math.round(skillsCount * 1.5));
  breakdown.skills = skillsPoints;
  score += skillsPoints;

  // Projects (max 10)
  const projCount = Array.isArray(data.projects) ? data.projects.length : 0;
  const projPoints = Math.min(10, projCount * 5);
  breakdown.projects = projPoints;
  score += projPoints;

  // Links & extras (max 5)
  const linkPoints = [personal.linkedin, personal.github, personal.website].filter(Boolean).length > 0 ? 5 : 0;
  breakdown.links = linkPoints;
  score += linkPoints;

  // Summary length bonus (max 5)
  const summaryLength = personal.summary ? personal.summary.trim().length : 0;
  const summaryBonus = summaryLength >= 50 && summaryLength <= 300 ? 5 : 0;
  breakdown.summaryBonus = summaryBonus;
  score += summaryBonus;

  // Normalize score to 100 if needed (current weights already sum to 100)
  const normalized = Math.max(0, Math.min(100, Math.round(score)));

  // Suggestions
  const suggestions: string[] = [];
  if (!personal.fullName) suggestions.push("Add your full name at the top of the resume.");
  if (!personal.title) suggestions.push("Add a clear job title (e.g. Senior Software Engineer).");
  if (!personal.email) suggestions.push("Include a contact email so recruiters can reach you.");
  if (!personal.phone) suggestions.push("Add a phone number for direct contact.");
  if (!personal.summary) suggestions.push("Write a short professional summary to highlight strengths.");
  if (expCount === 0) suggestions.push("Add at least one work experience entry with role and responsibilities.");
  if (eduCount === 0) suggestions.push("Include relevant education or certifications.");
  if (skillsCount < 5) suggestions.push("Add more skills (aim for 6–12 relevant skills).");
  if (projCount === 0) suggestions.push("Add projects to demonstrate practical experience.");
  if (!linkPoints) suggestions.push("Add a LinkedIn or GitHub link to show profiles or code samples.");
  if (summaryLength > 0 && summaryLength < 50) suggestions.push("Expand your summary to 50–150 characters for more impact.");
  if (summaryLength > 300) suggestions.push("Shorten your summary to keep it concise and scannable.");

  return {
    score: normalized,
    breakdown,
    suggestions,
  };
}

export default scoreResume;
