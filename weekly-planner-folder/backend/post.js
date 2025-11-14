const express = require("express");
const { run } = require("./database.js");
const { ObjectId } = require("mongodb");
const router = express.Router();

// GET: Fetch all posts for a user
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const db = await run();
    const posts = await db.collection("posts").find({ username }).sort({ createdAt: -1 }).toArray();
    res.json(posts);
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST: Create a new post
router.post("/", async (req, res) => {
  try {
    const { username, title, body, achievement } = req.body;
    if (!username || !title || !body) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const db = await run();
    const result = await db.collection("posts").insertOne({
      username,
      title,
      body,
      achievement: achievement || null,
      createdAt: new Date()
    });
    res.json({ message: "Post created", _id: result.insertedId });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE: Delete a post
router.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const db = await run();
    const result = await db.collection("posts").deleteOne({ _id: new ObjectId(postId) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
