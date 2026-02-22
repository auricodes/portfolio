import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/app.css";

function PriorityDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const options = [
    { value: "low", label: "low", dotClass: "dot-low" },
    { value: "medium", label: "medium", dotClass: "dot-medium" },
    { value: "high", label: "high", dotClass: "dot-high" },
    { value: "critical", label: "critical", dotClass: "dot-critical" },
  ];

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        className="select"
        onClick={() => setOpen((s) => !s)}
        style={{
          textAlign: "left",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {selected?.label || "priority"}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #cfd4dc",
            borderRadius: 0,
            boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                borderBottom: "1px solid #eef0f3",
              }}
            >
              <span className={`dot ${opt.dotClass}`} />
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [labels, setLabels] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    const labelsArray = labels
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);

    try {
      await api.post("/issues", { title, description, priority, labels: labelsArray });
      navigate("/issues");
    } catch (err) {
      alert(err?.response?.data?.message || "Error creating issue");
    }
  };

  return (
    <div className="page-center">
      <div className="card newissue-card">
        <h2>New Issue</h2>

        <form onSubmit={handleCreate} className="form">
          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="textarea"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Priority</div>
            <PriorityDropdown value={priority} onChange={setPriority} />
          </div>

          <input
            className="input"
            placeholder="Labels (comma separated)"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
          />

          <button className="btn" type="submit">Create</button>
        </form>

        <p style={{ marginTop: 14 }}>
          <Link className="backlink" to="/issues">← Back to Issues</Link>
        </p>
      </div>
    </div>
  );
}
