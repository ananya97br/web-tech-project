import React, { useState, useEffect } from "react";
import axios from "axios";
import './AddPost.css'

function AddPost({ username }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [plan, setPlan] = useState("");
  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  // Load plans when component mounts
  useEffect(() => {
    loadPlans();
  }, [username]);

  function loadPlans() {
    axios
      .get(`/plan/all/${encodeURIComponent(username)}`)
      .then(res => setPlans(res.data || []))
      .catch(err => console.log("Could not load plans"));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      setMessage("Please fill in title and body");
      setMessageType("error");
      return;
    }

    try {
      await axios.post("/post", { username, title, body, plan: plan || null });
      setMessage("Post created successfully!");
      setMessageType("success");
      setTitle("");
      setBody("");
      setPlan("");
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error creating post. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="add-post-container">
      <h2 className="add-post-header"><span className="plus">+</span> ADD A POST</h2>

      <form className="add-post-card" onSubmit={handleSubmit}>
        <div className="row">
          <label className="left-label">TITLE:</label>
          <input
            className="input-field"
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="row">
          <label className="left-label">BODY:</label>
          <textarea
            className="input-field textarea-field"
            placeholder="Enter post content"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        <div className="row">
          <label className="left-label">PLAN:</label>
          <div className="plan-select-wrap">
            <select
              className="input-field"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              <option value="">-- Choose a plan (optional) --</option>
              {plans.map(p => (
                <option key={p.title} value={p.title}>
                  {p.title}
                </option>
              ))}
            </select>
            <div className="maybe">(optional)</div>
          </div>
        </div>

        <div className="row actions">
          <div />
          <button type="submit" className="post-btn">POST</button>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default AddPost;
