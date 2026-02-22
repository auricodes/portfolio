import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [label, setLabel] = useState("");
  const navigate = useNavigate();

  const fetchIssues = async () => {
    const params = {};
    if (priority) params.priority = priority;
    if (status) params.status = status;
    if (label) params.label = label;

    const res = await api.get("/issues", { params });
    setIssues(res.data);
  };

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const deleteIssue = async (id) => {
    const ok = window.confirm("Delete this issue?");
    if (!ok) return;

    try {
      await api.delete(`/issues/${id}`);
      fetchIssues();
    } catch (err) {
      alert(err?.response?.data?.message || "Error deleting issue");
    }
  };

  return (
    <div className="issues-shell">
      <div className="card issues-box">
        {/* Logout NON deve spingere giù il layout */}
        <div className="topbar">
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="issues-layout">
          {/* LEFT */}
          <div className="sidebar">
            <h2>ISSUES</h2>

            <Link className="btn" to="/issues/new" style={{ textDecoration: "none" }}>
              New Issue
            </Link>

            <div className="filters">
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All status</option>
                <option value="open">open</option>
                <option value="in_progress">in_progress</option>
                <option value="closed">closed</option>
              </select>

              <select className="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="">All priority</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
                <option value="critical">critical</option>
              </select>

              <input
                className="input"
                placeholder="Label (e.g. bug)"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />

              <button className="btn" onClick={fetchIssues}>
                Apply
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="content">
            <ul className="issue-list">
              {issues.map((issue) => (
                <li
                  key={issue._id}
                  className={`issue-item ${issue.status === "closed" ? "is-closed" : ""}`}
                >
                  <div className="issue-main">
                    <Link to={`/issues/${issue._id}`} className="issue-title">
                      {issue.title}
                    </Link>

                    <div className="meta">
                      <span>Status: {issue.status}</span>
                      <span>
                        Priority: <PriorityDot priority={issue.priority} />
                      </span>
                      <span>Labels: {issue.labels?.join(", ") || "-"}</span>
                      <span>Comments: {issue.comments?.length || 0}</span>
                    </div>
                  </div>

                  <div className="row-actions">
                    <Link
                      to={`/issues/${issue._id}`}
                      className="btn-outline-primary"
                      style={{
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path
                          d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Edit
                    </Link>

                    <button className="btn-outline-danger" onClick={() => deleteIssue(issue._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {issues.length === 0 && <p className="muted">No issues found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

