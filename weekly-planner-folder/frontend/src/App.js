
import React, { useState } from "react";
import './Navbar.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, Link } from "react-router-dom";
import AddPost from "./AddPost"; // Your existing Post component
import ViewPosts from "./ViewPosts";
import ViewEditPlan from "./ViewEditPlan"; // Your existing Plan component
import CalorieTracker from "./CalorieTracker"; // CalorieTracker component (create in same folder or adjust import)
import ProfilePage from "./ProfilePage";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (response.ok) {
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setMessage(data.message || "Signup failed");
    }
  }

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <br />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (response.ok) {
      onLogin(data.username);
      navigate("/dashboard");
    } else {
      setMessage(data.message || "Login failed");
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <br />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        No account? <Link to="/signup">Signup here</Link>
      </p>
    </div>
  );
}

function Dashboard({ username, onLogout }) {
  const [view, setView] = useState("plan");
  const [postView, setPostView] = useState("add"); // "add" or "view"
  const [refreshPosts, setRefreshPosts] = useState(0);

  return (
    <div className="app-container">
      <header className="header-navbar">
        <div className="navbar-left">
          <span 
            className={view === "plan" ? "active" : ""} 
            onClick={() => setView("plan")}
            style={{ cursor: "pointer" }}
          >
            PLAN
          </span>
          <span 
            className={view === "posts" ? "active" : ""} 
            onClick={() => setView("posts")}
            style={{ cursor: "pointer" }}
          >
            POSTS
          </span>
        </div>
        <div className="navbar-center">
          <span 
            className={view === "achievements" ? "active" : ""} 
            onClick={() => setView("achievements")}
            style={{ cursor: "pointer" }}
          >
            ACHIEVEMENTS
          </span>
        </div>
        <div className="navbar-right">
          <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <span className="navbar-username">{username}</span>
            <div className="profile-circle" />
          </Link>
          <button className="nav-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        {view === "plan" && <ViewEditPlan username={username} />}
        {view === "posts" && (
          <div>
            <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
              <button 
                className={`posts-tab-btn ${postView === "add" ? "active" : ""}`}
                onClick={() => setPostView("add")}
              >
                + Add Post
              </button>
              <button 
                className={`posts-tab-btn ${postView === "view" ? "active" : ""}`}
                onClick={() => setPostView("view")}
              >
                View All Posts
              </button>
            </div>
            {postView === "add" && <AddPost username={username} onPostCreated={() => {
              setRefreshPosts(refreshPosts + 1);
              setPostView("view");
            }} />}
            {postView === "view" && <ViewPosts username={username} refresh={refreshPosts} />}
          </div>
        )}
        {view === "calorie" && <CalorieTracker username={username} />}
        {view === "achievements" && <ViewPosts username={username} refresh={refreshPosts} isAchievementsView={true} />}
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  function handleLogout() {
    setUser(null);
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
        <Route
          path="/signup"
          element={!user ? <SignupPage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/login"
          element={!user ? <LoginPage onLogin={setUser} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard username={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage username={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

