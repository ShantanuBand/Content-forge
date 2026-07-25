import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditDraft() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/drafts/${id}`);
        setTitle(res.data.title || "");
        setContent(res.data.content || "");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load draft");
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [id]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      alert("Title cannot be empty");
      return;
    }
    if (!content.trim()) {
      alert("Content cannot be empty");
      return;
    }

    try {
      setSaving(true);
      await axios.put(`/api/drafts/${id}`, {
        title: title.trim(),
        content: content.trim()
      });

      alert("Draft updated successfully ✅");
      navigate(`/draft/${id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update draft");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-container">
        <p style={{ color: "#94a3b8", textAlign: "center", paddingTop: "80px" }}>Loading draft for editing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-container" style={{ textAlign: "center", paddingTop: "80px" }}>
        <h2 style={{ color: "#ef4444", marginBottom: "16px" }}>{error}</h2>
        <button className="back-btn-link" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="edit-container">
      <button className="back-btn-link" onClick={() => navigate(`/draft/${id}`)}>
        ← Cancel
      </button>

      <div className="edit-card">
        <h2 style={{ fontFamily: "var(--font-heading)", color: "#ffffff", marginBottom: "24px", fontSize: "24px" }}>
          Edit Draft
        </h2>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "#94a3b8", fontSize: "14px", marginBottom: "8px", fontWeight: 500 }}>
            Title
          </label>
          <input
            className="edit-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Draft Title"
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", color: "#94a3b8", fontSize: "14px", marginBottom: "8px", fontWeight: 500 }}>
            Content (Markdown)
          </label>
          <textarea
            className="edit-textarea"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Draft Content"
          />
        </div>

        <button className="save-changes-btn" onClick={handleUpdate} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default EditDraft;
