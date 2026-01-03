import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditDraft() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const res = await axios.get(`/api/drafts/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        console.error(err);
        alert("Failed to load draft");
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/drafts/${id}`, {
        title,
        content
      });

      alert("Draft updated successfully ✅");
      navigate(`/draft/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update draft");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Draft</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <br /><br />

      <textarea
        rows={12}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        style={{ width: "100%" }}
      />

      <br /><br />

      <button onClick={handleUpdate}>Save Changes</button>
    </div>
  );
}

export default EditDraft;
