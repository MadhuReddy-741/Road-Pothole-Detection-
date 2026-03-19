import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./pages/Hero";
import DetectionDemo from "./pages/DetectionDemo";
import Dashboard from "./pages/Dashboard";
import HowItWorks from "./pages/HowItWorks";
import Footer from "./components/Footer";
import "./index.css";

export default function App() {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home": return <Hero onNavigate={setActivePage} />;
      case "detect": return <DetectionDemo />;
      case "dashboard": return <Dashboard />;
      case "about": return <HowItWorks />;
      default: return <Hero onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="app">
      <Navbar activePage={activePage} onNavigate={setActivePage} />
      <main>{renderPage()}</main>
      <Footer />
    </div>
  );
}
