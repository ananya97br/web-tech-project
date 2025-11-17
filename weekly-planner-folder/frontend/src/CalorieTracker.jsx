import React, { useState, useEffect } from "react";

function CalorieTracker({ username }) {
  const [calories, setCalories] = useState("");//current calorie input
  const [log, setLog] = useState([]);//array of calories
  const [message, setMessage] = useState("");//message
  const [weeklyCalories, setWeeklyCalories] = useState(0);//sum of calories

  useEffect(() => {
    fetchCalories();
  }, [username]);

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Adjust to start on Sunday
    return new Date(d.setDate(diff));
  };

  const fetchCalories = async () => {
    //called once the component is added or the username changes
    try {
      const res = await fetch(`http://localhost:3001/calorie/${username}`, {
        credentials: "include",//cookies
      });
      if (res.ok) {
        const data = await res.json();
        setLog(data);
        
        // Calculate this week's calories
        const now = new Date();
        const weekStart = getWeekStart(now);
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        
        const weeklyTotal = data
        //basically we are filtering the data so tht it is always between weekstart and weekend
          .filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= weekStart && entryDate < weekEnd;
          })
          .reduce((sum, entry) => sum + entry.calories, 0);
        
        setWeeklyCalories(weeklyTotal);
      }
    } catch (err) {
      console.error("Failed to fetch calories:", err);
    }
  };

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

      setCalories("");
      setMessage(data.message || "Calories logged!");
      fetchCalories();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Calorie POST error:", err);
      setMessage("Network error while saving calories");
    }
  };

  const handleKeyPress = (e) => {//when user presses enter add the caloroes
    if (e.key === "Enter") {
      addCalories();
    }
  };

  return (
    <div className="calorie-tracker-container">
      <div className="calorie-header">
        <h2 className="calorie-title">CALORIE TRACKER</h2>
        <div className="calorie-total">
          This Week: <span className="total-number">{weeklyCalories}</span> kcal
        </div>
      </div>

      <div className="calorie-input-section">
        <div className="calorie-input-group">
          <label className="calorie-label">Enter Calories</label>
          <input
            className="calorie-input"
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button className="calorie-add-btn" onClick={addCalories}>
          + Add
        </button>
      </div>

      {message && <p className="calorie-message">{message}</p>}

      <div className="calorie-log-section">
        <h3 className="log-title">Calorie Log</h3>
        {log.length === 0 ? (
          <p className="no-entries">No entries yet. Start tracking your calories!</p>
        ) : (
          <div className="calorie-entries">
            {log.map((entry, index) => (//rruns thro the entries for each entry it renders the react element
              <div key={index} className="calorie-entry">
                <div className="entry-calories">{entry.calories} kcal</div>
                <div className="entry-date">
                  {new Date(entry.date).toLocaleString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CalorieTracker;
