import React, { useEffect, useState } from "react";
import axios from "axios";
import './ViewPosts.css';

function ViewPosts({ username, refresh }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [username, refresh]);

  function loadPosts() {
    setLoading(true);
    axios.get(`/post/${encodeURIComponent(username)}`)
      .then(res => {
        setPosts(res.data || []);
        setError("");
      })
      .catch(err => {
        setError("Could not load posts");
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }

  function deletePost(postId) {
    if (window.confirm("Delete this post?")) {
      axios.delete(`/post/${postId}`)
        .then(() => loadPosts())
        .catch(() => setError("Could not delete post"));
    }
  }

  return (
    <div className="posts-container">
      <h2 className="posts-title">ALL POSTS</h2>
      
      {error && <div className="posts-error">{error}</div>}
      
      <div className="posts-actions">
        <button className="refresh-btn" onClick={loadPosts} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="posts-loading">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="posts-empty">
          <p>No posts yet! Create one to get started.</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <h3 className="post-title">{post.title}</h3>
                {post.achievement && <span className="post-achievement-badge">{post.achievement}</span>}
              </div>
              <p className="post-body">{post.body}</p>
              <div className="post-footer">
                <small className="post-date">
                  {post.createdAt && new Date(post.createdAt).toLocaleString()}
                </small>
                <button 
                  className="delete-btn"
                  onClick={() => deletePost(post._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewPosts;
