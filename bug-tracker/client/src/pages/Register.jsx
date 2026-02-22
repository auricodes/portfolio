import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/app.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", { username, email, password });
      alert("Registered successfully. Now login.");
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration error";
      alert(msg);
    }
  };

  return (
    <div className="page-center">
      <div className="card auth-card">
        <h2>Register</h2>

        <form onSubmit={handleRegister} className="form">
          <input
            className="input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn" type="submit">Register</button>
        </form>

        <p className="muted">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
