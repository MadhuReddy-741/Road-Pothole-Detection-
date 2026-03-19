import { useState } from "react";

const MOCK_DETECTIONS = [
  { id: 1, location: "NH-65, Hyderabad", lat: 17.385, lng: 78.486, severity: "High", confidence: 92.1, time: "2 min ago", pothole: true },
  { id: 2, location: "Ring Road, Pune", lat: 18.520, lng: 73.856, severity: "Medium", confidence: 78.4, time: "15 min ago", pothole: true },
  { id: 3, location: "MG Road, Bangalore", lat: 12.975, lng: 77.607, severity: "Low", confidence: 65.2, time: "1 hr ago", pothole: true },
  { id: 4, location: "Anna Salai, Chennai", lat: 13.082, lng: 80.270, severity: "High", confidence: 95.3, time: "2 hr ago", pothole: true },
  { id: 5, location: "Link Road, Mumbai", lat: 19.076, lng: 72.877, severity: "Medium", confidence: 81.7, time: "3 hr ago", pothole: true },
  { id: 6, location: "Sardar Patel Road, Delhi", lat: 28.644, lng: 77.216, severity: "Low", confidence: 70.1, time: "5 hr ago", pothole: false },
];

const WEEKLY_DATA = [
  { day: "Mon", potholes: 12, safe: 34 },
  { day: "Tue", potholes: 19, safe: 28 },
  { day: "Wed", potholes: 8, safe: 41 },
  { day: "Thu", potholes: 24, safe: 22 },
  { day: "Fri", potholes: 17, safe: 37 },
  { day: "Sat", potholes: 6, safe: 48 },
  { day: "Sun", potholes: 11, safe: 31 },
];

const SEVERITY_DIST = [
  { label: "High", count: 38, color: "var(--red)" },
  { label: "Medium", count: 45, color: "var(--yellow)" },
  { label: "Low", count: 17, color: "var(--green)" },
];

const KPI = [
  { label: "Total Scans", value: "1,247", delta: "+12%", up: true },
  { label: "Potholes Found", value: "384", delta: "+8%", up: true },
  { label: "Avg Confidence", value: "88.3%", delta: "+2.1%", up: true },
  { label: "Roads Clear", value: "863", delta: "+14%", up: true },
];

const maxPotholes = Math.max(...WEEKLY_DATA.map((d) => d.potholes + d.safe));

export default function Dashboard() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? MOCK_DETECTIONS
    : MOCK_DETECTIONS.filter((d) => d.severity === filter);

  const sevColor = (sev) => {
    if (sev === "High") return "var(--red)";
    if (sev === "Medium") return "var(--yellow)";
    return "var(--green)";
  };

  return (
    <section className="section">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="badge badge-orange" style={{ marginBottom: 12 }}>Live Dashboard</div>
            <h1 style={{ fontSize: "clamp(26px,3.5vw,42px)" }}>Road Analytics</h1>
            <p style={{ color: "var(--text2)", marginTop: 8 }}>Real-time pothole detection overview</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={s.liveIndicator}>
              <span style={s.liveDot} /> Live
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {KPI.map((k) => (
            <div key={k.label} className="card" style={{ padding: "20px 24px" }}>
              <div style={{ fontSize: 12, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                {k.label}
              </div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 30, fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>
                {k.value}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: k.up ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                {k.up ? "▲" : "▼"} {k.delta} this week
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid-2" style={{ marginBottom: 32, alignItems: "start" }}>
          {/* Bar chart */}
          <div className="card">
            <h3 style={{ marginBottom: 20, fontSize: 16 }}>Weekly Scan Activity</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160 }}>
              {WEEKLY_DATA.map((d) => {
                const total = d.potholes + d.safe;
                const phPct = (d.potholes / maxPotholes) * 100;
                const sfPct = (d.safe / maxPotholes) * 100;
                return (
                  <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center", width: "100%", gap: 2 }}>
                      <div style={{
                        width: "100%",
                        height: `${phPct * 1.4}px`,
                        background: "var(--red)",
                        borderRadius: "4px 4px 0 0",
                        opacity: 0.85,
                        minHeight: 4,
                      }} title={`${d.potholes} potholes`} />
                      <div style={{
                        width: "100%",
                        height: `${sfPct * 0.8}px`,
                        background: "var(--green)",
                        borderRadius: "4px 4px 0 0",
                        opacity: 0.5,
                        minHeight: 4,
                      }} title={`${d.safe} safe`} />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text3)" }}>{d.day}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text2)" }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--red)", opacity: 0.85 }} /> Potholes
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text2)" }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--green)", opacity: 0.5 }} /> Safe roads
              </div>
            </div>
          </div>

          {/* Severity donut */}
          <div className="card">
            <h3 style={{ marginBottom: 20, fontSize: 16 }}>Severity Distribution</h3>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <svg viewBox="0 0 100 100" style={{ width: 120, height: 120, transform: "rotate(-90deg)" }}>
                {(() => {
                  const total = SEVERITY_DIST.reduce((s, d) => s + d.count, 0);
                  let offset = 0;
                  const r = 38;
                  const circ = 2 * Math.PI * r;
                  return SEVERITY_DIST.map((d) => {
                    const pct = d.count / total;
                    const dash = pct * circ;
                    const gap = circ - dash;
                    const el = (
                      <circle
                        key={d.label}
                        cx="50" cy="50" r={r}
                        fill="none"
                        stroke={d.color}
                        strokeWidth="18"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-offset}
                        opacity={0.85}
                      />
                    );
                    offset += dash;
                    return el;
                  });
                })()}
              </svg>
              <div style={{ flex: 1 }}>
                {SEVERITY_DIST.map((d) => (
                  <div key={d.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: "var(--text2)" }}>{d.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.count}%</span>
                    </div>
                    <div style={{ height: 4, background: "var(--bg3)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${d.count}%`, background: d.color, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detections Table */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <h3 style={{ fontSize: 16 }}>Recent Detections</h3>
            <div style={{ display: "flex", gap: 8 }}>
              {["All", "High", "Medium", "Low"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    ...s.filterBtn,
                    background: filter === f ? "var(--accent)" : "var(--bg3)",
                    color: filter === f ? "#fff" : "var(--text2)",
                    borderColor: filter === f ? "var(--accent)" : "var(--border)",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {["Location", "Coordinates", "Severity", "Confidence", "Status", "Time"].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} style={s.tr}>
                    <td style={s.td}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{d.location}</span>
                    </td>
                    <td style={s.td}>
                      <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text2)" }}>
                        {d.lat.toFixed(3)}, {d.lng.toFixed(3)}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{
                        padding: "3px 10px",
                        borderRadius: 100,
                        fontSize: 12,
                        fontWeight: 700,
                        color: sevColor(d.severity),
                        background: `${sevColor(d.severity)}18`,
                        border: `1px solid ${sevColor(d.severity)}40`,
                      }}>
                        {d.severity}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ height: 4, width: 60, background: "var(--bg3)", borderRadius: 2 }}>
                          <div style={{
                            height: "100%",
                            width: `${d.confidence}%`,
                            background: d.confidence > 85 ? "var(--green)" : "var(--yellow)",
                            borderRadius: 2,
                          }} />
                        </div>
                        <span style={{ fontSize: 13, color: "var(--text2)" }}>{d.confidence}%</span>
                      </div>
                    </td>
                    <td style={s.td}>
                      <span className={d.pothole ? "badge badge-red" : "badge badge-green"} style={{ fontSize: 11 }}>
                        {d.pothole ? "⚠ Pothole" : "✓ Clear"}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{ fontSize: 12, color: "var(--text3)" }}>{d.time}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

const s = {
  liveIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 16px",
    background: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.25)",
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 600,
    color: "var(--green)",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "var(--green)",
    display: "inline-block",
    animation: "pulse-ring 1.5s ease-in-out infinite",
  },
  filterBtn: {
    padding: "6px 14px",
    borderRadius: 8,
    border: "1px solid",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "Syne, sans-serif",
    fontWeight: 600,
    transition: "all 0.15s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "10px 16px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: "var(--text3)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "14px 16px",
    borderBottom: "1px solid var(--border)",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  tr: {
    transition: "background 0.15s",
  },
};
