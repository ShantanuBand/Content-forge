import React, { useState, useEffect } from "react";
import "./EditorialLoader.css";

/**
 * EditorialLoader Component
 * Ultra-minimal typography loader inspired by luxury portfolio sites & modern SaaS product reveals.
 *
 * Sequence:
 * 1. BUILD. (Solid White) -> transitions to subtle Outlined stroke
 * 2. CREATE. (Slides up, Solid White) -> transitions to subtle Outlined stroke
 * 3. DISTRIBUTE. (Slides up, Solid White) -> transitions to subtle Outlined stroke
 * 4. CONTENTFORGE. (Purple gradient with soft glow & slightly larger size)
 * 5. Smooth fade-out reveal into homepage.
 */
export default function EditorialLoader({ onComplete }) {
  const [step, setStep] = useState(0); // 0: BUILD, 1: CREATE, 2: DISTRIBUTE, 3: CONTENTFORGE
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Timings for silky smooth 2.8s - 3.2s sequence
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1200);
    const t3 = setTimeout(() => setStep(3), 1800);
    
    // Start exit fade-out
    const tExit = setTimeout(() => {
      setIsExiting(true);
    }, 2850);

    // Complete callback to unmount or reveal app
    const tComplete = setTimeout(() => {
      if (typeof onComplete === "function") {
        onComplete();
      }
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tExit);
      clearTimeout(tComplete);
    };
  }, [onComplete]);

  return (
    <div className={`editorial-loader-container ${isExiting ? "fade-out" : ""}`}>
      {/* Subtle Background Grid */}
      <div className="loader-grid-overlay"></div>

      {/* Radial Purple Glow Behind Center Text */}
      <div className={`loader-purple-glow ${step === 3 ? "active" : ""}`}></div>

      {/* Editorial Corner Details */}
      <div className="loader-corner top-left">
        <span>CONTENTFORGE</span>
        <span className="dim">AI PLATFORM</span>
      </div>
      <div className="loader-corner top-right">
        <span>EDITION</span>
        <span className="dim">2026 / V2.0</span>
      </div>
      <div className="loader-corner bottom-left">
        <span>PROJECT 2026/</span>
      </div>
      <div className="loader-corner bottom-right">
        <span>REDESIGN</span>
        <span className="dim">DIGITAL EXPERIENCE</span>
      </div>

      {/* Huge Typography Stage */}
      <div className="loader-typography-stage">
        {/* BUILD. */}
        <div
          className={`loader-word-line ${
            step === 0 ? "solid" : step > 0 ? "outlined" : "hidden"
          }`}
        >
          BUILD.
        </div>

        {/* CREATE. */}
        <div
          className={`loader-word-line ${
            step < 1 ? "hidden" : step === 1 ? "solid" : "outlined"
          }`}
        >
          CREATE.
        </div>

        {/* DISTRIBUTE. */}
        <div
          className={`loader-word-line ${
            step < 2 ? "hidden" : step === 2 ? "solid" : "outlined"
          }`}
        >
          DISTRIBUTE.
        </div>

        {/* CONTENTFORGE. */}
        <div
          className={`loader-word-line contentforge-gradient ${
            step < 3 ? "hidden" : "solid-gradient"
          }`}
        >
          CONTENTFORGE.
        </div>
      </div>
    </div>
  );
}

