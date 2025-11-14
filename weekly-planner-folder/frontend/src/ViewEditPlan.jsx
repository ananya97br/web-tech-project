/*import React, { useState, useEffect } from "react";
import axios from "axios";

const daysOfWeek = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

function ViewEditPlan({ username, title }) {
  const [plan, setPlan] = useState(null);
  const [edit, setEdit] = useState(false);
  const [days, setDays] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/plan/${encodeURIComponent(username)}/${encodeURIComponent(title)}`)
      .then(res => {
        setPlan(res.data);
        setDays(res.data.days || {});
        setError(null);
      })
      .catch(err => {
        setPlan(null);
        setError(
          err?.response?.status === 404
            ? "Plan not found."
            : "Error fetching plan."
        );
        console.error("Fetch error:", err);
      });
  }, [username, title]);

  const handleChange = (day, value) => {
    setDays(prev => ({ ...prev, [day]: value }));
  };

  const handleEdit = () => setEdit(true);

  const handleSave = () => {
    axios
      .put(
        `/plan/${encodeURIComponent(username)}/${encodeURIComponent(title)}`,
        { days }
      )
      .then(res => {
        setPlan({ ...plan, days });
        setEdit(false);
        setError(null);
      })
      .catch(err => {
        setError("Error saving plan.");
        console.error("Save error:", err);
      });
  };

  const handleDelete = () => {
    axios
      .delete(
        `/plan/${encodeURIComponent(username)}/${encodeURIComponent(title)}`
      )
      .then(() => {
        alert("Deleted!");
        setPlan(null);
        setDays({});
        setError("Plan deleted.");
      })
      .catch(err => {
        setError("Error deleting plan.");
        console.error("Delete error:", err);
      });
  };

  if (error) return <div>{error}</div>;
  if (!plan) return <div>Loading...</div>;

  return (
    <div className="plan-box">
      <h2>VIEW OR EDIT A PLAN</h2>
      <div>
        <span>TITLE:</span>
        <input type="text" value={plan.title} disabled />
      </div>
      {daysOfWeek.map(day => (
        <div key={day}>
          <span>{day.toUpperCase()}:</span>
          <input
            type="text"
            value={days[day] || ""}
            disabled={!edit}
            onChange={e => handleChange(day, e.target.value)}
          />
        </div>
      ))}
      {edit ? (
        <button onClick={handleSave}>SAVE</button>
      ) : (
        <button onClick={handleEdit}>EDIT</button>
      )}
      <button onClick={handleDelete} style={{ background: "pink" }}>
        DELETE
      </button>
    </div>
  );
}

export default ViewEditPlan;*/
import React, { useState, useEffect } from "react";
import axios from "axios";

const daysOfWeek = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

function ViewEditPlan({ username, title }) {
  const [plan, setPlan] = useState(null);
  const [edit, setEdit] = useState(false);
  const [days, setDays] = useState({});
  const [error, setError] = useState(null);
  const [addMode, setAddMode] = useState(false);

  useEffect(() => {
    axios
      .get(`/plan/${encodeURIComponent(username)}/${encodeURIComponent(title)}`)
      .then(res => {
        setPlan(res.data);
        setDays(res.data.days || {});
        setError(null);
        setAddMode(false);
      })
      .catch(err => {
        setPlan(null);
        if (err?.response?.status === 404) {
          setError("Plan not found.");
        } else {
          setError("Error fetching plan.");
        }
        setAddMode(false);
      });
  }, [username, title]);

  const handleChange = (day, value) => {
    setDays(prev => ({ ...prev, [day]: value }));
  };

  const handleEdit = () => setEdit(true);

  const handleSave = () => {
    axios
      .put(
        `/plan/${encodeURIComponent(username)}/${encodeURIComponent(title)}`,
        { days }
      )
      .then(res => {
        setPlan({ ...plan, days });
        setEdit(false);
        setError(null);
      })
      .catch(err => {
        setError("Error saving plan.");
        console.error("Save error:", err);
      });
  };

  const handleDelete = () => {
    axios
      .delete(
        `/plan/${encodeURIComponent(username)}/${encodeURIComponent(title)}`
      )
      .then(() => {
        alert("Deleted!");
        setPlan(null);
        setDays({});
        setError(null);
        setAddMode(true); // Show add form!
      })
      .catch(err => {
        setError("Error deleting plan.");
        console.error("Delete error:", err);
      });
  };

  const handleAddPlan = () => {
    axios
      .post("/plan", {
        username,
        title,
        days
      })
      .then(res => {
        alert("Plan created!");
        setPlan(res.data);
        setAddMode(false);
        setError(null);
      })
      .catch(err => {
        setError("Error creating plan.");
        console.error("Add error:", err);
      });
  };

  if (addMode) {
    return (
      <div className="plan-box">
        <h2>ADD A NEW PLAN</h2>
        <div>
          <span>TITLE:</span>
          <input type="text" value={title} disabled />
        </div>
        {daysOfWeek.map(day => (
          <div key={day}>
            <span>{day.toUpperCase()}:</span>
            <input
              type="text"
              value={days[day] || ""}
              onChange={e => handleChange(day, e.target.value)}
            />
          </div>
        ))}
        <button onClick={handleAddPlan}>ADD PLAN</button>
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div>
        <div>{error}</div>
        <button onClick={() => setAddMode(true)}>Add New Plan</button>
      </div>
    );
  }
  if (!plan) return <div>Loading...</div>;

  return (
    <div className="plan-box">
      <h2>VIEW OR EDIT A PLAN</h2>
      <div>
        <span>TITLE:</span>
        <input type="text" value={plan.title} disabled />
      </div>
      {daysOfWeek.map(day => (
        <div key={day}>
          <span>{day.toUpperCase()}:</span>
          <input
            type="text"
            value={days[day] || ""}
            disabled={!edit}
            onChange={e => handleChange(day, e.target.value)}
          />
        </div>
      ))}
      {edit ? (
        <button onClick={handleSave}>SAVE</button>
      ) : (
        <button onClick={handleEdit}>EDIT</button>
      )}
      <button onClick={handleDelete} style={{ background: "pink" }}>
        DELETE
      </button>
    </div>
  );
}

export default ViewEditPlan;
