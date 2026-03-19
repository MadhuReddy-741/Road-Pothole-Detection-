import { useState, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function DetectionDemo() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      // If backend not available, show mock result for demo
      setResult({
        label: "Pothole Detected",
        confidence: 87.4,
        severity: "High",
        pothole: true,
        coordinates: { lat: 17.385, lng: 78.4867 },
        note: "(Demo mode — connect backend for real inference)",
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const severityColor = (sev) => {
    if (!sev) return "var(--text2)";
    if (sev === "High") return "var(--red)";
    if (sev === "Medium") return "var(--yellow)";
    return "var(--green)";
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div className="badge badge-orange" style={{ marginBottom: 16 }}>Live Demo</div>
          <h1 style={{ fontSize: "clamp(28px,4vw,48px)", marginBottom: 12 }}>
            Pothole Detection
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 16 }}>
            Upload a road image and let the CNN model classify it in real time.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: "start" }}>
          {/* Upload Panel */}
          <div>
            <div
              style={{
                ...s.dropzone,
                borderColor: dragOver ? "var(--accent)" : preview ? "var(--green)" : "var(--border)",
                background: dragOver ? "rgba(249,115,22,0.05)" : "var(--surface)",
              }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !preview && inputRef.current.click()}
            >
              {preview ? (
                <div style={{ position: "relative" }}>
                  <img src={preview} alt="preview" style={s.previewImg} />
                  <button onClick={(e) => { e.stopPropagation(); reset(); }} style={s.removeBtn}>✕</button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
                  <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                    Drop image here
                  </p>
                  <p style={{ color: "var(--text2)", fontSize: 13 }}>or click to browse — JPG, PNG, WEBP</p>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            {file && (
              <div style={s.fileInfo}>
                <span style={{ color: "var(--text2)", fontSize: 13 }}>📎 {file.name}</span>
                <span style={{ color: "var(--text3)", fontSize: 12 }}>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={!file || loading}
              style={{ width: "100%", justifyContent: "center", marginTop: 16, opacity: !file ? 0.5 : 1 }}
            >
              {loading ? (
                <>
                  <span style={s.spinner} /> Analyzing...
                </>
              ) : "🔍 Analyze Image"}
            </button>
          </div>

          {/* Result Panel */}
          <div>
            {!result && !loading && (
              <div style={s.placeholder}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🛣️</div>
                <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                  Awaiting Image
                </p>
                <p style={{ color: "var(--text2)", fontSize: 13, textAlign: "center", maxWidth: 220 }}>
                  Upload a road photo and click Analyze to see the AI result
                </p>
              </div>
            )}

            {loading && (
              <div style={s.placeholder}>
                <div style={s.loadingRing} />
                <p style={{ fontFamily: "Syne, sans-serif", fontSize: 16, marginTop: 24 }}>
                  Running CNN inference...
                </p>
                <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 6 }}>
                  Convolving feature maps →
                </p>
              </div>
            )}

            {result && (
              <div style={s.resultCard}>
                {/* Verdict */}
                <div style={s.verdict}>
                  <span style={{ fontSize: 40 }}>{result.pothole ? "⚠️" : "✅"}</span>
                  <div>
                    <div style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      color: result.pothole ? "var(--red)" : "var(--green)",
                    }}>
                      {result.label}
                    </div>
                    <div style={{ color: "var(--text2)", fontSize: 13, marginTop: 2 }}>
                      Model prediction
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div style={s.metricsGrid}>
                  <MetricBox label="Confidence" value={`${result.confidence?.toFixed(1)}%`} />
                  <MetricBox
                    label="Severity"
                    value={result.severity || "N/A"}
                    color={severityColor(result.severity)}
                  />
                  <MetricBox label="Latitude" value={result.coordinates?.lat?.toFixed(4) ?? "—"} />
                  <MetricBox label="Longitude" value={result.coordinates?.lng?.toFixed(4) ?? "—"} />
                </div>

                {/* Confidence bar */}
                <div style={{ marginTop: 20 }}>
                  <div style={s.barLabel}>
                    <span style={{ fontSize: 12, color: "var(--text2)" }}>Confidence</span>
                    <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>
                      {result.confidence?.toFixed(1)}%
                    </span>
                  </div>
                  <div style={s.barBg}>
                    <div
                      style={{
                        ...s.barFill,
                        width: `${result.confidence}%`,
                        background: result.pothole
                          ? "linear-gradient(90deg, var(--red), var(--yellow))"
                          : "linear-gradient(90deg, var(--green), #86efac)",
                      }}
                    />
                  </div>
                </div>

                {result.note && (
                  <p style={{ marginTop: 16, fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>
                    {result.note}
                  </p>
                )}

                <button className="btn btn-outline" onClick={reset} style={{ width: "100%", justifyContent: "center", marginTop: 20 }}>
                  ↩ Analyze Another
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div style={s.tips}>
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>💡 Tips for best results</h3>
          <div className="grid-3" style={{ gap: 12 }}>
            {[
              "Use clear, top-down road photos",
              "Good lighting improves accuracy",
              "Avoid extremely blurry images",
            ].map((tip) => (
              <div key={tip} style={s.tip}>{tip}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricBox({ label, value, color }) {
  return (
    <div style={{
      background: "var(--bg3)",
      borderRadius: 10,
      padding: "14px 16px",
      border: "1px solid var(--border)",
    }}>
      <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{
        fontFamily: "Syne, sans-serif",
        fontWeight: 700,
        fontSize: 18,
        color: color || "var(--text)",
      }}>
        {value}
      </div>
    </div>
  );
}

const s = {
  dropzone: {
    border: "2px dashed",
    borderRadius: "var(--radius-lg)",
    cursor: "pointer",
    transition: "all 0.2s",
    minHeight: 240,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  previewImg: {
    width: "100%",
    maxHeight: 320,
    objectFit: "cover",
    borderRadius: 10,
    display: "block",
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 28,
    height: 28,
    cursor: "pointer",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fileInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
    padding: "8px 12px",
    background: "var(--bg3)",
    borderRadius: 8,
    border: "1px solid var(--border)",
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
  placeholder: {
    height: 340,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--surface)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border)",
  },
  loadingRing: {
    width: 56,
    height: 56,
    border: "3px solid var(--border)",
    borderTop: "3px solid var(--accent)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  resultCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: 24,
  },
  verdict: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "16px 20px",
    background: "var(--bg3)",
    borderRadius: 12,
    marginBottom: 20,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  barLabel: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  barBg: {
    height: 8,
    background: "var(--bg3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 1s ease",
  },
  tips: {
    marginTop: 48,
    padding: 24,
    background: "var(--bg2)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border)",
  },
  tip: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    color: "var(--text2)",
  },
};
