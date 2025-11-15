
import React, { useState } from "react";
import './Navbar.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import AddPost from "./AddPost"; // Your existing Post component
import ViewPosts from "./ViewPosts";
import ViewEditPlan from "./ViewEditPlan"; // Your existing Plan component
import CalorieTracker from "./CalorieTracker"; // CalorieTracker component (create in same folder or adjust import)
import ProfilePage from "./ProfilePage";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">SIGN UP</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Username</label>
            <input
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-group">
            <label className="auth-label">Confirm</label>
            <input
              className="auth-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">SIGN UP</button>
        </form>
        {message && <p className="auth-message">{message}</p>}
        <p className="auth-link">
          Have An Account? <Link to="/login">Login</Link>
        </p>
      </div>
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
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">LOGIN</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Username</label>
            <input
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">LOGIN</button>
        </form>
        {message && <p className="auth-message">{message}</p>}
        <p className="auth-link">
          Don't Have An Account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

function Dashboard({ username, onLogout }) {
  const [postView, setPostView] = useState("add"); // "add" or "view"
  const [refreshPosts, setRefreshPosts] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="app-container">
      <header className="header-navbar">
        <div className="navbar-left">
          <span 
            className={currentPath === "/dashboard/plan" ? "active" : ""} 
            onClick={() => navigate("/dashboard/plan")}
            style={{ cursor: "pointer" }}
          >
            PLAN
          </span>
          <span 
            className={currentPath === "/dashboard/posts" ? "active" : ""} 
            onClick={() => navigate("/dashboard/posts")}
            style={{ cursor: "pointer" }}
          >
            POSTS
          </span>
          <span 
            className={currentPath === "/dashboard/calories" ? "active" : ""} 
            onClick={() => navigate("/dashboard/calories")}
            style={{ cursor: "pointer" }}
          >
            CALORIES
          </span>
        </div>
        <div className="navbar-center">
          <span 
            className={currentPath === "/dashboard/achievements" ? "active" : ""} 
            onClick={() => navigate("/dashboard/achievements")}
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
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/plan" replace />} />
          <Route path="/plan" element={<ViewEditPlan username={username} />} />
          <Route path="/posts" element={
            <div>
              <div style={{ marginBottom: "2rem", marginTop: "1rem", marginLeft: "1.1rem", marginRight: "1.1rem", display: "flex", gap: "1rem" }}>
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
          } />
          <Route path="/calories" element={<CalorieTracker username={username} />} />
          <Route path="/achievements" element={<ViewPosts username={username} refresh={refreshPosts} isAchievementsView={true} />} />
        </Routes>
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
          path="/dashboard/*"
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

