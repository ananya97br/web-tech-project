import React, { useState, useEffect } from "react";
import axios from "axios";
import './AddPost.css'

function AddPost({ username, onPostCreated }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [achievement, setAchievement] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      setMessage("Please fill in title and body");
      setMessageType("error");
      return;
    }

    try {
      await axios.post("/post", { username, title, body, achievement: achievement || null });
      setMessage("Post created successfully!");
      setMessageType("success");
      setTitle("");
      setBody("");
      setAchievement("");
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
      
      // Notify parent component to refresh posts
      if (onPostCreated) onPostCreated();
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
          <label className="left-label">ACHIEVEMENT:</label>
          <input
            className="input-field"
            type="text"
            placeholder="Enter achievement title"
            value={achievement}
            onChange={(e) => setAchievement(e.target.value)}
          />
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
