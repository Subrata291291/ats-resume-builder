import type { ResumeData } from "../types/resume";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";

GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();

const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const phoneRegex = /(?:\+?\d{1,3}[\s-]*)?(?:\(\d{2,4}\)|\d{2,4})[\s-]*\d{3,4}[\s-]*\d{3,4}/;
const urlRegex = /(https?:\/\/)?([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(\/\S*)?/i;
const yearRangeRegex = /(\b\d{4}\b(?:\s*[–-]\s*\d{4}|\s*[–-]\s*(Present|present|Current|current))?)/;
const locationRegex = /\b([A-Za-z]+(?:,\s*[A-Za-z]+){1,3})\b/;

const sectionPatterns: Array<{ key: keyof ResumeData | "summary" | "personal"; regex: RegExp }> = [
  { key: "summary", regex: /\b(professionalsummary|summary|aboutme|profile|careersummary|objective)\b/i },
  { key: "experience", regex: /\b(workexperience|professionalexperience|experience|employmenthistory)\b/i },
  { key: "education", regex: /\b(education|academicbackground|academicqualifications|qualifications)\b/i },
  { key: "projects", regex: /\b(projects|selectedprojects|portfolio)\b/i },
  { key: "skills", regex: /\b(skills|technicalskills|expertise|languages|competencies)\b/i },
  { key: "personal", regex: /\b(contact|contactdetails|personaldetails|personalinformation|references?)\b/i },
];

const normalizeLine = (line: string) => line.trim().replace(/\s+/g, " ");

const compactLine = (line: string) => line.toLowerCase().replace(/[^a-z]/g, "");

const findSectionPatternForLine = (line: string) => {
  const normalized = normalizeLine(line);
  const compact = compactLine(line);

  return sectionPatterns.find((pattern) =>
    pattern.regex.test(normalized) || pattern.regex.test(compact)
  );
};

const extractHeadingContent = (line: string) => {
  const match = line.match(/^(.+?)(?:[:\-–—|])\s*(.+)$/);
  return match?.[2]?.trim() || "";
};

const isLikelyHeadingLine = (line: string) => {
  const compact = compactLine(line);
  const keywords = ["contact", "reference", "skill", "language", "profile", "experience", "education", "project", "summary", "objective"];
  const matched = keywords.filter((keyword) => compact.includes(keyword));
  return matched.length >= 2;
};

const splitIntoSections = (lines: string[]) => {
  const sections: Record<string, string[]> = {
    personal: [],
    summary: [],
    experience: [],
    education: [],
    projects: [],
    skills: [],
  };

  let currentSection: string = "personal";

  for (const line of lines) {
    const trimmed = normalizeLine(line);
    if (!trimmed) {
      sections[currentSection].push("");
      continue;
    }

    const sectionPattern = findSectionPatternForLine(trimmed);
    if (sectionPattern) {
      const probablyHeading = trimmed.length < 50 || /[:\-–—|]/.test(trimmed);
      currentSection = sectionPattern.key;
      if (probablyHeading) {
        const content = extractHeadingContent(trimmed);
        if (content) {
          sections[currentSection].push(content);
          continue;
        }
        continue;
      }
    }

    if (currentSection === "personal" && isLikelyHeadingLine(trimmed)) {
      continue;
    }

    sections[currentSection].push(trimmed);
  }

  return sections as {
    personal: string[];
    summary: string[];
    experience: string[];
    education: string[];
    projects: string[];
    skills: string[];
  };
};

const parseListBlocks = (lines: string[]) => {
  const blocks = lines
    .join("\n")
    .split(/\n{2,}/)
    .map((block) => block.split(/\n/).map((line) => normalizeLine(line)).filter(Boolean));
  return blocks.filter((block) => block.length > 0);
};

const splitLinesIntoBlocks = (lines: string[]) => {
  const blocks: string[][] = [];
  let current: string[] = [];

  const isEntryStarter = (line: string) =>
    yearRangeRegex.test(line) ||
    /\bat\b/i.test(line) ||
    /\b(senior|lead|principal|manager|director|engineer|developer|designer|consultant|analyst|architect|product|ui|ux|fullstack|frontend|backend)\b/i.test(line);

  for (const line of lines) {
    if (!line.trim()) {
      if (current.length > 0) {
        blocks.push(current);
        current = [];
      }
      continue;
    }

    if (current.length > 0 && isEntryStarter(line) && !yearsOrContactMatch(current[current.length - 1], line)) {
      blocks.push(current);
      current = [line];
      continue;
    }

    current.push(line);
  }

  if (current.length > 0) {
    blocks.push(current);
  }

  return blocks;
};

const yearsOrContactMatch = (prevLine: string, nextLine: string) => {
  return yearRangeRegex.test(prevLine) && yearRangeRegex.test(nextLine);
};

const mergeIfSmallBlocks = (blocks: string[][]) => {
  if (blocks.length <= 1) {
    return blocks;
  }

  return blocks.reduce<string[][]>((merged, block) => {
    if (block.length === 1 && merged.length > 0) {
      merged[merged.length - 1] = [...merged[merged.length - 1], ...block];
    } else {
      merged.push(block);
    }
    return merged;
  }, []);
};

const parseExperienceBlocks = (lines: string[]) => {
  const blocks = parseListBlocks(lines);
  const entryBlocks = blocks.length > 1 ? blocks : mergeIfSmallBlocks(splitLinesIntoBlocks(lines));

  return entryBlocks.map((block) => {
    const duration = block.find((line) => yearRangeRegex.test(line)) || "";
    const titleLine = block[0] || "";
    const roleLine = block[1] || "";
    const descriptionLines = block.filter((line) => line !== titleLine && line !== roleLine && line !== duration);

    let company = titleLine;
    let role = roleLine;
    if (titleLine.toLowerCase().includes(" at ") && !roleLine) {
      const parts = titleLine.split(/ at /i);
      role = parts[0].trim();
      company = parts[1]?.trim() ?? titleLine;
    }

    if (!role && titleLine.toLowerCase().includes("senior")) {
      role = titleLine;
      company = roleLine;
    }

    return {
      company: company || "",
      role: role || "",
      duration: duration || "",
      location: "",
      description: descriptionLines.join("\n"),
    };
  });
};

const parseEducationBlocks = (lines: string[]) => {
  const blocks = parseListBlocks(lines);
  const entryBlocks = blocks.length > 1 ? blocks : mergeIfSmallBlocks(splitLinesIntoBlocks(lines));

  return entryBlocks.map((block) => {
    const year = block.find((line) => yearRangeRegex.test(line)) || "";
    const firstLine = block[0] || "";
    const secondLine = block[1] || "";

    const degree = firstLine.match(/(Bachelor|Master|B\.?S\.?|M\.?S\.?|MBA|Ph\.?D\.?|Associate|Diploma|Certification|B\.Eng|B\.Tech|M\.Eng|M\.Tech)/i)
      ? firstLine
      : secondLine;
    const college = degree === firstLine ? secondLine : firstLine;

    return {
      college: college || "",
      degree: degree || "",
      year: year || "",
      location: "",
    };
  });
};

const parseProjectsBlocks = (lines: string[]) => {
  const blocks = parseListBlocks(lines);
  const entryBlocks = blocks.length > 1 ? blocks : mergeIfSmallBlocks(splitLinesIntoBlocks(lines));

  return entryBlocks.map((block) => {
    const title = block[0] || "";
    const technologies = block[1] || "";
    const descriptionLines = block.slice(2);

    return {
      title,
      technologies,
      link: "",
      description: descriptionLines.join(" "),
    };
  });
};

const parseSkills = (lines: string[]) => {
  const text = lines.join(" ");
  if (!text) {
    return [];
  }

  const commaSeparated = text.split(/[;,|]/).map((skill) => skill.trim()).filter(Boolean);
  if (commaSeparated.length > 1) {
    return Array.from(new Set(commaSeparated));
  }

  const tokens = Array.from(new Set(text.split(/\s+\/\s+|\s+·\s+|\s+•\s+|\s+/).map((skill) => skill.trim()).filter(Boolean)));
  if (tokens.length > 6) {
    return tokens;
  }

  const techMatches = text.match(/\b(React|Angular|Vue|Node|JavaScript|TypeScript|Next\.js|Redux|HTML|CSS|AWS|Docker|Kubernetes|SQL|NoSQL|Python|Java|C#|Git|Figma|Photoshop|Sketch)\b/gi) || [];
  return Array.from(new Set(techMatches.map((skill) => skill.trim())));
};

const extractSectionLines = (lines: string[], headingRegex: RegExp) => {
  const start = lines.findIndex((line) => headingRegex.test(line) || headingRegex.test(compactLine(line)));
  if (start === -1) {
    return [];
  }

  const headingContent = extractHeadingContent(lines[start]);
  const nextSection = lines.findIndex((line, index) =>
    index > start && sectionPatterns.some((pattern) => pattern.regex.test(line) || pattern.regex.test(compactLine(line)))
  );

  const sectionLines = lines.slice(start + 1, nextSection === -1 ? lines.length : nextSection);
  if (headingContent) {
    return [headingContent, ...sectionLines];
  }

  return sectionLines;
};

const parseExperienceFallback = (lines: string[]) => {
  const experienceLines = extractSectionLines(lines, /\b(work experience|professional experience|experience|employment history)\b/i);
  const sourceLines = experienceLines.length > 0 ? experienceLines : lines.filter((line) => yearRangeRegex.test(line) || /\bat\b|\bworked\b|\bmanaged\b|\bdeveloped\b|\bdesigned\b|\bengineered\b/i.test(line));
  const blocks = parseListBlocks(sourceLines);

  if (blocks.length === 0) {
    const inferred = lines.filter((line) => /\bat\b|\bworked\b|\bmanaged\b|\bdeveloped\b|\bdesigned\b|\bengineered\b/i.test(line));
    if (inferred.length > 0) {
      return inferred.slice(0, 6).map((line) => ({
        company: line.match(/\bat\s+([^\n]+)/i)?.[1]?.trim() || "",
        role: line.replace(/\b(at\s+[^\n]+)/i, "").trim(),
        duration: yearRangeRegex.exec(line)?.[0] || "",
        location: "",
        description: "",
      }));
    }

    return lines
      .filter((line) => yearRangeRegex.test(line))
      .slice(0, 6)
      .map((line) => ({ company: "", role: "", duration: line, location: "", description: "" }));
  }

  return blocks.slice(0, 6).map((block) => {
    const duration = block.find((line) => yearRangeRegex.test(line)) || "";
    const first = block[0] || "";
    const second = block[1] || "";
    const role = /\b(developer|engineer|manager|designer|consultant|lead|specialist|analyst|director|architect|product|ui\/ux|frontend|backend|fullstack)\b/i.test(first)
      ? first
      : second;
    const company = role === first ? second : first;
    const description = block.filter((line) => line !== first && line !== second && line !== duration).join(" ");

    return {
      company: company || "",
      role: role || "",
      duration: duration || "",
      location: "",
      description,
    };
  });
};

const parseEducationFallback = (lines: string[]) => {
  const educationLines = extractSectionLines(lines, /\b(education|academic background|academic qualifications|qualifications)\b/i);
  const sourceLines = educationLines.length > 0 ? educationLines : lines.filter((line) => yearRangeRegex.test(line) || /\b(Bachelor|Master|B\.?S\.?|M\.?S\.?|MBA|Ph\.?D\.?|Diploma|Certification)\b/i.test(line));
  const blocks = parseListBlocks(sourceLines);

  if (blocks.length === 0) {
    return lines
      .filter((line) => /\b(Bachelor|Master|B\.?S\.?|M\.?S\.?|MBA|Ph\.?D\.?|Diploma|Certification)\b/i.test(line))
      .slice(0, 4)
      .map((line) => ({ college: "", degree: line, year: "", location: "" }));
  }

  return blocks.slice(0, 6).map((block) => {
    const year = block.find((line) => yearRangeRegex.test(line)) || "";
    const first = block[0] || "";
    const second = block[1] || "";
    const degree = /(Bachelor|Master|B\.?S\.?|M\.?S\.?|MBA|Ph\.?D\.?|Associate|Diploma|Certification|B\.?Eng|B\.?Tech|M\.?Eng|M\.?Tech)/i.test(first)
      ? first
      : second;
    const college = degree === first ? second : first;

    return {
      college: college || "",
      degree: degree || "",
      year: year || "",
      location: "",
    };
  });
};

const parseSkillsFallback = (lines: string[]) => {
  const skillsLines = extractSectionLines(lines, /\b(skills|technical skills|expertise|core skills|languages)\b/i);
  let candidate = skillsLines.length > 0
    ? skillsLines.join(" ")
    : (() => {
        const match = lines.find((line) =>
          /\b(React|Node|JavaScript|TypeScript|HTML|CSS|AWS|SQL|Git|Docker|Figma|Photoshop|Sketch|Python|Java|C#|Kubernetes|Redux|Vue|Angular)\b/i.test(line)
        );
        return match || "";
      })();

  if (!candidate) {
    const fallbackText = lines.filter((line) => /\b(React|Node|JavaScript|TypeScript|HTML|CSS|AWS|SQL|Git|Docker|Python|Java|C#|Kubernetes|Redux|Vue|Angular|Figma)\b/i.test(line)).join(" ");
    candidate = fallbackText;
  }

  if (!candidate) {
    return [];
  }

  const parts = candidate.split(/[;,|•]/).map((skill) => skill.trim()).filter(Boolean);
  if (parts.length > 0) {
    return Array.from(new Set(parts));
  }

  return Array.from(new Set(candidate.split(/\s+\/\s+|\s+·\s+|\s+•\s+|\s+/).map((skill) => skill.trim()).filter(Boolean)));
};

const parseProjectsFallback = (lines: string[]) => {
  const projectLines = extractSectionLines(lines, /\b(projects|selected projects|portfolio)\b/i);
  const sourceLines = projectLines.length > 0 ? projectLines : lines.filter((line) => /\b(project|built|developed|designed|implemented)\b/i.test(line));
  const blocks = parseListBlocks(sourceLines);
  if (blocks.length === 0) {
    return [];
  }

  return blocks
    .slice(0, 4)
    .map((block) => ({
      title: block[0] || "",
      technologies: block[1] || "",
      link: "",
      description: block.slice(2).join(" "),
    }));
};

const parsePersonalFallback = (rawText: string, lines: string[]) => {
  const email = emailRegex.exec(rawText)?.[0] || "";
  const phone = phoneRegex.exec(rawText)?.[0] || "";
  const linkedin = captureUrl(rawText, /(https?:\/\/)?(www\.)?linkedin\.com\/[A-Za-z0-9\-_.\/]+/i) || "";
  const github = captureUrl(rawText, /(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9\-_.\/]+/i) || "";
  const website = captureUrl(rawText, urlRegex) || "";
  const { fullName, title, location } = pickNameAndTitle(lines.slice(0, 10));
  const summary = lines.find((line) => /\b(I am|Experienced|Passionate|Driven|Skilled|Detail-oriented|Motivated|summary|profile|objective|career|about me)\b/i.test(line)) || "";

  return {
    personalInfo: {
      fullName,
      title,
      email,
      phone,
      location,
      linkedin,
      github,
      website,
      summary,
    },
    experience: [],
    education: [],
    projects: [],
    skills: [],
  };
};

const mergePersonalInfo = (primary: ResumeData["personalInfo"], fallback: ResumeData["personalInfo"]): ResumeData["personalInfo"] => ({
  fullName: primary.fullName || fallback.fullName,
  title: primary.title || fallback.title,
  email: primary.email || fallback.email,
  phone: primary.phone || fallback.phone,
  location: primary.location || fallback.location,
  linkedin: primary.linkedin || fallback.linkedin,
  github: primary.github || fallback.github,
  website: primary.website || fallback.website,
  summary: primary.summary || fallback.summary,
});

const captureUrl = (text: string, name: RegExp) => {
  const match = text.match(name);
  return match ? match[0] : "";
};

const isLikelyName = (line: string) => {
  if (!line) {
    return false;
  }

  if (line.length > 50 || line.length < 4) {
    return false;
  }

  if (emailRegex.test(line) || phoneRegex.test(line) || urlRegex.test(line)) {
    return false;
  }

  if (/\d/.test(line)) {
    return false;
  }

  if (/\b(contact|reference|skill|language|profile|experience|education|project|summary|objective)\b/i.test(line)) {
    return false;
  }

  if (/\b(developer|engineer|manager|designer|consultant|director|architect|lead|principal|specialist|analyst)\b/i.test(line) && line.split(/\s+/).length > 2) {
    return false;
  }

  const words = line.split(/\s+/).filter(Boolean);
  if (words.length < 1 || words.length > 5) {
    return false;
  }

  const capitalizedWords = words.filter((word) => /^[A-Z][a-z'-]+$/.test(word) || /^[A-Z]+$/.test(word));
  return capitalizedWords.length >= Math.min(2, words.length);
};

const isContactOrHeadingLine = (line: string) => {
  return (
    emailRegex.test(line) ||
    phoneRegex.test(line) ||
    urlRegex.test(line) ||
    /\b(contact|references|skills|experience|education|projects|profile|summary|about me|career summary|objective)\b/i.test(line)
  );
};

const isLikelyContactLine = (line: string) => {
  return emailRegex.test(line) || phoneRegex.test(line) || urlRegex.test(line);
};

const splitNameAndRoleFromLine = (line: string) => {
  const roleRegex = /\b(frontend|backend|fullstack|developer|engineer|manager|designer|consultant|director|architect|lead|principal|specialist|analyst|product|ui\/ux|ui|ux|cto|ceo|coo|founder|owner)\b/i;
  const match = roleRegex.exec(line);
  if (!match) {
    return null;
  }

  const index = match.index;
  const before = line.slice(0, index).trim();
  const after = line.slice(index).trim();
  if (before && after && before.split(/\s+/).length <= 4) {
    return { name: before, title: after };
  }
  return null;
};

const splitNameAndTitleByDelimiter = (line: string) => {
  const match = line.match(/^\s*([^|•—–:-]+?)\s*[|•—–:-]\s*(.+)$/);
  if (!match) {
    return null;
  }

  return { name: match[1].trim(), title: match[2].trim() };
};

const splitHeaderFields = (line: string) => {
  return line
    .split(/\s*[|•·—–:\/\t-]\s*/)
    .map((segment) => normalizeLine(segment))
    .filter(Boolean);
};

const extractHeaderPersonalInfo = (lines: string[]) => {
  const candidates = lines.slice(0, 4).map(normalizeLine).filter(Boolean);
  const segments = candidates.flatMap(splitHeaderFields);

  const fullName = segments.find((segment) => isLikelyName(segment)) || "";
  const title = segments.find((segment) =>
    /\b(frontend|backend|fullstack|developer|engineer|manager|designer|consultant|director|architect|lead|principal|specialist|analyst|product|ui\/ux|cto|ceo|founder|owner|software|data|marketing|sales|operations)\b/i.test(segment) && segment !== fullName
  ) || "";
  const location = segments.find((segment) =>
    locationRegex.test(segment) && segment !== fullName && segment !== title
  ) || "";

  return { fullName, title, location };
};

const pickNameAndTitle = (lines: string[]) => {
  const normalized = lines.map(normalizeLine).filter(Boolean);

  let fullName = "";
  let title = "";
  let location = "";

  const headerInfo = extractHeaderPersonalInfo(normalized);
  if (headerInfo.fullName) {
    fullName = headerInfo.fullName;
    title = headerInfo.title;
    location = headerInfo.location;
  }

  const firstLine = normalized[0] || "";
  const delimiterSplit = splitNameAndTitleByDelimiter(firstLine);
  if (!fullName && delimiterSplit && isLikelyName(delimiterSplit.name)) {
    fullName = delimiterSplit.name;
    title = title || delimiterSplit.title;
  }

  if (!fullName) {
    for (const candidate of normalized.slice(0, 6)) {
      const split = splitNameAndRoleFromLine(candidate);
      if (split && isLikelyName(split.name)) {
        fullName = split.name;
        title = title || split.title;
        break;
      }
    }
  }

  const headerName = normalized.find((line) => isLikelyName(line) && !isLikelyContactLine(line));
  const nameLine = fullName || headerName || normalized.find((line) => isLikelyName(line));
  const nameIndex = nameLine ? normalized.indexOf(nameLine) : -1;

  if (!fullName && nameLine) {
    fullName = nameLine;
  }

  if (!title && nameLine) {
    for (let next = nameIndex + 1; next < Math.min(normalized.length, nameIndex + 5); next += 1) {
      const nextLine = normalized[next];
      if (!isContactOrHeadingLine(nextLine) && nextLine.length < 70 && !locationRegex.test(nextLine)) {
        title = nextLine;
        break;
      }
    }
  }

  if (!title && normalized[1] && !isContactOrHeadingLine(normalized[1]) && normalized[1] !== fullName) {
    title = normalized[1];
  }

  const locationLine = normalized.find((line) => locationRegex.test(line) && !emailRegex.test(line) && !phoneRegex.test(line) && line !== fullName && line !== title);
  if (locationLine) {
    location = locationRegex.exec(locationLine)?.[1] || "";
  }

  if (!fullName && normalized.length > 0) {
    const possible = normalized.find((line) => !isContactOrHeadingLine(line) && !emailRegex.test(line) && !phoneRegex.test(line));
    if (possible) {
      const split = splitNameAndRoleFromLine(possible);
      if (split) {
        fullName = split.name;
        title = title || split.title;
      } else {
        fullName = possible;
      }
    }
  }

  return { fullName, title, location };
};

const extractPersonalInfo = (allText: string, personalLines: string[], summaryLines: string[]) => {
  const { fullName, title, location } = pickNameAndTitle(personalLines);
  const email = emailRegex.exec(allText)?.[0] || "";
  const phone = phoneRegex.exec(allText)?.[0] || "";
  const linkedin = captureUrl(allText, /(https?:\/\/)?(www\.)?linkedin\.com\/[A-Za-z0-9\-_.\/]+/i) || personalLines.find((line) => /linkedin\.com/i.test(line)) || "";
  const github = captureUrl(allText, /(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9\-_.\/]+/i) || personalLines.find((line) => /github\.com/i.test(line)) || "";
  const website = captureUrl(allText, urlRegex) || personalLines.find((line) => /\.[a-z]{2,}$/i.test(line) && !emailRegex.test(line) && !/linkedin\.com|github\.com/i.test(line)) || "";

  const summary = summaryLines.length > 0
    ? summaryLines.join(" ")
    : personalLines.slice(2).filter((line) => !isContactOrHeadingLine(line)).join(" ");

  return {
    fullName,
    title,
    email,
    phone,
    location,
    linkedin,
    github,
    website,
    summary,
  };
};

export const parseResumeTextToData = (rawText: string): ResumeData => {
  const rawLines = rawText.replace(/\r/g, "\n").split(/\n/);
  const normalizedLines = rawLines.map((line) => normalizeLine(line));
  const lines = normalizedLines.filter(Boolean);

  const sections = splitIntoSections(lines);

  const personalInfo = extractPersonalInfo(rawText, sections.personal, sections.summary);
  const experience = parseExperienceBlocks(sections.experience).slice(0, 6).filter((item) => item.company || item.role || item.description);
  const education = parseEducationBlocks(sections.education).slice(0, 6).filter((item) => item.college || item.degree || item.year);
  const projects = parseProjectsBlocks(sections.projects).slice(0, 6).filter((item) => item.title || item.description);
  const skills = parseSkills(sections.skills);

  const fallback = parsePersonalFallback(rawText, lines);
  const mergedPersonal = mergePersonalInfo(personalInfo, fallback.personalInfo);
  const mergedExperience = experience.length > 0 ? experience : parseExperienceFallback(lines);
  const mergedEducation = education.length > 0 ? education : parseEducationFallback(lines);
  const mergedProjects = projects.length > 0 ? projects : parseProjectsFallback(lines);
  const mergedSkills = skills.length > 0 ? skills : parseSkillsFallback(lines);

  return {
    personalInfo: mergedPersonal,
    experience: mergedExperience.length > 0 ? mergedExperience : [],
    education: mergedEducation.length > 0 ? mergedEducation : [],
    projects: mergedProjects.length > 0 ? mergedProjects : [],
    skills: mergedSkills,
  };
};

export const extractTextFromTextFile = async (file: File) => {
  return file.text();
};

export const extractTextFromPdf = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pageTexts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const linesByY: Record<number, Array<{ x: number; text: string }>> = {};
    content.items.forEach((item: any) => {
      const y = Math.round(item.transform[5] * 100) / 100;
      const x = Math.round(item.transform[4] * 100) / 100;
      if (!linesByY[y]) {
        linesByY[y] = [];
      }
      linesByY[y].push({ x, text: item.str });
    });

    const pageText = Object.keys(linesByY)
      .sort((a, b) => Number(b) - Number(a))
      .map((y) =>
        linesByY[Number(y)]
          .sort((a, b) => a.x - b.x)
          .map((item) => item.text)
          .join(" ")
      )
      .join("\n");

    pageTexts.push(pageText);
  }

  return pageTexts.join("\n");
};

export const extractTextFromDocx = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value;
};

export const extractTextFromFile = async (file: File) => {
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith(".pdf")) {
    return extractTextFromPdf(file);
  }
  if (fileName.endsWith(".docx")) {
    return extractTextFromDocx(file);
  }
  return extractTextFromTextFile(file);
};
