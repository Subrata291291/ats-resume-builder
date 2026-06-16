import React from "react";
import { useResume } from "../../context/ResumeContext";
import { Plus, Trash2, GraduationCap } from "lucide-react";

export const EducationForm: React.FC = () => {
  const { resumeData, setResumeData } = useResume();
  const { education } = resumeData;

  const handleItemChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setResumeData((prev) => {
      const updatedEducation = [...prev.education];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value,
      };
      return {
        ...prev,
        education: updatedEducation,
      };
    });
  };

  const addItem = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          college: "",
          degree: "",
          year: "",
          location: "",
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="form-section">
      <div className="form-group-title">
        <GraduationCap className="logo-icon" style={{ padding: '0.2rem', width: '1.5rem', height: '1.5rem' }} />
        Education History
      </div>

      <div className="array-items-list">
        {education.map((item, index) => (
          <div key={index} className="array-item-card">
            <div className="array-item-header">
              <span className="array-item-title">
                {item.college || `School/University #${index + 1}`} {item.degree ? `(${item.degree})` : ""}
              </span>
              <button
                type="button"
                className="btn-icon btn-icon-danger"
                onClick={() => removeItem(index)}
                title="Remove education"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">School / University</label>
                <input
                  className="form-input"
                  type="text"
                  value={item.college}
                  onChange={(e) =>
                    handleItemChange(index, "college", e.target.value)
                  }
                  placeholder="University of California, Berkeley"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Degree / Field of Study</label>
                <input
                  className="form-input"
                  type="text"
                  value={item.degree}
                  onChange={(e) =>
                    handleItemChange(index, "degree", e.target.value)
                  }
                  placeholder="B.S. in Computer Science"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Graduation Year / Period</label>
                <input
                  className="form-input"
                  type="text"
                  value={item.year}
                  onChange={(e) =>
                    handleItemChange(index, "year", e.target.value)
                  }
                  placeholder="2016 - 2020 or 2021"
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
                  placeholder="Berkeley, CA"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="add-item-placeholder" onClick={addItem}>
        <Plus size={16} />
        Add Education Entry
      </button>
    </div>
  );
};
