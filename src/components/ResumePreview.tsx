import React, { useState } from "react";
import { useResume } from "../context/ResumeContext";
import { TemplateOne } from "./templates/TemplateOne";
import { TemplateTwo } from "./templates/TemplateTwo";
import { TemplateThree } from "./templates/TemplateThree";
import { downloadPDF } from "../utils/pdfGenerator";
import { startCvDownloadPayment } from "../utils/razorpay";
import { Download, ZoomIn, ZoomOut, RotateCcw, Palette, Type, LayoutTemplate } from "lucide-react";

export const ResumePreview: React.FC = () => {
  const {
    resumeData,
    activeTemplate,
    setActiveTemplate,
    accentColor,
    setAccentColor,
    fontFamily,
    setFontFamily,
    resetToSample,
    clearAll,
  } = useResume();

  const [zoom, setZoom] = useState<number>(0.85); // Default display zoom to fit typical desktop layout
  const [isDownloading, setIsDownloading] = useState(false);

  const colors = [
    { name: "Navy", value: "#1e3a8a" },
    { name: "Indigo", value: "#4f46e5" },
    { name: "Teal", value: "#0f766e" },
    { name: "Emerald", value: "#047857" },
    { name: "Slate", value: "#334155" },
    { name: "Burgundy", value: "#881337" },
  ];

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.05, 1.2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.05, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(0.85);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await startCvDownloadPayment({
        name: resumeData.personalInfo.fullName,
        email: resumeData.personalInfo.email,
        contact: resumeData.personalInfo.phone,
        themeColor: accentColor,
      });
      await downloadPDF();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Payment or PDF download failed.";
      console.error("Payment or PDF download failed:", error);
      alert(message);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderTemplate = () => {
    switch (activeTemplate) {
      case "classic":
        return <TemplateOne />;
      case "modern":
        return <TemplateTwo />;
      case "tech":
        return <TemplateThree />;
      default:
        return <TemplateOne />;
    }
  };

  return (
    <div className="preview-panel">
      {/* Toolbar */}
      <div className="preview-toolbar">
        {/* Template Selector */}
        <div className="toolbar-group">
          <LayoutTemplate size={16} className="logo-icon" style={{ padding: '0.15rem' }} />
          <span className="toolbar-label">Template</span>
          <select
            className="style-selector"
            value={activeTemplate}
            onChange={(e) => setActiveTemplate(e.target.value)}
          >
            <option value="classic">Classic Corporate</option>
            <option value="modern">Modern Minimalist</option>
            <option value="tech">Tech Professional</option>
          </select>
        </div>

        {/* Accent Color Dot Picker */}
        <div className="toolbar-group">
          <Palette size={16} className="logo-icon" style={{ padding: '0.15rem' }} />
          <span className="toolbar-label">Accent</span>
          <div className="color-dot-picker">
            {colors.map((color) => (
              <div
                key={color.value}
                className={`color-dot ${accentColor === color.value ? "active" : ""}`}
                style={{ backgroundColor: color.value }}
                onClick={() => setAccentColor(color.value)}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Font Picker */}
        <div className="toolbar-group">
          <Type size={16} className="logo-icon" style={{ padding: '0.15rem' }} />
          <span className="toolbar-label">Font</span>
          <select
            className="style-selector"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          >
            <option value="serif">Georgia (Serif)</option>
            <option value="sans">Inter (Sans)</option>
            <option value="mono">Geist (Mono)</option>
          </select>
        </div>

        {/* Zoom Controls */}
        <div className="toolbar-group">
          <div className="zoom-controls">
            <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out">
              <ZoomOut size={14} />
            </button>
            <span className="zoom-text">{Math.round(zoom * 100)}%</span>
            <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In">
              <ZoomIn size={14} />
            </button>
            <button className="zoom-btn" onClick={handleResetZoom} title="Reset Zoom">
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Download Action */}
        <button
          className="btn btn-primary"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download size={15} />
          {isDownloading ? "Processing..." : "Pay ₹99 & Download"}
        </button>
      </div>

      {/* Editor utility actions (top right corner of workspace, reset/clear) */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0.5rem 1.5rem", gap: "0.75rem", background: "#111827", borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
        <button className="btn btn-secondary btn-sm" onClick={resetToSample} style={{ fontSize: "0.75rem" }}>
          Load Sample Data
        </button>
        <button className="btn btn-danger btn-sm" onClick={clearAll} style={{ fontSize: "0.75rem" }}>
          Clear All Details
        </button>
      </div>

      {/* Paper Canvas Viewport */}
      <div className="preview-canvas-viewport">
        <div
          className="pdf-scale-container"
          style={{ transform: `scale(${zoom})` }}
        >
          <div
            id="resume"
            className={`resume-paper-shadow font-${fontFamily}`}
            style={{ minHeight: "297mm" }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
