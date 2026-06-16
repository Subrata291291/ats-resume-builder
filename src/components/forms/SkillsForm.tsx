import React, { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { Plus, X, Code } from "lucide-react";

export const SkillsForm: React.FC = () => {
  const { resumeData, setResumeData } = useResume();
  const { skills } = resumeData;
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmedSkill = newSkill.trim();
    if (!trimmedSkill) return;

    // Avoid duplicates
    if (skills.includes(trimmedSkill)) {
      setNewSkill("");
      return;
    }

    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmedSkill],
    }));
    setNewSkill("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  return (
    <div className="form-section">
      <div className="form-group-title">
        <Code className="logo-icon" style={{ padding: '0.2rem', width: '1.5rem', height: '1.5rem' }} />
        Professional Skills
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="skillInput">
          Add Skill (Type and press Enter)
        </label>
        <form onSubmit={handleAddSkill} className="skills-input-container">
          <input
            className="form-input"
            type="text"
            id="skillInput"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. React, TypeScript, Python, Project Management"
          />
          <button
            type="button"
            className="btn btn-primary btn-icon"
            onClick={() => handleAddSkill()}
            style={{ width: "2.75rem", height: "2.75rem", padding: 0 }}
          >
            <Plus size={18} />
          </button>
        </form>
      </div>

      {skills.length > 0 ? (
        <div>
          <label className="form-label">Added Skills ({skills.length})</label>
          <div className="skills-tags-grid">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                <span
                  className="skill-tag-remove"
                  onClick={() => removeSkill(skill)}
                  title={`Remove ${skill}`}
                >
                  <X size={12} />
                </span>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>
          No skills added yet. Add some skills to populate your CV.
        </div>
      )}
    </div>
  );
};
