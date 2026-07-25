import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FileTextIcon,
  SearchIcon,
  ClockIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon
} from "./Icons";

// Helper for human-readable relative time
function getRelativeTime(dateString) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
}

export default function DraftList({ drafts = [], setDrafts }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    setActiveMenuId(null);
    if (!window.confirm("Delete this draft?")) return;

    try {
      await axios.delete(`/api/drafts/${id}`);
      // ✅ remove draft from UI instantly
      if (typeof setDrafts === "function") {
        setDrafts((prev) => (Array.isArray(prev) ? prev.filter((d) => d._id !== id) : []));
      }
    } catch (err) {
      alert("Failed to delete draft");
    }
  };

  const handleEdit = (id, e) => {
    if (e) e.stopPropagation();
    setActiveMenuId(null);
    navigate(`/draft/${id}/edit`);
  };

  const safeDrafts = Array.isArray(drafts) ? drafts : [];

  const filteredDrafts = safeDrafts
    .filter((draft) => {
      if (!draft) return false;
      const query = searchQuery.toLowerCase();
      return (
        (draft.title && draft.title.toLowerCase().includes(query)) ||
        (draft.content && draft.content.toLowerCase().includes(query))
      );
    })
    .slice(0, 6);

  return (
    <section className="drafts-section">
      <div className="drafts-header">
        <div className="drafts-title-group">
          <h2>Your Drafts</h2>
          <p>Showing your 6 most recent AI-generated drafts.</p>
        </div>

        <div className="search-box">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search drafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredDrafts.length === 0 ? (
        <div className="no-drafts">
          {searchQuery ? `No drafts found matching "${searchQuery}"` : "No drafts available yet. Create your first draft above!"}
        </div>
      ) : (
        <div className="draft-grid">
          {filteredDrafts.map((draft) => (
            <div
              key={draft._id}
              className="draft-card"
              onClick={() => navigate(`/draft/${draft._id}`)}
            >
              <div className="draft-card-top">
                <div className="file-icon-badge">
                  <FileTextIcon />
                </div>

                <div style={{ position: "relative" }}>
                  <button
                    className="menu-trigger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === draft._id ? null : draft._id);
                    }}
                    title="Options"
                  >
                    <MoreVerticalIcon />
                  </button>

                  {activeMenuId === draft._id && (
                    <div
                      className="dropdown-popover"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="dropdown-item"
                        onClick={(e) => handleEdit(draft._id, e)}
                      >
                        <EditIcon /> Edit
                      </button>
                      <button
                        className="dropdown-item delete"
                        onClick={(e) => handleDelete(draft._id, e)}
                      >
                        <TrashIcon /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="draft-card-content">
                <h3 className="draft-card-title">{draft.title}</h3>
                <p className="draft-card-snippet">
                  {draft.content
                    ? draft.content
                        .replace(/[#*`_]/g, "")
                        .replace(/\n+/g, " ")
                        .slice(0, 140) + "..."
                    : "No description provided."}
                </p>
              </div>

              <div className="draft-card-footer">
                <div className="draft-time">
                  <ClockIcon />
                  <span>{getRelativeTime(draft.createdAt)}</span>
                </div>

                <button
                  className="view-card-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/draft/${draft._id}`);
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}