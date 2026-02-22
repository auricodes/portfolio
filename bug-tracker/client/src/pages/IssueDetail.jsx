import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/app.css";

function PriorityDot({ priority }) {
  const cls =
    priority === "critical"
      ? "dot-critical"
      : priority === "high"
      ? "dot-high"
      : priority === "medium"
      ? "dot-medium"
      : "dot-low";

  return (
    <span className="prio">
      <span className={`dot ${cls}`} />
      {priority}
    </span>
  );
}

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [commentText, setCommentText] = useState("");

  const fetchIssue = async () => {
    const res = await api.get(`/issues/${id}`);
    setIssue(res.data);
  };

  useEffect(() => {
    fetchIssue();
    // eslint-disable-next-line
  }, [id]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await api.post(`/issues/${id}/comments`, { text: commentText });
    setCommentText("");
    fetchIssue();
  };

  // ✅ (3) Update status
  const updateStatus = async (newStatus) => {
    try {
      await api.put(`/issues/${id}`, { status: newStatus });
      fetchIssue();
    } catch (err) {
      alert(err?.response?.data?.message || "Error updating status");
    }
  };

  // ✅ (3) Delete comment
  const deleteComment = async (commentId) => {
    const ok = window.confirm("Delete this comment?");
    if (!ok) return;

    try {
      await api.delete(`/issues/${id}/comments/${commentId}`);
      fetchIssue();
    } catch (err) {
      alert(err?.response?.data?.message || "Error deleting comment");
    }
  };

  if (!issue) {
    return (
      <div className="issues-shell">
        <div className="card issues-box" style={{ padding: 24 }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="issues-shell">
      <div className="card issues-box">
        <div className="topbar">
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>

        <div style={{ padding: 14 }}>
          <Link className="backlink" to="/issues">← Back to Issues</Link>

          <h2 style={{ marginTop: 12 }}>{issue.title}</h2>
          <p style={{ marginTop: 6, opacity: 0.9 }}>{issue.description}</p>

          <div className="meta" style={{ marginTop: 10 }}>
            <span>
              Status:{" "}
              <select
                className="select"
                value={issue.status}
                onChange={(e) => updateStatus(e.target.value)}
                style={{ width: "auto", display: "inline-block", marginLeft: 8 }}
              >
                <option value="open">open</option>
                <option value="in_progress">in_progress</option>
                <option value="closed">closed</option>
              </select>
            </span>

            <span>Priority: <PriorityDot priority={issue.priority} /></span>
            <span>Labels: {issue.labels?.join(", ") || "-"}</span>
          </div>

          <hr style={{ margin: "20px 0" }} />

          <h3 style={{ marginBottom: 10 }}>Comments</h3>

          <form onSubmit={addComment} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <input
              className="input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={{ flex: 1 }}
            />
            <button className="btn" type="submit">Add</button>
          </form>

          {issue.comments?.length === 0 ? (
            <p className="muted">No comments yet.</p>
          ) : (
            <ul className="issue-list">
              {issue.comments.map((c) => (
                <li key={c._id} className="issue-item" style={{ alignItems: "start" }}>
                  <div>
                    <div style={{ fontSize: 14, marginBottom: 6 }}>
                      <strong>{c.author?.username || "User"}</strong>{" "}
                      <span style={{ opacity: 0.7 }}>
                        ({new Date(c.createdAt).toLocaleString()})
                      </span>
                    </div>
                    <div>{c.text}</div>
                  </div>

                  <div className="row-actions">
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteComment(c._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
