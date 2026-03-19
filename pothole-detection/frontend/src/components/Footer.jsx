export default function Footer() {
  return (
    <footer style={s.footer}>
      <div className="container">
        <div style={s.inner}>
          <div>
            <div style={s.logo}>
              <span style={{ color: "var(--accent)", fontSize: 20 }}>⬡</span>
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18 }}>PotholeAI</span>
            </div>
            <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 10, maxWidth: 280, lineHeight: 1.6 }}>
              CNN-powered road pothole detection system. Built with TensorFlow, Keras, FastAPI, and React.
            </p>
          </div>
          <div style={{ color: "var(--text3)", fontSize: 13 }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: "var(--text2)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Built With
            </div>
            {["TensorFlow / Keras", "FastAPI", "React 18", "OpenCV", "GeoPy"].map((t) => (
              <div key={t} style={{ marginBottom: 6 }}>{t}</div>
            ))}
          </div>
          <div style={{ color: "var(--text3)", fontSize: 13 }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: "var(--text2)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Project
            </div>
            {["NRCM — School of CS & Engineering", "Kaggle Dataset (1,299 images)", "93% Validation Accuracy", "MIT License"].map((t) => (
              <div key={t} style={{ marginBottom: 6 }}>{t}</div>
            ))}
          </div>
        </div>
        <div style={s.bottom}>
          <span>© 2024 PotholeAI — Road Safety through Deep Learning</span>
          <span>Made with 🧠 + ☕</span>
        </div>
      </div>
    </footer>
  );
}

const s = {
  footer: {
    background: "var(--bg2)",
    borderTop: "1px solid var(--border)",
    paddingTop: 60,
    paddingBottom: 32,
  },
  inner: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: 48,
    marginBottom: 40,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  bottom: {
    borderTop: "1px solid var(--border)",
    paddingTop: 24,
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    fontSize: 13,
    color: "var(--text3)",
  },
};
