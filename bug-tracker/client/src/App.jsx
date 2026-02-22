
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Issues from "./pages/Issues";
import IssueDetail from "./pages/IssueDetail";
import NewIssue from "./pages/NewIssue";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/issues"
          element={
            <PrivateRoute>
              <Issues />
            </PrivateRoute>
          }
        />

        <Route
          path="/issues/new"
          element={
            <PrivateRoute>
              <NewIssue />
            </PrivateRoute>
          }
        />

        <Route
          path="/issues/:id"
          element={
            <PrivateRoute>
              <IssueDetail />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
