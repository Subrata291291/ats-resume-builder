import React from "react";
import { useResume } from "../../context/ResumeContext";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export const TemplateOne: React.FC = () => {
  const { resumeData, accentColor } = useResume();
  const { personalInfo, experience, education, projects, skills } = resumeData;

  const renderContactInfo = () => {
    return (
      <div className="resume-contact-bar">
        {personalInfo.email && (
          <span className="resume-contact-item">
            <Mail size={11} />
            {personalInfo.email}
          </span>
        )}
        {personalInfo.phone && (
          <span className="resume-contact-item">
            <Phone size={11} />
            {personalInfo.phone}
          </span>
        )}
        {personalInfo.location && (
          <span className="resume-contact-item">
            <MapPin size={11} />
            {personalInfo.location}
          </span>
        )}
        {personalInfo.linkedin && (
          <span className="resume-contact-item">
            <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.2rem" }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
            {personalInfo.linkedin}
          </span>
        )}
        {personalInfo.github && (
          <span className="resume-contact-item">
            <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.2rem" }}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            {personalInfo.github}
          </span>
        )}
        {personalInfo.website && (
          <span className="resume-contact-item">
            <Globe size={11} />
            {personalInfo.website}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="template-classic">
      <div className="resume-header">
        <h1 className="resume-name" style={{ color: accentColor }}>
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        <div className="resume-title" style={{ color: "#4b5563" }}>
          {personalInfo.title || "Your Professional Title"}
        </div>
        {renderContactInfo()}
      </div>

      {personalInfo.summary && (
        <div className="resume-section">
          <h2 className="resume-section-title" style={{ borderBottomColor: accentColor }}>
            Professional Summary
          </h2>
          <p className="resume-section-desc">{personalInfo.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="resume-section">
          <h2 className="resume-section-title" style={{ borderBottomColor: accentColor }}>
            Professional Experience
          </h2>
          <div className="resume-list">
            {experience.map((item, index) => (
              <div key={index} className="resume-item">
                <div className="resume-item-row">
                  <span className="resume-item-main">{item.company}</span>
                  <span className="resume-item-right">{item.location}</span>
                </div>
                <div className="resume-item-row" style={{ marginBottom: "0.25rem" }}>
                  <span className="resume-item-sub">{item.role}</span>
                  <span className="resume-item-right-sub">{item.duration}</span>
                </div>
                {item.description && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    {item.description.split("\n").filter(line => line.trim() !== "").map((bullet, idx) => (
                      <p key={idx} className="resume-item-details">{bullet.replace(/^-\s*/, "")}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="resume-section">
          <h2 className="resume-section-title" style={{ borderBottomColor: accentColor }}>
            Key Projects
          </h2>
          <div className="resume-list">
            {projects.map((item, index) => (
              <div key={index} className="resume-item">
                <div className="resume-item-row">
                  <span className="resume-item-main">
                    {item.title}
                    {item.technologies && (
                      <span style={{ fontWeight: 400, fontSize: "8.5pt", color: "#4b5563", marginLeft: "6px" }}>
                        | {item.technologies}
                      </span>
                    )}
                  </span>
                  <span className="resume-item-right-sub">{item.link}</span>
                </div>
                {item.description && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
                    {item.description.split("\n").filter(line => line.trim() !== "").map((bullet, idx) => (
                      <p key={idx} className="resume-item-details">{bullet.replace(/^-\s*/, "")}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="resume-section">
          <h2 className="resume-section-title" style={{ borderBottomColor: accentColor }}>
            Education
          </h2>
          <div className="resume-list">
            {education.map((item, index) => (
              <div key={index} className="resume-item">
                <div className="resume-item-row">
                  <span className="resume-item-main">{item.college}</span>
                  <span className="resume-item-right">{item.location}</span>
                </div>
                <div className="resume-item-row">
                  <span className="resume-item-sub">{item.degree}</span>
                  <span className="resume-item-right-sub">{item.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="resume-section">
          <h2 className="resume-section-title" style={{ borderBottomColor: accentColor }}>
            Skills
          </h2>
          <div className="resume-skills-grid">
            {skills.map((skill, index) => (
              <span key={index} className="resume-skill-badge">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
