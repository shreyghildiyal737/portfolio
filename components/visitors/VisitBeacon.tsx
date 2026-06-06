"use client";

import { useEffect } from "react";

/**
 * Fires a single anonymous visit ping per browser session (no PII, no body).
 * Guarded by sessionStorage so a session counts once. Failures are ignored -
 * the counter is best-effort telemetry, never blocking.
 */
export function VisitBeacon() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("idw-visited")) return;
      sessionStorage.setItem("idw-visited", "1");
    } catch {
      // sessionStorage unavailable (private mode) - still ping once per load.
    }
    fetch("/api/visitors/visit", { method: "POST", keepalive: true }).catch(() => {});
  }, []);

  return null;
}
