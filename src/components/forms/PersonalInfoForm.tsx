import React from "react";
import { useResume } from "../../context/ResumeContext";

export const PersonalInfoForm: React.FC = () => {
  const { resumeData, setResumeData } = useResume();
  const { personalInfo } = resumeData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };

  return (
    <div className="form-section">
      <div className="form-group-title">Personal Details</div>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="fullName">
            Full Name
          </label>
          <input
            className="form-input"
            type="text"
            id="fullName"
            name="fullName"
            value={personalInfo.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="title">
            Professional Title
          </label>
          <input
            className="form-input"
            type="text"
            id="title"
            name="title"
            value={personalInfo.title}
            onChange={handleChange}
            placeholder="Senior Product Designer"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <input
            className="form-input"
            type="email"
            id="email"
            name="email"
            value={personalInfo.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="phone">
            Phone Number
          </label>
          <input
            className="form-input"
            type="tel"
            id="phone"
            name="phone"
            value={personalInfo.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="location">
            Location
          </label>
          <input
            className="form-input"
            type="text"
            id="location"
            name="location"
            value={personalInfo.location}
            onChange={handleChange}
            placeholder="New York, NY"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="linkedin">
            LinkedIn Profile
          </label>
          <input
            className="form-input"
            type="text"
            id="linkedin"
            name="linkedin"
            value={personalInfo.linkedin}
            onChange={handleChange}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="github">
            GitHub Profile (Optional)
          </label>
          <input
            className="form-input"
            type="text"
            id="github"
            name="github"
            value={personalInfo.github || ""}
            onChange={handleChange}
            placeholder="github.com/johndoe"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="website">
            Portfolio Website (Optional)
          </label>
          <input
            className="form-input"
            type="text"
            id="website"
            name="website"
            value={personalInfo.website || ""}
            onChange={handleChange}
            placeholder="johndoe.com"
          />
        </div>

        <div className="form-field full-width">
          <label className="form-label" htmlFor="summary">
            Professional Summary
          </label>
          <textarea
            className="form-textarea"
            id="summary"
            name="summary"
            value={personalInfo.summary}
            onChange={handleChange}
            placeholder="Briefly describe your career goals, key accomplishments, and skillsets..."
          />
        </div>
      </div>
    </div>
  );
};
