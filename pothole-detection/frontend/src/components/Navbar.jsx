import { useState } from "react";

export default function Navbar({ activePage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: "home", label: "Home" },
    { id: "detect", label: "Detect" },
    { id: "dashboard", label: "Dashboard" },
    { id: "about", label: "How It Works" },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <button onClick={() => onNavigate("home")} style={styles.logo}>
          <span style={styles.logoIcon}>⬡</span>
          <span style={styles.logoText}>PotholeAI</span>
        </button>

        {/* Desktop Links */}
        <div style={styles.links}>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
              style={{
                ...styles.link,
                color: activePage === l.id ? "var(--accent)" : "var(--text2)",
                borderBottom: activePage === l.id ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button className="btn btn-primary" onClick={() => onNavigate("detect")} style={{ fontSize: 14 }}>
          Try Detection →
        </button>

        {/* Mobile Hamburger */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <span style={{ fontSize: 22 }}>{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => { onNavigate(l.id); setMenuOpen(false); }}
              style={{
                ...styles.mobileLink,
                color: activePage === l.id ? "var(--accent)" : "var(--text)",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(10,10,15,0.85)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid var(--border)",
  },
  inner: {
    maxWidth: 1160,
    margin: "0 auto",
    padding: "0 24px",
    height: 64,
    display: "flex",
    alignItems: "center",
    gap: 32,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "none",
    border: "none",
    cursor: "pointer",
    marginRight: "auto",
  },
  logoIcon: {
    fontSize: 22,
    color: "var(--accent)",
  },
  logoText: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 800,
    fontSize: 20,
    color: "var(--text)",
    letterSpacing: "-0.02em",
  },
  links: {
    display: "flex",
    gap: 4,
    "@media (max-width: 768px)": { display: "none" },
  },
  link: {
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "4px 12px",
    cursor: "pointer",
    fontFamily: "DM Sans, sans-serif",
    fontSize: 15,
    fontWeight: 500,
    transition: "all 0.15s",
    paddingBottom: 6,
  },
  hamburger: {
    display: "none",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--text)",
    "@media (max-width: 768px)": { display: "block" },
  },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    padding: "12px 24px 20px",
    gap: 4,
    borderTop: "1px solid var(--border)",
  },
  mobileLink: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "Syne, sans-serif",
    fontSize: 16,
    fontWeight: 600,
    padding: "10px 0",
    textAlign: "left",
    borderBottom: "1px solid var(--border)",
  },
};
