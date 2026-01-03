import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import EditDraft from "./pages/EditDraft";


import DraftList from "./components/DraftList";
import DraftDetail from "./pages/DraftDetail";
import "./App.css";

export default function App() {
  const [topic, setTopic] = useState("");
  const [aiData, setAiData] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch drafts
  const fetchDrafts = async () => {
    try {
      const res = await axios.get("/api/drafts");
      setDrafts(res.data.drafts); // IMPORTANT
    } catch (err) {
      console.error("Fetch drafts failed:", err);
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
      const res = await axios.post("/api/ai/generate", { topic });
      setAiData(res.data);
    } catch (err) {
      alert("AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  // Save Draft (NO BLANK PAGE)
  const saveDraft = async () => {
    if (!aiData?.title || !aiData?.content) return;

    try {
      const res = await axios.post("/api/drafts", {
        title: aiData.title,
        content: aiData.content
      });

      setDrafts((prev) => [res.data, ...prev]);
      alert("Draft saved successfully ✅");
    } catch (err) {
      alert("Failed to save draft");
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="page">
            <nav className="nav">
              <div className="logo">ContentForge</div>
            </nav>

            {/* HERO + SEARCH */}
            <section className="hero-search">
              <h1 className="hero-title">
                Build. Customize. Distribute.{" "}
                <span className="highlight">ContentForge.</span>
              </h1>

              <p className="hero-subtitle">
                AI-powered content creation for developers & creators.
                Generate small, high-quality drafts effortlessly.
              </p>

              <div className="generator">
                <input
                  placeholder="Enter a topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <button onClick={generateContent} disabled={loading}>
                  {loading ? "Generating..." : "Generate"}
                </button>
              </div>
            </section>

            {aiData && (
              <section className="result">
                <h2>{aiData.title}</h2>
                <ReactMarkdown>{aiData.content}</ReactMarkdown>
                <button className="save-btn" onClick={saveDraft}>
                  Save Draft
                </button>
              </section>
            )}

            <DraftList drafts={drafts} setDrafts={setDrafts} />
          </div>
        }
      />
      <Route path="/draft/:id/edit" element={<EditDraft />} />
      <Route path="/draft/:id" element={<DraftDetail />} />
    </Routes>
  );
}
