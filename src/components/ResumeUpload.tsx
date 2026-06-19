import React, { useState } from "react";
import { useResume } from "../context/ResumeContext";
import { extractTextFromFile, parseResumeTextToData } from "../utils/resumeParser";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";

export const ResumeUpload: React.FC = () => {
  const { setResumeData } = useResume();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>(
    "Upload a PDF, DOCX, or TXT resume to auto-fill your CV builder."
  );
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setStatus("loading");
    setMessage("Reading file and parsing resume data...");
    setFileName(file.name);

    try {
      const text = await extractTextFromFile(file);
      const parsed = parseResumeTextToData(text);
      setResumeData(parsed);
      setStatus("success");
      setMessage("Resume parsed and loaded into the editor.");
    } catch (error) {
      console.error("Resume upload failed:", error);
      setStatus("error");
      setMessage(
        "Could not parse the uploaded file. Please try a different resume or use a supported PDF, DOCX, or TXT file."
      );
    }
  };

  return (
    <div className="upload-panel">
      <div className="upload-header">
        <Upload size={18} className="upload-icon" />
        <div>
          <div className="upload-title">Upload your existing CV</div>
          <div className="upload-description">Automatic resume detection and field population.</div>
        </div>
        {status === "success" && (
          <div className="upload-status-badge">Loaded into editor</div>
        )}
      </div>

      <label className="upload-dropzone">
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileUpload}
          className="upload-input"
        />
        <div className="upload-instructions">
          {status === "loading" && "Parsing resume…"}
          {status === "success" && (
            <>
              <CheckCircle2 size={16} /> {fileName ? `Parsed and loaded: ${fileName}` : "Resume imported successfully."}
            </>
          )}
          {status === "error" && (
            <>
              <AlertCircle size={16} /> Unable to parse file.
            </>
          )}
          {status === "idle" && message}
        </div>
        <button type="button" className="btn btn-secondary btn-sm upload-button">
          Select file to upload
        </button>
      </label>

    </div>
  );
};
