export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github?: string;
  website?: string;
  profilePhoto?: string; // data URL or public URL
  summary: string;
}

export interface Education {
  degree: string;
  college: string;
  year: string;
  location?: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  location?: string;
  description: string;
}

export interface Project {
  title: string;
  technologies: string;
  link?: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
}
