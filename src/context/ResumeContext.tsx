import React, { createContext, useContext, useState, type ReactNode } from "react";
import type { ResumeData } from "../types/resume";

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  activeTemplate: string;
  setActiveTemplate: (template: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  resetToSample: () => void;
  clearAll: () => void;
}

const sampleData: ResumeData = {
  personalInfo: {
    fullName: "Alex Morgan",
    title: "Senior Software Engineer",
    email: "alex.morgan@email.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    website: "alexmorgan.dev",
    summary: "Dynamic and results-driven Senior Software Engineer with 6+ years of experience designing and implementing scalable web applications. Proficient in React, TypeScript, Node.js, and cloud architectures. Adept at leading engineering squads, optimizing frontend performances by up to 40%, and delivering high-quality, maintainable codebases.",
  },
  experience: [
    {
      company: "InnovateTech Solutions",
      role: "Senior Frontend Engineer",
      duration: "Jan 2023 - Present",
      location: "San Francisco, CA",
      description: "Spearheaded the migration of a legacy dashboard to React 18 & TypeScript, achieving a 45% improvement in Core Web Vitals.\nDesigned and developed an internal reusable UI component library, reducing feature development time across 3 departments by 30%.\nMentored 5 junior engineers and introduced automated testing processes, elevating code coverage from 55% to 85%.",
    },
    {
      company: "StackFlow Corp",
      role: "Software Engineer",
      duration: "Jun 2020 - Dec 2022",
      location: "Boston, MA",
      description: "Developed and maintained high-traffic web applications using React, Redux, and Node.js, serving over 1M monthly active users.\nIntegrated third-party payment gateways (Stripe) and optimized RESTful APIs, reducing transaction failure rates by 12%.\nCollaborated closely with UX/UI designers to construct accessible, responsive interfaces adhering to WCAG guidelines.",
    }
  ],
  education: [
    {
      college: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      year: "2016 - 2020",
      location: "Berkeley, CA",
    }
  ],
  projects: [
    {
      title: "DevMetrics Dashboard",
      technologies: "React, TypeScript, GraphQL, Chart.js",
      link: "github.com/alexmorgan/devmetrics",
      description: "A real-time developer productivity dashboard aggregating commits, PR reviews, and deployment cycles from GitHub APIs. Handled concurrent OAuth workflows and visualized data patterns.",
    },
    {
      title: "SecureAuth Middleware",
      technologies: "Node.js, Express, Redis, JWT",
      link: "github.com/alexmorgan/secureauth",
      description: "Lightweight, high-performance authentication middleware supporting token revocation and IP-based rate limiting. Scaled to handle 5,000+ req/sec using Redis caching.",
    }
  ],
  skills: [
    "TypeScript", "React", "Next.js", "Node.js", "Express", "GraphQL", "Redux", "SQL", "MongoDB", "AWS (S3/Lambda)", "Git", "Docker"
  ],
};

const emptyData: ResumeData = {
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  projects: [],
  skills: [],
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(sampleData);
  const [activeTemplate, setActiveTemplate] = useState<string>("classic");
  const [accentColor, setAccentColor] = useState<string>("#1e3a8a"); // Navy slate default
  const [fontFamily, setFontFamily] = useState<string>("serif"); // Classic resume serif (Georgia)

  const resetToSample = () => {
    setResumeData(sampleData);
  };

  const clearAll = () => {
    setResumeData(emptyData);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        activeTemplate,
        setActiveTemplate,
        accentColor,
        setAccentColor,
        fontFamily,
        setFontFamily,
        resetToSample,
        clearAll,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
