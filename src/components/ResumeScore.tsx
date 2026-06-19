import React, { useMemo } from "react";
import { useResume } from "../context/ResumeContext";
import { scoreResume } from "../utils/resumeScorer";

export const ResumeScore: React.FC = () => {
  const { resumeData } = useResume();

  const result = useMemo(() => scoreResume(resumeData), [resumeData]);

  return (
    <div className="resume-score" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{result.score}%</div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Resume Score</div>
      </div>
      <div style={{ minWidth: 180 }}>
        <progress value={result.score} max={100} style={{ width: "100%", height: 12 }} />
        {result.suggestions.length > 0 ? (
          <div style={{ marginTop: 6 }}>
            <details style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              <summary style={{ cursor: "pointer" }}>Improvement suggestions ({result.suggestions.length})</summary>
              <ul style={{ marginTop: 8 }}>
                {result.suggestions.slice(0, 5).map((s, i) => (
                  <li key={i} style={{ color: "var(--text-secondary)", marginBottom: 6 }}>{s}</li>
                ))}
              </ul>
            </details>
          </div>
        ) : (
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 6 }}>Looks good — no immediate suggestions.</div>
        )}
      </div>
    </div>
  );
};

export default ResumeScore;
