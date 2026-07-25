import React, { useState } from "react";
import { CheckIcon } from "./Icons";

// Helper to apply lightweight syntax highlighting to code text
function highlightCode(code, lang) {
  if (!code) return "";

  // Escape HTML characters
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Comments
  html = html.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, '<span class="token-comment">$1</span>');

  // Strings (double quotes, single quotes, backticks)
  html = html.replace(/(["'`])(?:(?=(\\?))\2[\s\S])*?\1/g, '<span class="token-string">$&</span>');

  // Keywords
  const keywords = /\b(import|export|default|from|function|const|let|var|return|if|else|for|while|switch|case|break|try|catch|async|await|class|extends|new|this|type|interface)\b/g;
  html = html.replace(keywords, '<span class="token-keyword">$1</span>');

  // JSX / HTML Tags (<div, </div, <h1, etc)
  html = html.replace(/&lt;(\/?[a-zA-Z0-9]+)/g, '&lt;<span class="token-tag">$1</span>');

  // Function calls (e.g. useState(), console.log())
  html = html.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\()/g, '<span class="token-function">$1</span>');

  // Numbers
  html = html.replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>');

  return html;
}

export function CodeBlock({ inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const rawCode = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "code";

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Inline code snippet styling
  if (inline || !rawCode.includes("\n") && !className) {
    return (
      <code className="inline-code-pill" {...props}>
        {children}
      </code>
    );
  }

  // Multiline IDE Code Block
  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <div className="code-lang-badge">
          <span className="lang-dot"></span>
          <span>{language}</span>
        </div>
        <button className="copy-code-btn" onClick={handleCopy}>
          {copied ? (
            <>
              <CheckIcon className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      <div className="code-block-content">
        <pre>
          <code
            dangerouslySetInnerHTML={{
              __html: highlightCode(rawCode, language)
            }}
          />
        </pre>
      </div>
    </div>
  );
}
