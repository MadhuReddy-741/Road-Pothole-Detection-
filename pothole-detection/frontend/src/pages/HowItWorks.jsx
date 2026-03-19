const STEPS = [
  {
    num: "01",
    title: "Image Capture",
    desc: "Road images are captured via vehicle-mounted cameras, drones, or mobile phones and uploaded to the system.",
    icon: "📸",
  },
  {
    num: "02",
    title: "Preprocessing",
    desc: "Images are resized to 64×64, normalised, and augmented with rotation, flipping, and brightness jitter using Keras ImageDataGenerator.",
    icon: "🔧",
  },
  {
    num: "03",
    title: "CNN Feature Extraction",
    desc: "Convolutional layers slide filters over the image to extract spatial features — edges, textures, depth cues that indicate road damage.",
    icon: "🧠",
  },
  {
    num: "04",
    title: "Classification",
    desc: "Fully connected layers output class probabilities. If pothole confidence exceeds the threshold, the image is flagged.",
    icon: "⚖️",
  },
  {
    num: "05",
    title: "Geolocation Tagging",
    desc: "GPS coordinates are attached to the detection result and sent to a centralized database for mapping.",
    icon: "📍",
  },
  {
    num: "06",
    title: "Dashboard Reporting",
    desc: "Repair teams view real-time pothole maps, severity scores, and prioritised maintenance schedules.",
    icon: "📊",
  },
];

const ARCH = [
  { layer: "Input Layer", detail: "64×64×3 RGB image", color: "#6366f1" },
  { layer: "Conv2D (32)", detail: "ReLU, 3×3 kernel", color: "#8b5cf6" },
  { layer: "MaxPooling2D", detail: "2×2, reduces spatial size", color: "#a855f7" },
  { layer: "Conv2D (64)", detail: "ReLU, 3×3 kernel", color: "#d946ef" },
  { layer: "MaxPooling2D", detail: "2×2", color: "#ec4899" },
  { layer: "Flatten", detail: "Converts to 1D vector", color: "#f43f5e" },
  { layer: "Dense (128)", detail: "ReLU activation", color: "#f97316" },
  { layer: "Dropout (0.5)", detail: "Regularisation", color: "#fb923c" },
  { layer: "Dense (1)", detail: "Sigmoid → Pothole / No Pothole", color: "#22c55e" },
];

const TECH = [
  { name: "Python 3.11", role: "Core language", icon: "🐍" },
  { name: "TensorFlow / Keras", role: "CNN model", icon: "🔬" },
  { name: "FastAPI", role: "REST backend", icon: "⚡" },
  { name: "React 18", role: "Frontend UI", icon: "⚛️" },
  { name: "OpenCV", role: "Image processing", icon: "👁️" },
  { name: "GeoPy", role: "Geolocation", icon: "🌍" },
  { name: "NumPy", role: "Array ops", icon: "🔢" },
  { name: "Kaggle Dataset", role: "1,299 images", icon: "📦" },
];

export default function HowItWorks() {
  return (
    <section className="section">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div className="badge badge-orange" style={{ marginBottom: 16 }}>Under the Hood</div>
          <h1 style={{ fontSize: "clamp(28px,4vw,52px)", marginBottom: 16 }}>
            How It Works
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
            From road image to repair ticket — the full CNN-powered pipeline explained.
          </p>
        </div>

        {/* Pipeline steps */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ marginBottom: 36, fontSize: 22 }}>Detection Pipeline</h2>
          <div style={s.stepsGrid}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={s.step}>
                <div style={s.stepNum}>{step.num}</div>
                <div style={s.stepIcon}>{step.icon}</div>
                <h3 style={{ fontSize: 17, marginBottom: 10, fontFamily: "Syne, sans-serif" }}>{step.title}</h3>
                <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.65 }}>{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div style={s.stepArrow}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CNN Architecture */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ marginBottom: 12, fontSize: 22 }}>CNN Architecture</h2>
          <p style={{ color: "var(--text2)", marginBottom: 32, fontSize: 15 }}>
            A sequential CNN built with Keras — lightweight enough for real-time edge deployment.
          </p>
          <div style={s.archContainer}>
            {ARCH.map((layer, i) => (
              <div key={layer.layer} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <div style={{ ...s.archLayer, borderColor: layer.color, boxShadow: `0 0 12px ${layer.color}30` }}>
                  <div style={{ ...s.archDot, background: layer.color }} />
                  <div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
                      {layer.layer}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{layer.detail}</div>
                  </div>
                </div>
                {i < ARCH.length - 1 && (
                  <div style={s.archArrow} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div style={s.resultsRow}>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 44, fontFamily: "Syne, sans-serif", fontWeight: 800, color: "var(--accent)" }}>93%</div>
            <div style={{ marginTop: 8, color: "var(--text2)", fontSize: 14 }}>Validation Accuracy</div>
            <div style={{ marginTop: 6, fontSize: 12, color: "var(--text3)" }}>1,022 training images</div>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 44, fontFamily: "Syne, sans-serif", fontWeight: 800, color: "var(--green)" }}>81%</div>
            <div style={{ marginTop: 8, color: "var(--text2)", fontSize: 14 }}>Real-world Test Accuracy</div>
            <div style={{ marginTop: 6, fontSize: 12, color: "var(--text3)" }}>Full scene test images</div>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 44, fontFamily: "Syne, sans-serif", fontWeight: 800, color: "var(--yellow)" }}>64×64</div>
            <div style={{ marginTop: 8, color: "var(--text2)", fontSize: 14 }}>Input Image Size</div>
            <div style={{ marginTop: 6, fontSize: 12, color: "var(--text3)" }}>Normalised pixels</div>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 44, fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#6366f1" }}>1,299</div>
            <div style={{ marginTop: 8, color: "var(--text2)", fontSize: 14 }}>Total Dataset Images</div>
            <div style={{ marginTop: 6, fontSize: 12, color: "var(--text3)" }}>Kaggle + Google Images</div>
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{ marginTop: 80 }}>
          <h2 style={{ marginBottom: 32, fontSize: 22 }}>Tech Stack</h2>
          <div className="grid-4">
            {TECH.map((t) => (
              <div key={t.name} className="card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px" }}>
                <span style={{ fontSize: 24 }}>{t.icon}</span>
                <div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const s = {
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 24,
  },
  step: {
    position: "relative",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: 24,
  },
  stepNum: {
    fontFamily: "Syne, sans-serif",
    fontSize: 11,
    fontWeight: 800,
    color: "var(--accent)",
    letterSpacing: "0.1em",
    marginBottom: 12,
  },
  stepIcon: {
    fontSize: 28,
    marginBottom: 14,
  },
  stepArrow: {
    display: "none",
  },
  archContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 0,
    alignItems: "center",
  },
  archLayer: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 20px",
    border: "1.5px solid",
    borderRadius: 10,
    background: "var(--surface)",
    minWidth: 180,
    margin: 6,
  },
  archDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  archArrow: {
    width: 16,
    height: 2,
    background: "var(--border)",
  },
  resultsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 20,
  },
};
