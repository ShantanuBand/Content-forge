import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import EditDraft from "./pages/EditDraft";
import DraftList from "./components/DraftList";
import DraftDetail from "./pages/DraftDetail";
import { CodeBlock } from "./components/CodeBlock";
import AnimatedText from "./components/AnimatedText";
import EditorialLoader from "./components/EditorialLoader";
import {
  LogoIcon,
  SparklesIcon,
  ArrowRightIcon,
  ZapIcon,
  ShieldCheckIcon,
  ClockIcon,
  EditIcon,
  CheckIcon
} from "./components/Icons";
import "./App.css";

export default function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [topic, setTopic] = useState("");
  const [aiData, setAiData] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch drafts (max 6)
  const fetchDrafts = async () => {
    try {
      const res = await axios.get("/api/drafts");
      let fetched = [];
      if (Array.isArray(res?.data?.drafts)) {
        fetched = res.data.drafts;
      } else if (Array.isArray(res?.data)) {
        fetched = res.data;
      }
      setDrafts(fetched.slice(0, 6));
    } catch (err) {
      console.error("Fetch drafts failed:", err);
      setDrafts([]);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  // Generate AI content
  const generateContent = async () => {
    if (!topic.trim()) return;

    try {
      setLoading(true);
      setIsSaved(false);
      const res = await axios.post("/api/ai/generate", { topic });
      if (res.data && res.data.title) {
        setAiData(res.data);
      }
    } catch (err) {
      console.error("AI generation error:", err);
      alert(err.response?.data?.message || "AI generation failed. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Save Draft (keeps maximum of 6 latest drafts)
  const saveDraft = async () => {
    if (!aiData?.title || !aiData?.content || saving || isSaved) return;

    try {
      setSaving(true);
      const res = await axios.post("/api/drafts", {
        title: aiData.title,
        content: aiData.content
      });

      setDrafts((prev) => [res.data, ...prev].slice(0, 6));
      setIsSaved(true);
      alert("Draft saved successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Full-Screen Ultra-Minimal Editorial Loader */}
      {showLoader && (
        <EditorialLoader onComplete={() => setShowLoader(false)} />
      )}

      {/* Animated Purple Fog Background */}
      <div className="fog-container">
        <div className="fog-layer-1"></div>
        <div className="fog-layer-2"></div>
        <div className="fog-layer-3"></div>
      </div>
      <div className="grid-overlay"></div>

      <div className="page-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* NAVBAR */}
                <header className="navbar">
                  <div className="logo-brand">
                    <LogoIcon />
                    <span className="logo-text">ContentForge</span>
                  </div>
                </header>

                {/* HERO SECTION */}
                <section className="hero-section">
                  <h1 className="hero-title">
                    Build. Customize. Distribute.{" "}
                    <span className="highlight-purple">ContentForge.</span>
                  </h1>

                  <p className="hero-subtitle">
                    AI-powered content creation for developers & creators.
                    Generate small, high-quality drafts effortlessly.
                  </p>

                  {/* PILL GENERATOR INPUT BAR */}
                  <div className="generator-container">
                    <div className="generator-box">
                      <div className="sparkle-icon-wrapper">
                        <SparklesIcon color="#c084fc" />
                      </div>
                      <input
                        className="generator-input"
                        placeholder="Enter a topic or idea..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") generateContent();
                        }}
                      />
                      <button
                        className="generate-btn"
                        onClick={generateContent}
                        disabled={loading}
                      >
                        {loading ? (
                          "Generating..."
                        ) : (
                          <>
                            <span>Generate</span>
                            <ArrowRightIcon />
                          </>
                        )}
                      </button>
                    </div>

                    {/* FEATURE TAGS BADGES (STATIC) */}
                    <div className="feature-tags">
                      <div className="tag-pill">
                        <ZapIcon className="tag-icon" />
                        <span>AI-Powered</span>
                      </div>
                      <div className="tag-pill">
                        <ShieldCheckIcon className="tag-icon" />
                        <span>High Quality</span>
                      </div>
                      <div className="tag-pill">
                        <ClockIcon className="tag-icon" />
                        <span>Save Time</span>
                      </div>
                      <div className="tag-pill">
                        <EditIcon className="tag-icon" />
                        <span>Customizable</span>
                      </div>
                    </div>
                  </div>

                  {/* RESULT CARD */}
                  {aiData && (
                    <div className="result-section">
                      <div className="result-card">
                        <div className="result-header">
                          <h2 className="result-title">{aiData.title}</h2>
                        </div>
                        <div className="result-body">
                          <ReactMarkdown components={{ code: CodeBlock }}>{aiData.content}</ReactMarkdown>
                        </div>
                        <div className="result-actions">
                          <button className="save-draft-btn" onClick={saveDraft} disabled={saving || isSaved}>
                            <CheckIcon />
                            <span>{isSaved ? "Saved to Drafts" : saving ? "Saving..." : "Save Draft"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* DRAFTS LIST SECTION (Max 6) */}
                <DraftList drafts={drafts} setDrafts={setDrafts} />
              </>
            }
          />
          <Route path="/draft/:id/edit" element={<EditDraft />} />
          <Route path="/draft/:id" element={<DraftDetail />} />
        </Routes>
      </div>
    </div>
  );
}
