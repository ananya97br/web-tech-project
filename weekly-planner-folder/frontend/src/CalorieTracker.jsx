import React, { useState } from "react";

function CalorieTracker({ username }) {
  const [calories, setCalories] = useState("");
  const [log, setLog] = useState([]);
  const [message, setMessage] = useState("");

  const addCalories = async () => {
    if (calories.trim() === "" || isNaN(calories)) {
      setMessage("Please enter a valid calorie number");
      return;
    }

    try {
      const payload = { username, calories: Number(calories) };
      const res = await fetch("http://localhost:3001/calorie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data.message || "Failed to save calorie entry");
        return;
      }

      const newLog = [...log, { calories: Number(calories), date: new Date() }];
      setLog(newLog);
      setCalories("");
      setMessage(data.message || "Calories logged!");
    } catch (err) {
      console.error("Calorie POST error:", err);
      setMessage("Network error while saving calories");
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <h2>Calorie Tracker</h2>
      <input
        type="number"
        placeholder="Enter calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />
      <button onClick={addCalories} style={{ marginLeft: "1rem" }}>
        Add
      </button>
      {message && <p>{message}</p>}

      <h3>Logged Calories:</h3>
      <ul>
        {log.map((entry, index) => (
          <li key={index}>
            {entry.calories} kcal at {entry.date.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CalorieTracker;
