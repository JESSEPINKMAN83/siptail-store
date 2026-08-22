"use client";
import { useState, useEffect } from "react";

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute("data-contrast", "high");
    } else {
      document.documentElement.removeAttribute("data-contrast");
    }
  }, [highContrast]);

  return (
    <>
      {/* Accessibility toggle button — WE-09 */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="אפשרויות נגישות / Accessibility options"
        aria-expanded={open}
        className="fixed bottom-24 right-5 z-50 w-12 h-12 flex items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation"
        style={{ background: "#1B4332", color: "#FFFFFF" }}
      >
        {/* Person icon */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2a2 2 0 110 4 2 2 0 010-4zm-1 5h2a3 3 0 013 3v5h-2v-4h-1v9h-2v-5H9v5H7v-9h-1v4H4v-5a3 3 0 013-3z"/>
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-40 right-5 z-50 w-64 p-4 rounded-xl shadow-2xl"
          style={{ background: "#FFFFFF", border: "2px solid #1B4332" }}
          role="dialog"
          aria-label="Accessibility panel"
        >
          <h3 className="font-bold text-sm mb-3" style={{ color: "#1B4332" }}>Accessibility / נגישות</h3>

          {/* Font size */}
          <div className="mb-3">
            <p className="text-xs font-medium mb-1.5" style={{ color: "#1A1A1A" }}>Text size / גודל טקסט</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(f => Math.max(80, f - 10))}
                className="w-8 h-8 border rounded text-sm font-bold hover:bg-gray-50 focus:outline-none focus:ring-1"
                style={{ borderColor: "#D4E6D4" }}
                aria-label="Decrease text size"
              >A-</button>
              <span className="flex-1 text-center text-xs" style={{ color: "#6B7280" }}>{fontSize}%</span>
              <button
                onClick={() => setFontSize(f => Math.min(150, f + 10))}
                className="w-8 h-8 border rounded text-sm font-bold hover:bg-gray-50 focus:outline-none focus:ring-1"
                style={{ borderColor: "#D4E6D4" }}
                aria-label="Increase text size"
              >A+</button>
              <button
                onClick={() => setFontSize(100)}
                className="text-xs px-2 py-1 border rounded hover:bg-gray-50 focus:outline-none focus:ring-1"
                style={{ borderColor: "#D4E6D4", color: "#6B7280" }}
                aria-label="Reset text size"
              >Reset</button>
            </div>
          </div>

          {/* High contrast */}
          <button
            onClick={() => setHighContrast(h => !h)}
            className={`w-full py-2 text-xs font-semibold rounded border transition-colors focus:outline-none focus:ring-2 ${
              highContrast ? "text-white border-transparent" : "border-current"
            }`}
            style={{
              background: highContrast ? "#1B4332" : "transparent",
              color: highContrast ? "#FFFFFF" : "#1B4332",
              borderColor: "#1B4332",
            }}
            aria-pressed={highContrast}
          >
            {highContrast ? "Contrast: ON" : "High Contrast / ניגודיות גבוהה"}
          </button>

          <a
            href="/accessibility"
            className="block text-center text-xs mt-3 underline hover:opacity-70 transition-opacity"
            style={{ color: "#1B4332" }}
          >
            הצהרת נגישות / Accessibility Statement
          </a>
        </div>
      )}
    </>
  );
}
