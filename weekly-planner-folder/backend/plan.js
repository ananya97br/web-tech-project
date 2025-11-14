/*const express = require("express");
const { run } = require("./database.js");

const router = express.Router();

// GET: Fetch a plan by username AND title
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

// PUT: Edit/update a plan's days
router.put("/:username/:title", async (req, res) => {
  try {
    const { username, title } = req.params;
    const { days } = req.body; // expects { days: { monday: "...", ... } }

    if (!days) return res.status(400).json({ message: "Days data required" });

    const db = await run();
    const result = await db.collection("plans").updateOne(
      { username, title },
      { $set: { days } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.json({ message: "Plan updated", result });
  } catch (err) {
    console.error("Edit plan error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE: Remove a plan
router.delete("/:username/:title", async (req, res) => {
  try {
    const { username, title } = req.params;

    const db = await run();
    const result = await db.collection("plans").deleteOne({ username, title });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.json({ message: "Plan deleted" });
  } catch (err) {
    console.error("Delete plan error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;*/

const express = require("express");
const { run } = require("./database.js");
const router = express.Router();

// GET: Fetch a plan by username AND title
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

// PUT: Edit/update a plan's days
router.put("/:username/:title", async (req, res) => {
  try {
    const { username, title } = req.params;
    const { days } = req.body;
    if (!days) return res.status(400).json({ message: "Days data required" });
    const db = await run();
    const result = await db.collection("plans").updateOne(
      { username, title },
      { $set: { days } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.json({ message: "Plan updated", result });
  } catch (err) {
    console.error("Edit plan error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE: Remove a plan
router.delete("/:username/:title", async (req, res) => {
  try {
    const { username, title } = req.params;
    const db = await run();
    const result = await db.collection("plans").deleteOne({ username, title });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.json({ message: "Plan deleted" });
  } catch (err) {
    console.error("Delete plan error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST: Create a new plan
router.post("/", async (req, res) => {
  try {
    const { username, title, days } = req.body;
    if (!username || !title || !days) {
      return res.status(400).json({ message: "Missing required data" });
    }
    const db = await run();
    const result = await db.collection("plans").insertOne({ username, title, days });
    res.json({ username, title, days, _id: result.insertedId });
  } catch (err) {
    console.error("Add plan error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

