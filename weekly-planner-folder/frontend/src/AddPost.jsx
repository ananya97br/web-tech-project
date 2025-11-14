import React, { useState } from "react";
import axios from "axios";

function AddPost({ username }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [plan, setPlan] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/post", { username, title, body, plan });
      setMessage("Post created!");
      setTitle("");
      setBody("");
      setPlan("");
    } catch (err) {
      setMessage("Error creating post.");
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="row">
          <label className="left-label">BODY:</label>
          <textarea
            className="input-field textarea-field"
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
              <option value="">-- choose plan --</option>
              <option value="plan1">Plan 1</option>
              <option value="plan2">Plan 2</option>
            </select>
            <div className="maybe">(maybe...)</div>
          </div>
        </div>

        <div className="row actions">
          <div />
          <button type="submit" className="post-btn">POST</button>
        </div>

        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
}

export default AddPost;
