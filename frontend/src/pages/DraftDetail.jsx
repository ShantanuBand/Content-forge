import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function DraftDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    axios.get(`/api/drafts/${id}`).then((res) => setDraft(res.data));
  }, [id]);

  if (!draft) return <p>Loading...</p>;

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate("/")}>
  ← Back
</button>

      <section className="result">
        <h2>{draft.title}</h2>
        <ReactMarkdown>{draft.content}</ReactMarkdown>
      </section>
    </div>
  );
}
