import React, { useState, useEffect } from "react";
import "./AnimatedText.css";

/**
 * AnimatedText Component
 * Displays text letter-by-letter (1 by 1) with guaranteed hidden initial state
 * and step-by-step pop-in reveal.
 */
export function AnimatedText({
  text = "ContentForge",
  className = "",
  speed = 90, // ms per letter
  initialDelay = 150, // ms before reveal begins
  as: Component = "span",
  interactive = true,
  showCursor = false
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const characters = Array.from(text);

  useEffect(() => {
    setVisibleCount(0);
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleCount((prev) => {
          if (prev < characters.length) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, speed);

      return () => clearInterval(interval);
    }, initialDelay);

    return () => clearTimeout(startTimer);
  }, [text, speed, initialDelay, animKey]);

  const handleReplay = () => {
    if (!interactive) return;
    setAnimKey((prev) => prev + 1);
  };

  return (
    <Component
      key={animKey}
      className={`animated-text-root ${className} ${interactive ? "interactive" : ""}`}
      onClick={handleReplay}
      title="Click to replay letter-by-letter animation"
    >
      {characters.map((char, idx) => {
        const isVisible = idx < visibleCount;
        return (
          <span
            key={`${animKey}-${idx}`}
            className={`animated-char ${isVisible ? "visible" : "hidden"}`}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
      {showCursor && visibleCount < characters.length && (
        <span className="typing-cursor">|</span>
      )}
    </Component>
  );
}

export default AnimatedText;
