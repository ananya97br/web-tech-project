

const express = require("express");
const { run } = require("./database.js");//helper to connect to mongodb
const router = express.Router();

// Get all plans for a user
router.get("/all/:username", async (req, res) => {//all palns for a specific user
  try {
    const { username } = req.params;//fetch all docs from plan collections matching username
    const db = await run();//connect to db
    const plans = await db.collection("plans").find({ username }).toArray();
    res.json(plans);//sending it as a json response
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a specific plan by username and title
router.get("/:username/:title", async (req, res) => {
  try {
    const { username, title } = req.params;
    const db = await run();
    const plan = await db.collection("plans").findOne({ username, title });
    
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.json(plan);
  } catch (err) {
    console.error("Fetch plan error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a new plan
router.post("/", async (req, res) => {//creates a new plan
  try {
    const { username, title, days } = req.body;
    if (!username || !title || !days) {
      return res.status(400).json({ message: "Missing data" });
    }
    const db = await run();
    await db.collection("plans").insertOne({ username, title, days });
    res.json({ message: "Plan created" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Edit a plan
router.put("/:username/:title", async (req, res) => {
  try {
    const { username, title } = req.params;
    const { days } = req.body;
    const db = await run();
    const result = await db.collection("plans").updateOne({ username, title }, { $set: { days } });
    if (result.matchedCount === 0) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan updated" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a plan
router.delete("/:username/:title", async (req, res) => {
  try {
    const { username, title } = req.params;
    const db = await run();
    const result = await db.collection("plans").deleteOne({ username, title });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;//exporting router
