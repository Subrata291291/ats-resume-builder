import React, { useRef, useState } from "react";
import { useResume } from "../../context/ResumeContext";

export const PersonalInfoForm: React.FC = () => {
  const { resumeData, setResumeData } = useResume();
  const { personalInfo } = resumeData;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoError, setPhotoError] = useState<string>("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // Client-side validation: max 2MB
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setPhotoError("Image is too large. Please use an image under 2MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setPhotoError("");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setResumeData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          profilePhoto: result,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        profilePhoto: "",
      },
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
        <div className="form-field" style={{ alignSelf: "start" }}>
          <label className="form-label">Profile Photo (Optional)</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {personalInfo.profilePhoto ? (
              <img src={personalInfo.profilePhoto} alt="Profile" style={{ width: 88, height: 88, objectFit: "cover", borderRadius: 8, border: "2px solid rgba(255,255,255,0.08)" }} />
            ) : (
              <div style={{ width: 88, height: 88, background: "rgba(255,255,255,0.03)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>No Photo</div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "inline-block" }} />
              {photoError && (
                <div style={{ color: "#fecaca", fontSize: "0.8rem", marginTop: 4 }}>{photoError}</div>
              )}
              {personalInfo.profilePhoto && (
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleRemovePhoto} style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>Remove</button>
              )}
            </div>
          </div>
        </div>
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
