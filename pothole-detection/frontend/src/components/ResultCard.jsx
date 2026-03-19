/**
 * ResultCard — Reusable component that renders a pothole detection result.
 * Used in DetectionDemo but can be embedded anywhere.
 *
 * Props:
 *   result  {object}   — API response from /predict
 *   onReset {function} — callback to clear the result
 */
export default function ResultCard({ result, onReset }) {
  if (!result) return null;

  const sevColor = (sev) => {
    if (sev === "High")   return "var(--red)";
    if (sev === "Medium") return "var(--yellow)";
    if (sev === "Low")    return "var(--green)";
    return "var(--text2)";
  };

  return (
    <div style={s.card}>
      {/* Verdict banner */}
      <div style={{
        ...s.verdict,
        background: result.pothole
          ? "rgba(239,68,68,0.08)"
          : "rgba(34,197,94,0.08)",
        borderColor: result.pothole ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)",
      }}>
        <span style={{ fontSize: 36 }}>{result.pothole ? "⚠️" : "✅"}</span>
        <div>
          <div style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: 20,
            color: result.pothole ? "var(--red)" : "var(--green)",
          }}>
            {result.label}
          </div>
          <div style={{ color: "var(--text2)", fontSize: 13, marginTop: 2 }}>
            Mode: <span style={{ color: "var(--accent)", fontWeight: 600 }}>{result.model_mode}</span>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div style={s.grid}>
        <Metric label="Confidence"  value={`${result.confidence?.toFixed(1)}%`} />
        <Metric label="Severity"    value={result.severity || "N/A"} color={sevColor(result.severity)} />
        <Metric label="Latitude"    value={result.coordinates?.lat?.toFixed(4) ?? "—"} mono />
        <Metric label="Longitude"   value={result.coordinates?.lng?.toFixed(4) ?? "—"} mono />
      </div>

      {/* Confidence bar */}
      <div style={{ margin: "16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "var(--text2)" }}>Detection confidence</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>
            {result.confidence?.toFixed(1)}%
          </span>
        </div>
        <div style={s.barBg}>
          <div style={{
            ...s.barFill,
            width: `${result.confidence}%`,
            background: result.pothole
              ? "linear-gradient(90deg,var(--red),var(--yellow))"
              : "linear-gradient(90deg,var(--green),#86efac)",
          }} />
        </div>
      </div>

      {result.note && (
        <p style={s.note}>{result.note}</p>
      )}

      {onReset && (
        <button className="btn btn-outline" onClick={onReset} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
          ↩ Analyse Another
        </button>
      )}
    </div>
  );
}

function Metric({ label, value, color, mono }) {
  return (
    <div style={s.metric}>
      <div style={s.metricLabel}>{label}</div>
      <div style={{
        fontFamily: mono ? "monospace" : "Syne, sans-serif",
        fontWeight: 700,
        fontSize: mono ? 14 : 18,
        color: color || "var(--text)",
      }}>
        {value}
      </div>
    </div>
  );
}

const s = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: 24,
  },
  verdict: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid",
    marginBottom: 20,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 4,
  },
  metric: {
    background: "var(--bg3)",
    borderRadius: 10,
    padding: "12px 16px",
    border: "1px solid var(--border)",
  },
  metricLabel: {
    fontSize: 11,
    color: "var(--text3)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 6,
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
  note: {
    fontSize: 11,
    color: "var(--text3)",
    fontStyle: "italic",
    margin: "12px 0",
    padding: "8px 12px",
    background: "var(--bg3)",
    borderRadius: 6,
  },
};
