import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProfilePage.css";

function ProfilePage({ username }) {
  const [profile, setProfile] = useState({ name: "", profilePic: "" });
  const [plan, setPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  

  // Fetch user info (update "/user/:username" if your backend route is different)
  useEffect(() => {
    if (!username) return;
    axios.get(`/user/${encodeURIComponent(username)}`)
      .then(res => {
        const data = res.data || {};
        setProfile({ name: data.name || username, profilePic: data.profilePic || "" });
      })
      .catch(() => {});
  }, [username]);

  // Fetch all plans
  useEffect(() => {
    if (!username) return;
    axios.get(`/plan/all/${encodeURIComponent(username)}`)
      .then(res => {
        const data = res.data || [];
        setPlans(Array.isArray(data) ? data : []);
        setPlan((Array.isArray(data) && data.length > 0) ? data[0] : null);
      })
      .catch((err) => {
        console.error('Could not load plans', err);
        setPlans([]);
        setPlan(null);
        setError('Could not load plans');
      });
  }, [username]);

  // Fetch all posts
  useEffect(() => {
    if (!username) return;
    axios.get(`/post/${encodeURIComponent(username)}`)
      .then(res => setPosts(res.data || []))
      .catch((err) => {
        console.error('Could not load posts', err);
        setPosts([]);
        setError(prev => prev ? prev + '; Could not load posts' : 'Could not load posts');
      });
  }, [username]);

  

  return (
    <div className="profile-main">
      <aside className="profile-side">
        <div className="profile-pic-wrap">
          {profile.profilePic ? (
            <img src={profile.profilePic} alt="Profile" className="profile-pic" />
          ) : (
            <div className="profile-pic default" />
          )}
        </div>
        <div className="profile-username">{profile.name || username}</div>
      </aside>
      <section className="profile-content">
        <div className="profile-plan-section">
          <h3>Current Plan</h3>
          {error && <div className="profile-msg error">{error}</div>}
          {plans.length === 0 ? (
            <p>No plans yet.</p>
          ) : (
            plans.map((p) => (
              <div className="profile-plan-card" key={p._id || p.title}>
                <b>{p.title}</b>
                <ul>
                  {(() => {
                    const daysOrder = [
                      'monday','tuesday','wednesday','thursday','friday','saturday','sunday'
                    ];
                    return daysOrder.map((d) => {
                      const val = (p.days && (p.days[d] || p.days[d.charAt(0).toUpperCase()+d.slice(1)])) || '';
                      let display = '';
                      if (Array.isArray(val)) display = val.join(', ');
                      else if (typeof val === 'string') display = val;
                      else if (val && typeof val === 'object') display = JSON.stringify(val);
                      return (
                        <li key={d}>
                          <b>{d.toUpperCase().slice(0,3)}:</b> {display || '-'}
                        </li>
                      );
                    });
                  })()}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="profile-posts-section">
          <h3>All Posts</h3>
          {posts.length === 0 ? (
            <div>No posts yet.</div>
          ) : (
            posts.map(post => (
              <div className="profile-post-card" key={post._id}>
                <h4>{post.title}</h4>
                <div className="post-body">{post.body}</div>
                {post.achievement && <div className="post-achievement">Achievement: <strong>{post.achievement}</strong></div>}
                <div className="post-meta">{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
