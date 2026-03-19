import { useEffect, useRef } from "react";

const STATS = [
  { value: "93%", label: "Validation Accuracy" },
  { value: "81%", label: "Real-world Test Accuracy" },
  { value: "1,299", label: "Training Images" },
  { value: "<50ms", label: "Inference Time" },
];

const FEATURES = [
  {
    icon: "🧠",
    title: "CNN-Powered Detection",
    desc: "Deep convolutional neural network trained on 1,022 road images with data augmentation for maximum robustness.",
  },
  {
    icon: "📍",
    title: "GPS Geolocation Tagging",
    desc: "Every detected pothole is tagged with precise GPS coordinates for municipal reporting and repair prioritization.",
  },
  {
    icon: "⚡",
    title: "Real-Time Analysis",
    desc: "Sub-50ms inference enables live detection on vehicle-mounted cameras and mobile devices.",
  },
  {
    icon: "📊",
    title: "Severity Dashboard",
    desc: "Visual analytics dashboard showing pothole density, severity heatmaps, and repair scheduling insights.",
  },
  {
    icon: "🔄",
    title: "Data Augmentation",
    desc: "Rotation, flipping, brightness jitter — the model generalises across rain, night, and varied road surfaces.",
  },
  {
    icon: "🗺️",
    title: "Crowdsourced Mapping",
    desc: "Pothole reports from multiple users are aggregated into a unified road-quality map for city authorities.",
  },
];

export default function Hero({ onNavigate }) {
  const canvasRef = useRef(null);

  // Animated dot-grid background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H, dots;

    function init() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      dots = Array.from({ length: 60 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(249,115,22,0.3)";
        ctx.fill();
      });
      // Connect nearby dots
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(249,115,22,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", init); };
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section style={s.hero}>
        <canvas ref={canvasRef} style={s.canvas} />
        {/* Glow orb */}
        <div style={s.orb} />

        <div className="container" style={s.heroContent}>
          <div className="badge badge-orange fade-up" style={{ marginBottom: 24 }}>
            <span>●</span> AI-Powered Road Safety
          </div>

          <h1 className="fade-up-1" style={s.heroTitle}>
            Detect Potholes.<br />
            <span style={s.heroAccent}>Save Lives.</span>
          </h1>

          <p className="fade-up-2" style={s.heroSub}>
            An end-to-end deep learning system that identifies road potholes from images in real time —
            tagging GPS coordinates, assessing severity, and feeding repair dashboards for smarter infrastructure.
          </p>

          <div className="fade-up-3" style={s.heroBtns}>
            <button className="btn btn-primary" onClick={() => onNavigate("detect")} style={{ fontSize: 16, padding: "14px 32px" }}>
              🔍 Try Live Detection
            </button>
            <button className="btn btn-outline" onClick={() => onNavigate("about")} style={{ fontSize: 16, padding: "14px 32px" }}>
              How It Works
            </button>
          </div>

          {/* Stats row */}
          <div className="fade-up-4" style={s.statsRow}>
            {STATS.map((s2) => (
              <div key={s2.label} style={s.statItem}>
                <span style={s.statVal}>{s2.value}</span>
                <span style={s.statLabel}>{s2.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="badge badge-orange" style={{ marginBottom: 16 }}>Features</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", marginBottom: 16 }}>
              Everything you need to fight bad roads
            </h2>
            <p style={{ color: "var(--text2)", maxWidth: 520, margin: "0 auto" }}>
              Built on Keras CNN with Kaggle datasets, real-time inference, and geospatial reporting.
            </p>
          </div>

          <div className="grid-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card" style={s.featureCard}>
                <div style={s.featureIcon}>{f.icon}</div>
                <h3 style={{ marginBottom: 10, fontSize: 18 }}>{f.title}</h3>
                <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={s.cta}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,40px)", marginBottom: 16 }}>
            Ready to detect your first pothole?
          </h2>
          <p style={{ color: "var(--text2)", marginBottom: 32, fontSize: 17 }}>
            Upload a road image and get instant AI analysis with severity score and location tags.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate("detect")} style={{ fontSize: 16, padding: "15px 40px" }}>
            Start Detecting →
          </button>
        </div>
      </section>
    </>
  );
}

const s = {
  hero: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    background: "var(--bg)",
  },
  canvas: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  orb: {
    position: "absolute",
    top: "20%",
    left: "55%",
    width: 600,
    height: 600,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
    filter: "blur(40px)",
    pointerEvents: "none",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: 720,
    paddingTop: 80,
    paddingBottom: 80,
  },
  heroTitle: {
    fontSize: "clamp(42px, 6vw, 80px)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    marginBottom: 20,
    lineHeight: 1.05,
  },
  heroAccent: {
    color: "var(--accent)",
    display: "inline-block",
  },
  heroSub: {
    fontSize: 18,
    color: "var(--text2)",
    maxWidth: 580,
    marginBottom: 36,
    lineHeight: 1.7,
  },
  heroBtns: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 56,
  },
  statsRow: {
    display: "flex",
    gap: 40,
    flexWrap: "wrap",
    borderTop: "1px solid var(--border)",
    paddingTop: 32,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  statVal: {
    fontFamily: "Syne, sans-serif",
    fontSize: 28,
    fontWeight: 800,
    color: "var(--accent)",
  },
  statLabel: {
    fontSize: 13,
    color: "var(--text3)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 600,
  },
  featureCard: {
    transition: "transform 0.2s, border-color 0.2s",
    cursor: "default",
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 14,
    display: "block",
  },
  cta: {
    padding: "100px 0",
    background: "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, var(--bg) 60%)",
    borderTop: "1px solid var(--border)",
  },
};
