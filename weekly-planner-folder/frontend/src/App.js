/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/


/*import React from "react";
import ViewEditPlan from "./ViewEditPlan";
import "./App.css";

// import "./Plan.css";


function App() {
  return (
    <div className="app-main">
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#9cc2c3" }}>
        <div>
          <span style={{ marginRight: "2rem", fontWeight: "bold" }}>PLAN</span>
          <span style={{ fontWeight: "bold" }}>POSTS</span>
        </div>
        <div>
          <span style={{ marginRight: "1rem" }}>I_am_a_person</span>
          <span style={{
            display: "inline-block",
            width: 24, height: 24, borderRadius: "50%",
            background: "#fff",
            border: "2px solid #9cc2c3"
          }} />
        </div>
      </nav>
    
      <ViewEditPlan username="i_am_a_person" title="Plan 1" />
    </div>
  );
}

export default App;*/
/*import React, { useState } from "react";
import ViewEditPlan from "./ViewEditPlan";
import AddPost from "./AddPost"; // Import your new AddPost component
import "./App.css";

function App() {
  const [page, setPage] = useState("plan");
  const username = "i_am_a_person";
  const planTitle = "Plan 1";

  return (
    <div className="app-main">
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#9cc2c3" }}>
        <div>
          <span
            style={{
              marginRight: "2rem",
              fontWeight: page === "plan" ? "bold" : "normal",
              cursor: "pointer"
            }}
            onClick={() => setPage("plan")}
          >
            PLAN
          </span>
          <span
            style={{
              fontWeight: page === "posts" ? "bold" : "normal",
              cursor: "pointer"
            }}
            onClick={() => setPage("posts")}
          >
            POSTS
          </span>
        </div>
        <div>
          <span style={{ marginRight: "1rem" }}>{username}</span>
          <span style={{
            display: "inline-block",
            width: 24, height: 24, borderRadius: "50%",
            background: "#fff",
            border: "2px solid #9cc2c3"
          }} />
        </div>
      </nav>
      
      {page === "plan" && <ViewEditPlan username={username} title={planTitle} />}
      {page === "posts" && <AddPost username={username} />}
    </div>
  );
}

export default App;*/

/*import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const endpoint = isSignup ? "/signup" : "/login";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // for cookies and session
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      if (isSignup) {
        setMessage("Signup success! Please login.");
        setIsSignup(false);
      } else {
        setLoggedInUser(data.username);
        setMessage("Logged in successfully");
      }
    } else {
      setMessage(data.message || "Error");
    }
  }

  function handleLogout() {
    setLoggedInUser(null);
    setUsername("");
    setPassword("");
    setMessage("Logged out");
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "1rem" }}>
      <h2>{isSignup ? "Signup" : "Login"}</h2>

      {message && <p>{message}</p>}

      {!loggedInUser ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label><br />
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label><br />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">{isSignup ? "Signup" : "Login"}</button>
        </form>
      ) : (
        <div>
          <p>Welcome, {loggedInUser}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      <button onClick={() => setIsSignup(!isSignup)} style={{ marginTop: "1rem" }}>
        {isSignup ? "Go to Login" : "Create an account"}
      </button>
    </div>
  );
}

export default App;*/

/*import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, Link } from 'react-router-dom';
import AddPost from './AddPost'; // Your provided AddPost component
import ViewEditPlan from './ViewEditPlan'; // Your provided ViewEditPlan component

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (response.ok) {
      setMessage('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setMessage(data.message || 'Signup failed');
    }
  }

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label><br />
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>}
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (response.ok) {
      onLogin(data.username);
      navigate('/dashboard');
    } else {
      setMessage(data.message || 'Login failed');
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label><br />
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <p>No account? <Link to="/signup">Signup here</Link></p>
    </div>
  );
}

function Dashboard({ username, onLogout }) {
  const [view, setView] = useState('plan');

  return (
    <div>
      <header style={{ padding: '1rem', background: '#ccceca', display: 'flex', justifyContent: 'space-between' }}>
        <nav>
          <button onClick={() => setView('plan')} style={{ marginRight: '1rem' }}>Plan</button>
          <button onClick={() => setView('posts')}>Posts</button>
        </nav>
        <button onClick={onLogout}>Logout</button>
      </header>

      <main style={{ padding: '1rem' }}>
        {view === 'plan' && <ViewEditPlan username={username} title="Plan 1" />}
        {view === 'posts' && <AddPost username={username} />}
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
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <LoginPage onLogin={setUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard username={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;*/

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, Link } from "react-router-dom";
import AddPost from "./AddPost"; // Your existing Post component
import ViewEditPlan from "./ViewEditPlan"; // Your existing Plan component
import CalorieTracker from "./CalorieTracker"; // CalorieTracker component (create in same folder or adjust import)

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

  return (
    <div>
      <header
        style={{
          padding: "1rem",
          background: "#ccceca",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <nav>
          <button
            onClick={() => setView("plan")}
            style={{ marginRight: "1rem" }}
          >
            Plan
          </button>
          <button
            onClick={() => setView("posts")}
            style={{ marginRight: "1rem" }}
          >
            Posts
          </button>
          <button onClick={() => setView("calorie")}>Calorie Tracker</button>
        </nav>
        <button onClick={onLogout}>Logout</button>
      </header>

      <main style={{ padding: "1rem" }}>
        {view === "plan" && <ViewEditPlan username={username} title="Plan 1" />}
        {view === "posts" && <AddPost username={username} />}
        {view === "calorie" && <CalorieTracker username={username} />}
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
      </Routes>
    </Router>
  );
}

export default App;

