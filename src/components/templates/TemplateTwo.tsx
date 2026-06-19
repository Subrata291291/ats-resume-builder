import React from "react";
import { useResume } from "../../context/ResumeContext";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export const TemplateTwo: React.FC = () => {
  const { resumeData, accentColor } = useResume();
  const { personalInfo, experience, education, projects, skills } = resumeData;

  return (
    <div className="template-modern">
      {/* Left Column (Contact & Skills) */}
      <div className="template-modern-left">
        {personalInfo.profilePhoto && (
          <div style={{ marginBottom: "0.6rem" }}>
            <img src={personalInfo.profilePhoto} alt="Profile" style={{ width: 88, height: 88, objectFit: "cover", borderRadius: 8, border: `2px solid ${accentColor}` }} />
          </div>
        )}
        <h1 className="resume-name" style={{ color: accentColor, fontSize: "20pt", marginBottom: "0.25rem" }}>
          {personalInfo.fullName.split(" ")[0]}
          {personalInfo.fullName.split(" ").slice(1).length > 0 && (
            <span style={{ display: "block", fontWeight: 300, color: "#4b5563" }}>
              {personalInfo.fullName.split(" ").slice(1).join(" ")}
            </span>
          )}
        </h1>
        <div className="resume-title" style={{ fontSize: "10.5pt", color: accentColor, fontWeight: 600, marginBottom: "1.5rem" }}>
          {personalInfo.title}
        </div>

        <div className="resume-contact-bar">
          {personalInfo.email && (
            <span className="resume-contact-item">
              <Mail size={11} style={{ color: accentColor }} />
              <span style={{ fontSize: "8.5pt", wordBreak: "break-all" }}>{personalInfo.email}</span>
            </span>
          )}
          {personalInfo.phone && (
            <span className="resume-contact-item">
              <Phone size={11} style={{ color: accentColor }} />
              <span style={{ fontSize: "8.5pt" }}>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.location && (
            <span className="resume-contact-item">
              <MapPin size={11} style={{ color: accentColor }} />
              <span style={{ fontSize: "8.5pt" }}>{personalInfo.location}</span>
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="resume-contact-item">
              <svg viewBox="0 0 24 24" width="11" height="11" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.2rem" }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              <span style={{ fontSize: "8.5pt", wordBreak: "break-all" }}>{personalInfo.linkedin}</span>
            </span>
          )}
          {personalInfo.github && (
            <span className="resume-contact-item">
              <svg viewBox="0 0 24 24" width="11" height="11" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.2rem" }}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              <span style={{ fontSize: "8.5pt", wordBreak: "break-all" }}>{personalInfo.github}</span>
            </span>
          )}
          {personalInfo.website && (
            <span className="resume-contact-item">
              <Globe size={11} style={{ color: accentColor }} />
              <span style={{ fontSize: "8.5pt", wordBreak: "break-all" }}>{personalInfo.website}</span>
            </span>
          )}
        </div>

        {skills.length > 0 && (
          <div className="resume-section" style={{ marginTop: "1.5rem" }}>
            <h2 className="resume-section-title" style={{ borderBottomColor: accentColor, fontSize: "10pt" }}>
              Key Skills
            </h2>
            <div className="resume-skills-grid" style={{ gap: "4px" }}>
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="resume-skill-badge"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#d1d5db",
                    fontSize: "8pt",
                    padding: "0.1rem 0.4rem"
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column (Experience, Projects, Education) */}
      <div className="template-modern-right">
        {personalInfo.summary && (
          <div className="resume-section" style={{ marginTop: 0 }}>
            <h2 className="resume-section-title" style={{ borderBottomColor: accentColor, marginTop: 0 }}>
              Professional Profile
            </h2>
            <p className="resume-section-desc" style={{ fontSize: "9pt", lineHeight: 1.45 }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience.length > 0 && (
          <div className="resume-section">
            <h2 className="resume-section-title" style={{ borderBottomColor: accentColor }}>
              Experience
            </h2>
            <div className="resume-list" style={{ gap: "0.6rem" }}>
              {experience.map((item, index) => (
                <div key={index} className="resume-item">
                  <div className="resume-item-row">
                    <span className="resume-item-main" style={{ color: accentColor }}>
                      {item.role}
                    </span>
                    <span className="resume-item-right-sub" style={{ fontWeight: 600 }}>
                      {item.duration}
                    </span>
                  </div>
                  <div className="resume-item-row" style={{ marginBottom: "0.2rem" }}>
                    <span className="resume-item-sub" style={{ fontStyle: "normal", fontWeight: 600, color: "#1f2937" }}>
                      {item.company}
                    </span>
                    <span className="resume-item-right" style={{ fontSize: "8.5pt", fontStyle: "italic" }}>
                      {item.location}
                    </span>
                  </div>
                  {item.description && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                      {item.description.split("\n").filter(line => line.trim() !== "").map((bullet, idx) => (
                        <p key={idx} className="resume-item-details" style={{ fontSize: "8.5pt" }}>
                          {bullet.replace(/^-\s*/, "")}
                        </p>
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
              Projects
            </h2>
            <div className="resume-list" style={{ gap: "0.6rem" }}>
              {projects.map((item, index) => (
                <div key={index} className="resume-item">
                  <div className="resume-item-row">
                    <span className="resume-item-main" style={{ color: accentColor }}>
                      {item.title}
                    </span>
                    <span className="resume-item-right-sub">{item.link}</span>
                  </div>
                  <div style={{ fontSize: "8.5pt", color: "#4b5563", fontWeight: 500, margin: "1px 0" }}>
                    Technologies: {item.technologies}
                  </div>
                  {item.description && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                      {item.description.split("\n").filter(line => line.trim() !== "").map((bullet, idx) => (
                        <p key={idx} className="resume-item-details" style={{ fontSize: "8.5pt" }}>
                          {bullet.replace(/^-\s*/, "")}
                        </p>
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
            <div className="resume-list" style={{ gap: "0.5rem" }}>
              {education.map((item, index) => (
                <div key={index} className="resume-item">
                  <div className="resume-item-row">
                    <span className="resume-item-main">{item.degree}</span>
                    <span className="resume-item-right-sub" style={{ fontWeight: 600 }}>{item.year}</span>
                  </div>
                  <div className="resume-item-row">
                    <span className="resume-item-sub" style={{ fontStyle: "normal", color: "#374151" }}>
                      {item.college}
                    </span>
                    <span className="resume-item-right" style={{ fontSize: "8.5pt" }}>{item.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
