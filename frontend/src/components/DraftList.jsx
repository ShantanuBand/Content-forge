import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DraftList({ drafts, setDrafts }) {
  const navigate = useNavigate();

  if (!drafts.length) return null;

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this draft?")) return;

    try {
      await axios.delete(`/api/drafts/${id}`);
      // ✅ remove draft from UI instantly
      setDrafts((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert("Failed to delete draft");
    }
  };

  return (
    <section className="drafts">
      <h2>Your Drafts</h2>

      <div className="draft-grid">
        {drafts.slice(0, 6).map((draft) => (
          <div
            key={draft._id}
            className="draft-card"
            onClick={() => navigate(`/draft/${draft._id}`)}
          >
            <h3>{draft.title}</h3>
            <p>
              {draft.content?.slice(0, 140).replace(/\n/g, " ")}...
            </p>

            <div
              className="draft-actions"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="edit-btn"
                onClick={() =>
                  navigate(`/draft/${draft._id}/edit`)
                }
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(draft._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
