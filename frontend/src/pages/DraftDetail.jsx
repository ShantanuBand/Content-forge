import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { EditIcon, TrashIcon } from "../components/Icons";
import { CodeBlock } from "../components/CodeBlock";

export default function DraftDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`/api/drafts/${id}`)
      .then((res) => {
        setDraft(res.data);
      })
      .catch((err) => {
        console.error("Fetch draft error:", err);
        setError(err.response?.data?.message || "Draft not found");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
    try {
      await axios.delete(`/api/drafts/${id}`);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete draft");
    }
  };

  if (loading) {
    return (
      <div className="detail-container">
        <p style={{ color: "#94a3b8", textAlign: "center", paddingTop: "80px" }}>Loading draft details...</p>
      </div>
    );
  }

  if (error || !draft) {
    return (
      <div className="detail-container" style={{ textAlign: "center", paddingTop: "80px" }}>
        <h2 style={{ color: "#ef4444", marginBottom: "16px" }}>{error || "Draft Not Found"}</h2>
        <p style={{ color: "#94a3b8", marginBottom: "24px" }}>The requested draft could not be loaded or may have been deleted.</p>
        <button className="back-btn-link" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <button className="back-btn-link" onClick={() => navigate("/")}>
        ← Back to Dashboard
      </button>

      <div className="edit-card">
        <div className="result-header">
          <h1 className="result-title">{draft.title}</h1>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              className="view-card-btn"
              onClick={() => navigate(`/draft/${id}/edit`)}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <EditIcon /> Edit
            </button>
            <button
              className="view-card-btn"
              onClick={handleDelete}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(239, 68, 68, 0.15)",
                borderColor: "rgba(239, 68, 68, 0.3)",
                color: "#f87171"
              }}
            >
              <TrashIcon /> Delete
            </button>
          </div>
        </div>

        <div className="result-body">
          <ReactMarkdown components={{ code: CodeBlock }}>{draft.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
