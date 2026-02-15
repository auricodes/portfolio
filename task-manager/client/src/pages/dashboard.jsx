import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../auth.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: token },
      });
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        { title },
        { headers: { Authorization: token } }
      );
      setTitle("");
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { completed: !completed },
        { headers: { Authorization: token } }
      );

      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Dashboard</h2>

        <form onSubmit={createTask}>
          <input
            type="text"
            placeholder="Nuova Task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Aggiungi</button>
        </form>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task._id, task.completed)}
              />

              <span
                className={task.completed ? "completed" : ""}
              >
                {task.title}
              </span>
            </li>
          ))}
        </ul>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
