const express = require("express");
const { run } = require("./database.js");
const router = express.Router();

// GET: Fetch all plans for a user
router.get("/plans/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const db = await run();
    const plans = await db.collection("plans").find({ username }).toArray();
    res.json(plans);
  } catch (err) {
    console.error("Fetch plans error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET: Fetch all posts for a user
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const db = await run();
    const posts = await db.collection("posts").find({ username }).toArray();
    res.json(posts);
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST: Create a new post
router.post("/", async (req, res) => {
  try {
    const { username, title, body, plan } = req.body;
    if (!username || !title || !body) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const db = await run();
    const result = await db.collection("posts").insertOne({
      username,
      title,
      body,
      plan: plan || null,
      createdAt: new Date()
    });
    res.json({ message: "Post created", _id: result.insertedId });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
