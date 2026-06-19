import React, { useState } from "react";
import { PersonalInfoForm } from "../components/forms/PersonalInfoForm";
import { ExperienceForm } from "../components/forms/ExperienceForm";
import { EducationForm } from "../components/forms/EducationForm";
import { SkillsForm } from "../components/forms/SkillsForm";
import { ProjectsForm } from "../components/forms/ProjectsForm";
import { ResumeUpload } from "../components/ResumeUpload";
import { ResumePreview } from "../components/ResumePreview";
import ResumeScore from "../components/ResumeScore";
import { User, Briefcase, GraduationCap, Code, FolderGit2, Sparkles, FileEdit, Eye } from "lucide-react";

type TabType = "personal" | "experience" | "education" | "skills" | "projects";

export const Builder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");

  const renderActiveForm = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfoForm />;
      case "experience":
        return <ExperienceForm />;
      case "education":
        return <EducationForm />;
      case "skills":
        return <SkillsForm />;
      case "projects":
        return <ProjectsForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  const tabs = [
    { id: "personal" as TabType, label: "Personal Details", icon: <User size={16} /> },
    { id: "experience" as TabType, label: "Work History", icon: <Briefcase size={16} /> },
    { id: "projects" as TabType, label: "Projects", icon: <FolderGit2 size={16} /> },
    { id: "education" as TabType, label: "Education", icon: <GraduationCap size={16} /> },
    { id: "skills" as TabType, label: "Skills", icon: <Code size={16} /> },
  ];

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="app-header">
        <div className="logo-container">
          <Sparkles className="logo-icon animate-pulse" />
          <div className="logo-text">ATS CV Engine</div>
        </div>
        <ResumeScore />
      </header>

      {/* Workspace Panel Split */}
      <main className={`dashboard-workspace show-${mobileView}`}>
        {/* Editor (Left Pane) */}
        <section className="editor-panel">
          <div className="editor-tabs-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`editor-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <ResumeUpload />

          <div className="editor-content-viewport">{renderActiveForm()}</div>
        </section>

        {/* Live Preview (Right Pane) */}
        <ResumePreview />

        {/* Mobile View Bottom Navigation Bar */}
        <div className="mobile-view-toggle">
          <button
            className={`mobile-toggle-btn ${mobileView === "editor" ? "active" : ""}`}
            onClick={() => setMobileView("editor")}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <FileEdit size={16} />
              Editor
            </span>
          </button>
          <button
            className={`mobile-toggle-btn ${mobileView === "preview" ? "active" : ""}`}
            onClick={() => setMobileView("preview")}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Eye size={16} />
              Live CV Preview
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};
export default Builder;
