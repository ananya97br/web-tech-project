

import React, { useState, useEffect } from "react";
import axios from "axios";//used to send http requests to ur backend
import './Plan.css';

const daysOfWeek = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];//array
//each plane is linked to current user
function ViewEditPlan({ username }) {
  const [plans, setPlans] = useState([]);//all plans
  const [currentPlan, setCurrentPlan] = useState(null);//currentplan being viewed or edited
  const [days, setDays] = useState({});//object storing each days activities
  const [showAdd, setShowAdd] = useState(false);//this is for add new plan
  const [newTitle, setNewTitle] = useState("");//title of plan being created
  const [error, setError] = useState("");//somethin goes wrong
  const [isEditing, setIsEditing] = useState(false);//current plan to edit

  // Load all plans for user
  useEffect(() => {
    loadPlans();//getting all plans of user
  }, [username]);

  function loadPlans() {
    axios.get(`/plan/all/${encodeURIComponent(username)}`)
      .then(res => setPlans(res.data || []))//saves the list inside the plans storage
      .catch(() => setPlans([]));
  }

  // View a specific plan
  function viewPlan(title) {
    axios.get(`/plan/${encodeURIComponent(username)}/${encodeURIComponent(title)}`)
      .then(res => {
        setCurrentPlan(res.data);
        setDays(res.data.days || {});
        setError("");
        setShowAdd(false);//disabled so tht it doesnt create issues
        setIsEditing(false);
      })
      .catch(() => setError("Could not load plan"));
  }

  // Add a new plan
  function handleAddNew() {
    if (!newTitle.trim()) {
      setError("Plan title cannot be empty");
      return;
    }
    axios.post("/plan", { username, title: newTitle, days })
      .then(() => {
        setShowAdd(false);
        setNewTitle("");
        setDays({});
        setError("");
        setIsEditing(false);
        loadPlans();
      })
      .catch(() => setError("Could not create plan. Title might already exist."));
  }

  // Save edited plan basically save changes
  function handleSave() {
    if (!currentPlan) return;//checking if there is a current selected plan
    //put request to update plan on backend
    axios.put(`/plan/${encodeURIComponent(username)}/${encodeURIComponent(currentPlan.title)}`, { days })
      .then(() => {
        setCurrentPlan({ ...currentPlan, days });
        setIsEditing(false);
        setError("");
        loadPlans();//reload to show latest saved data
      })
      .catch(() => setError("Could not save plan"));
  }

  // Delete a plan
  function handleDelete() {
    if (!currentPlan) return;
    if (window.confirm(`Delete plan "${currentPlan.title}"?`)) {
      axios.delete(`/plan/${encodeURIComponent(username)}/${encodeURIComponent(currentPlan.title)}`)
        .then(() => {
          setCurrentPlan(null);
          setDays({});
          setError("");
          loadPlans();
        })
        .catch(() => setError("Could not delete plan"));
    }
  }

  // udates the specific day in days object
  function handleDayChange(day, value) {
    setDays(prev => ({ ...prev, [day]: value }));
  }

  return (
    <div className="plan-container">
      <div className="plan-header">
        <h2>PLAN MANAGEMENT</h2>
       {error && <div className="plan-error">{error}</div>}
      </div>

      <div className="plans-list">
        <button 
          className="plan-btn plan-add-btn" 
          onClick={() => {
            setShowAdd(true);
            setCurrentPlan(null);
            setNewTitle("");
            setDays({});
            setError("");
            setIsEditing(false);
          }}
        >
          + Add New Plan
        </button>
      {plans.map(p => (
          <button 
            key={p.title} 
            className={`plan-btn ${currentPlan?.title === p.title ? 'active' : ''}`}
            onClick={() => viewPlan(p.title)}
          >
            {p.title}
          </button>
        ))}
      </div>
  
      {showAdd ? (
        <div className="plan-form-container">
          <h3>Add New Plan</h3>
          <div className="plan-form-group">
            <label>Plan Title:</label>
            <input 
              type="text" 
              placeholder="Enter plan name" 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="plan-input"
            />
          </div>
          {daysOfWeek.map(day => (
            <div key={day} className="plan-form-group">
              <label>{day.toUpperCase()}:</label>
              <input 
                type="text" 
                value={days[day] || ""}
                onChange={e => handleDayChange(day, e.target.value)}
                className="plan-input"
              />
            </div>
          ))}
          <div className="plan-actions">
            <button onClick={handleAddNew} className="plan-action-btn save-btn">Create Plan</button>
            <button onClick={() => setShowAdd(false)} className="plan-action-btn cancel-btn">Cancel</button>
          </div>
        </div>
      ) : currentPlan ? (
        <div className="plan-form-container">
          <h3>{currentPlan.title}</h3>
          <div className="plan-form-group">
            <label>Title:</label>
            <input 
              type="text" 
              value={currentPlan.title} 
              disabled 
              className="plan-input disabled"
            />
          </div>
          {daysOfWeek.map(day => (
            <div key={day} className="plan-form-group">
              <label>{day.toUpperCase()}:</label>
              <input 
                type="text" 
                value={days[day] || ""}
                onChange={e => handleDayChange(day, e.target.value)}
                disabled={!isEditing}
                className={`plan-input ${!isEditing ? 'disabled' : ''}`}
              />
            </div>
          ))}
          <div className="plan-actions">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="plan-action-btn save-btn">Save</button>
                <button onClick={() => {
                  setIsEditing(false);
                  setDays(currentPlan.days || {});
                }} className="plan-action-btn cancel-btn">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="plan-action-btn edit-btn">Edit</button>
                <button onClick={handleDelete} className="plan-action-btn delete-btn">Delete</button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="plan-empty">
          <p>Select a plan or create a new one to get started</p>
        </div>
      )}
    </div>
  );
}

export default ViewEditPlan;
