import React from "react";
import { useResume } from "../../context/ResumeContext";
import { Plus, Trash2, FolderGit2 } from "lucide-react";

export const ProjectsForm: React.FC = () => {
  const { resumeData, setResumeData } = useResume();
  const { projects } = resumeData;

  const handleItemChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setResumeData((prev) => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value,
      };
      return {
        ...prev,
        projects: updatedProjects,
      };
    });
  };

  const addItem = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          technologies: "",
          link: "",
          description: "",
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="form-section">
      <div className="form-group-title">
        <FolderGit2 className="logo-icon" style={{ padding: '0.2rem', width: '1.5rem', height: '1.5rem' }} />
        Projects
      </div>

      <div className="array-items-list">
        {projects.map((item, index) => (
          <div key={index} className="array-item-card">
            <div className="array-item-header">
              <span className="array-item-title">
                {item.title || `Project #${index + 1}`}
              </span>
              <button
                type="button"
                className="btn-icon btn-icon-danger"
                onClick={() => removeItem(index)}
                title="Remove project"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Project Title</label>
                <input
                  className="form-input"
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    handleItemChange(index, "title", e.target.value)
                  }
                  placeholder="DevMetrics Dashboard"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Technologies Used</label>
                <input
                  className="form-input"
                  type="text"
                  value={item.technologies}
                  onChange={(e) =>
                    handleItemChange(index, "technologies", e.target.value)
                  }
                  placeholder="React, TypeScript, AWS"
                />
              </div>

              <div className="form-field full-width">
                <label className="form-label">Project Link (Optional)</label>
                <input
                  className="form-input"
                  type="text"
                  value={item.link || ""}
                  onChange={(e) =>
                    handleItemChange(index, "link", e.target.value)
                  }
                  placeholder="github.com/username/project"
                />
              </div>

              <div className="form-field full-width">
                <label className="form-label">Description / Core Functionality</label>
                <textarea
                  className="form-textarea"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  placeholder="Briefly describe what you built, what problem it solves, and the outcomes..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="add-item-placeholder" onClick={addItem}>
        <Plus size={16} />
        Add Project Entry
      </button>
    </div>
  );
};
