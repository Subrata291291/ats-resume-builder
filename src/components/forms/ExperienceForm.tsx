import React from "react";
import { useResume } from "../../context/ResumeContext";
import { Plus, Trash2, Briefcase } from "lucide-react";

export const ExperienceForm: React.FC = () => {
  const { resumeData, setResumeData } = useResume();
  const { experience } = resumeData;

  const handleItemChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setResumeData((prev) => {
      const updatedExperience = [...prev.experience];
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value,
      };
      return {
        ...prev,
        experience: updatedExperience,
      };
    });
  };

  const addItem = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          role: "",
          duration: "",
          location: "",
          description: "",
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="form-section">
      <div className="form-group-title">
        <Briefcase className="logo-icon" style={{ padding: '0.2rem', width: '1.5rem', height: '1.5rem' }} />
        Work Experience
      </div>

      <div className="array-items-list">
        {experience.map((item, index) => (
          <div key={index} className="array-item-card">
            <div className="array-item-header">
              <span className="array-item-title">
                {item.company || `Role #${index + 1}`} {item.role ? `(${item.role})` : ""}
              </span>
              <button
                type="button"
                className="btn-icon btn-icon-danger"
                onClick={() => removeItem(index)}
                title="Remove experience"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Company Name</label>
                <input
                  className="form-input"
                  type="text"
                  value={item.company}
                  onChange={(e) =>
                    handleItemChange(index, "company", e.target.value)
                  }
                  placeholder="InnovateTech Solutions"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Job Title / Role</label>
                <input
                  className="form-input"
                  type="text"
                  value={item.role}
                  onChange={(e) =>
                    handleItemChange(index, "role", e.target.value)
                  }
                  placeholder="Senior Frontend Engineer"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Duration</label>
                <input
                  className="form-input"
                  type="text"
                  value={item.duration}
                  onChange={(e) =>
                    handleItemChange(index, "duration", e.target.value)
                  }
                  placeholder="Jan 2023 - Present or 2020 - 2022"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Location (Optional)</label>
                <input
                  className="form-input"
                  type="text"
                  value={item.location || ""}
                  onChange={(e) =>
                    handleItemChange(index, "location", e.target.value)
                  }
                  placeholder="San Francisco, CA"
                />
              </div>

              <div className="form-field full-width">
                <label className="form-label">
                  Description / Achievements (One point per line)
                </label>
                <textarea
                  className="form-textarea"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  placeholder="Spearheaded migration of legacy dashboard, achieving 45% load speed gains.&#10;Designed reusable components reducing development time by 30%."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="add-item-placeholder" onClick={addItem}>
        <Plus size={16} />
        Add Work Experience
      </button>
    </div>
  );
};
