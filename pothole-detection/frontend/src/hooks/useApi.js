import { useState, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * useDetection — React hook that wraps the /predict API call.
 *
 * Usage:
 *   const { predict, result, loading, error, reset } = useDetection();
 *   await predict(fileObject);
 */
export function useDetection() {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const predict = useCallback(async (file) => {
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

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      // Graceful demo fallback when backend is unreachable
      const mock = {
        label: "Pothole Detected",
        pothole: true,
        confidence: 84.7,
        severity: "High",
        coordinates: { lat: 17.3912, lng: 78.4923 },
        model_mode: "demo",
        note: "Backend unreachable — showing demo result",
      };
      setResult(mock);
      return mock;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { predict, result, loading, error, reset };
}

/**
 * useStats — Fetch dashboard aggregate stats from /stats
 */
export function useStats() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (!res.ok) throw new Error(`Stats fetch failed: ${res.status}`);
      setStats(await res.json());
    } catch (err) {
      setError(err.message);
      // Fallback mock stats
      setStats({
        total_scans: 1247,
        potholes_found: 384,
        avg_confidence: 88.3,
        roads_clear: 863,
        severity_breakdown: { High: 38, Medium: 45, Low: 17 },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, error, fetchStats };
}
